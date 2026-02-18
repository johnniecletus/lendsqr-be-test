import type { Knex } from "knex";
import { describe, expect, it } from "@jest/globals";
import { AppError } from "../../src/common/errors";
import { createWalletService } from "../../src/modules/wallet/wallet.service";
import type {
  WalletRepository,
  WalletTransactionRepository,
} from "../../src/modules/wallet/repository";

function makeFakeDb(): Knex {
  return {
    transaction: async (cb: (trx: Knex.Transaction) => unknown) => cb({} as Knex.Transaction),
  } as unknown as Knex;
}

describe("WalletService", () => {
  it("funds wallet and returns new balance", async () => {
    const db = makeFakeDb();

    let updatedTo: bigint | null = null;

    const wallets: WalletRepository = {
      create: async () => ({ id: "w1", userId: "u1", balanceUnits: 0n }),
      findByUserId: async () => ({ id: "w1", userId: "u1", balanceUnits: 1000n }), 
      updateBalanceUnits: async (_id, newUnits) => {
        updatedTo = newUnits;
      },
    };

    const transactions: WalletTransactionRepository = {
      create: async (data) => ({
        id: "tx1",
        type: data.type,
        amountUnits: data.amountUnits,
        balanceBeforeUnits: data.balanceBeforeUnits,
        balanceAfterUnits: data.balanceAfterUnits,
        reference: data.reference,
        relatedUserId: data.relatedUserId,
        narration: data.narration,
        createdAt: new Date(),
      }),
      listByUserId: async () => [],
    };

    const service = createWalletService({ db, wallets, transactions });

    const result = await service.fund("u1", { amount: "5.25" }); 

    expect(result.balance).toBe("15.25");
    expect(updatedTo).toBe(1525n); 
  });

  it("rejects withdrawal when funds are insufficient", async () => {
    const db = makeFakeDb();

    const wallets: WalletRepository = {
      create: async () => ({ id: "w1", userId: "u1", balanceUnits: 0n }),
      findByUserId: async () => ({ id: "w1", userId: "u1", balanceUnits: 1000n }), 
      updateBalanceUnits: async () => undefined,
    };

    const transactions: WalletTransactionRepository = {
      create: async () => {
        throw new Error("not needed");
      },
      listByUserId: async () => [],
    };

    const service = createWalletService({ db, wallets, transactions });

    await expect(service.withdraw("u1", { amount: "50.00" })).rejects.toMatchObject({
      code: "INSUFFICIENT_BALANCE",
    } as Partial<AppError>);
  });

  it("transfers money between users (debit + credit)", async () => {
    const db = makeFakeDb();

    const balances: Record<string, bigint> = {
      sender: 2000n,   
      recipient: 300n, 
    };

    const wallets: WalletRepository = {
      create: async () => ({ id: "w-temp", userId: "temp", balanceUnits: 0n }),
      findByUserId: async (userId) => ({
        id: `w-${userId}`,
        userId,
        balanceUnits: balances[userId] ?? 0n,
      }),
      updateBalanceUnits: async (_walletId, newUnits, _trx) => {
        
        const userId = _walletId.replace("w-", "");
        balances[userId] = newUnits;
      },
    };

    const createdTypes: string[] = [];

    const transactions: WalletTransactionRepository = {
      create: async (data) => {
        createdTypes.push(data.type);
        return {
          id: "tx",
          type: data.type,
          amountUnits: data.amountUnits,
          balanceBeforeUnits: data.balanceBeforeUnits,
          balanceAfterUnits: data.balanceAfterUnits,
          reference: data.reference,
          relatedUserId: data.relatedUserId,
          narration: data.narration,
          createdAt: new Date(),
        };
      },
      listByUserId: async () => [],
    };

    const service = createWalletService({ db, wallets, transactions });

    const result = await service.transfer("sender", {
      toUserId: "recipient",
      amount: "7.00", 
    });

    expect(result.amount).toBe("7.00");
    expect(result.senderBalance).toBe("13.00");

    expect(balances.sender).toBe(1300n);    
    expect(balances.recipient).toBe(1000n);  

    
    expect(createdTypes).toContain("transfer_debit");
    expect(createdTypes).toContain("transfer_credit");
  });
});
