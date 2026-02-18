import { Knex } from "knex";
import { AppError, NotFoundError } from "@/common/errors";
import {
  assertPositive,
  formatUnitsToAmount,
  parseAmountToUnits,
} from "@/common/money";
import { generateRef } from "@/common/ids";
import {
  WalletRepository,
  WalletTransactionRepository,
} from "@/modules/wallet/repository";
import { FundInput, TransferInput, WithdrawInput } from "@/types/wallet.types";

type WalletServiceDeps = {
  db: Knex;
  wallets: WalletRepository;
  transactions: WalletTransactionRepository;
};

export function createWalletService({
  db,
  wallets,
  transactions,
}: WalletServiceDeps) {
  const getBalance = async (userId: string) => {
    const wallet = await wallets.findByUserId(userId);
    if (!wallet) throw new NotFoundError("Wallet not found");

    return { balance: formatUnitsToAmount(wallet.balanceUnits) };
  };

  const fund = async (userId: string, input: FundInput) => {
    return db.transaction(async (trx) => {
      const wallet = await wallets.findByUserId(userId, trx, true);
      if (!wallet) throw new NotFoundError("Wallet not found");

      const amountUnits = parseAmountToUnits(input.amount);
      assertPositive(amountUnits);

      const beforeUnits = wallet.balanceUnits;
      const afterUnits = beforeUnits + amountUnits;

      const reference = generateRef("FUND");

      await wallets.updateBalanceUnits(wallet.id, afterUnits, trx);

      await transactions.create(
        {
          walletAccountId: wallet.id,
          userId,
          type: "funding",
          amountUnits,
          balanceBeforeUnits: beforeUnits,
          balanceAfterUnits: afterUnits,
          reference,
          relatedUserId: null,
          narration: input.narration ?? "Wallet funding",
        },
        trx
      );

      return { balance: formatUnitsToAmount(afterUnits), reference };
    });
  };

  const withdraw = async (userId: string, input: WithdrawInput) => {
    return db.transaction(async (trx) => {
      const wallet = await wallets.findByUserId(userId, trx, true);
      if (!wallet) throw new NotFoundError("Wallet not found");

      const amountUnits = parseAmountToUnits(input.amount);
      assertPositive(amountUnits);

      const beforeUnits = wallet.balanceUnits;

      if (beforeUnits < amountUnits) {
        throw new AppError("Insufficient balance", 400, "INSUFFICIENT_BALANCE");
      }

      const afterUnits = beforeUnits - amountUnits;
      const reference = generateRef("WD");

      await wallets.updateBalanceUnits(wallet.id, afterUnits, trx);

      await transactions.create(
        {
          walletAccountId: wallet.id,
          userId,
          type: "withdrawal",
          amountUnits,
          balanceBeforeUnits: beforeUnits,
          balanceAfterUnits: afterUnits,
          reference,
          relatedUserId: null,
          narration: input.narration ?? "Wallet withdrawal",
        },
        trx
      );

      return { balance: formatUnitsToAmount(afterUnits), reference };
    });
  };

  const transfer = async (fromUserId: string, input: TransferInput) => {
    const toUserId = input.toUserId;

    if (!toUserId) {
      throw new AppError("Recipient user is required", 400, "INVALID_TRANSFER");
    }

    if (fromUserId === toUserId) {
      throw new AppError("Cannot transfer to self", 400, "INVALID_TRANSFER");
    }

    return db.transaction(async (trx) => {
      const firstUserId = fromUserId < toUserId ? fromUserId : toUserId;
      const secondUserId = fromUserId < toUserId ? toUserId : fromUserId;

      const firstWallet = await wallets.findByUserId(firstUserId, trx, true);
      const secondWallet = await wallets.findByUserId(secondUserId, trx, true);

      const senderWallet =
        fromUserId === firstUserId ? firstWallet : secondWallet;
      const recipientWallet =
        fromUserId === firstUserId ? secondWallet : firstWallet;

      if (!senderWallet || !recipientWallet) {
        throw new NotFoundError("One or more wallet accounts not found");
      }

      const amountUnits = parseAmountToUnits(input.amount);
      assertPositive(amountUnits);

      const senderBefore = senderWallet.balanceUnits;
      if (senderBefore < amountUnits) {
        throw new AppError("Insufficient balance", 400, "INSUFFICIENT_BALANCE");
      }

      const recipientBefore = recipientWallet.balanceUnits;

      const senderAfter = senderBefore - amountUnits;
      const recipientAfter = recipientBefore + amountUnits;

      const reference = generateRef("TRF");
      const narration = input.narration ?? "Wallet transfer";

      await wallets.updateBalanceUnits(senderWallet.id, senderAfter, trx);
      await wallets.updateBalanceUnits(recipientWallet.id, recipientAfter, trx);

      await transactions.create(
        {
          walletAccountId: senderWallet.id,
          userId: fromUserId,
          type: "transfer_debit",
          amountUnits,
          balanceBeforeUnits: senderBefore,
          balanceAfterUnits: senderAfter,
          reference,
          relatedUserId: input.toUserId,
          narration,
        },
        trx
      );

      await transactions.create(
        {
          walletAccountId: recipientWallet.id,
          userId: input.toUserId,
          type: "transfer_credit",
          amountUnits,
          balanceBeforeUnits: recipientBefore,
          balanceAfterUnits: recipientAfter,
          reference,
          relatedUserId: fromUserId,
          narration,
        },
        trx
      );

      return {
        reference,
        amount: formatUnitsToAmount(amountUnits),
        senderBalance: formatUnitsToAmount(senderAfter),
      };
    });
  };

  const listTransactions = async (userId: string, limit = 20) => {
    const txs = await transactions.listByUserId(userId, limit);

    return txs.map((t) => {
      const { amountUnits, balanceBeforeUnits, balanceAfterUnits, ...rest } = t;

      return {
        ...rest,
        amount: formatUnitsToAmount(amountUnits),
        balanceBefore: formatUnitsToAmount(balanceBeforeUnits),
        balanceAfter: formatUnitsToAmount(balanceAfterUnits),
      };
    });
  };

  return {
    getBalance,
    fund,
    withdraw,
    transfer,
    listTransactions,
  };
}
