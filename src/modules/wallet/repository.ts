import { Knex } from "knex";
import { generateId } from "@/common/ids";
import { WalletAccount, WalletTransaction } from "@/types/wallet.types";

type DbOrTx = Knex | Knex.Transaction;

type WalletRow = {
  id: string;
  user_id: string;
  balance_units: string | number;
};

type TxRow = {
  id: string;
  type: "funding" | "withdrawal" | "transfer_debit" | "transfer_credit";
  amount_units: string | number;
  balance_before_units: string | number;
  balance_after_units: string | number;
  reference: string;
  related_user_id: string | null;
  narration: string;
  created_at: Date;
};

function toUnits(v: string | number): bigint {
  return BigInt(v);
}

function mapWallet(row: WalletRow): WalletAccount {
  return {
    id: row.id,
    userId: row.user_id,
    balanceUnits: toUnits(row.balance_units),
  };
}

function mapTx(row: TxRow): WalletTransaction {
  return {
    id: row.id,
    type: row.type,
    amountUnits: toUnits(row.amount_units),
    balanceBeforeUnits: toUnits(row.balance_before_units),
    balanceAfterUnits: toUnits(row.balance_after_units),
    reference: row.reference,
    relatedUserId: row.related_user_id,
    narration: row.narration,
    createdAt: row.created_at,
  };
}

export interface WalletRepository {
  create(data: { userId: string }, tx?: Knex.Transaction): Promise<WalletAccount>;
  findByUserId(
    userId: string,
    tx?: Knex.Transaction,
    forUpdate?: boolean
  ): Promise<WalletAccount | null>;
  updateBalanceUnits(
    accountId: string,
    newBalanceUnits: bigint,
    tx?: Knex.Transaction
  ): Promise<void>;
}

export interface WalletTransactionRepository {
  create(
    data: {
      walletAccountId: string;
      userId: string;
      type: "funding" | "withdrawal" | "transfer_debit" | "transfer_credit";
      amountUnits: bigint;
      balanceBeforeUnits: bigint;
      balanceAfterUnits: bigint;
      reference: string;
      relatedUserId: string | null;
      narration: string;
    },
    tx?: Knex.Transaction
  ): Promise<WalletTransaction>;

  listByUserId(userId: string, limit?: number): Promise<WalletTransaction[]>;
}

export function createWalletRepository(db: Knex): WalletRepository {
  const create = async (
    data: { userId: string },
    tx?: Knex.Transaction
  ): Promise<WalletAccount> => {
    const conn: DbOrTx = tx ?? db;
    const id = generateId();

    await conn("wallet_accounts").insert({
      id,
      user_id: data.userId,
      balance_units: 0,
    });

    return {
      id,
      userId: data.userId,
      balanceUnits: 0n,
    };
  };

  const findByUserId = async (
    userId: string,
    tx?: Knex.Transaction,
    forUpdate = false
  ): Promise<WalletAccount | null> => {
    const conn: DbOrTx = tx ?? db;

    let query = conn<WalletRow>("wallet_accounts")
      .where({ user_id: userId })
      .first();

    if (forUpdate && tx) {
      query = query.forUpdate();
    }

    const row = await query;
    return row ? mapWallet(row) : null;
  };

  const updateBalanceUnits = async (
    accountId: string,
    newBalanceUnits: bigint,
    tx?: Knex.Transaction
  ): Promise<void> => {
    const conn: DbOrTx = tx ?? db;

    await conn("wallet_accounts")
      .where({ id: accountId })
      .update({
        balance_units: newBalanceUnits.toString(), 
        updated_at: conn.fn.now(),
      });
  };

  return {
    create,
    findByUserId,
    updateBalanceUnits,
  };
}

export function createWalletTransactionRepository(
  db: Knex
): WalletTransactionRepository {
  const create = async (
    data: {
      walletAccountId: string;
      userId: string;
      type: "funding" | "withdrawal" | "transfer_debit" | "transfer_credit";
      amountUnits: bigint;
      balanceBeforeUnits: bigint;
      balanceAfterUnits: bigint;
      reference: string;
      relatedUserId: string | null;
      narration: string;
    },
    tx?: Knex.Transaction
  ): Promise<WalletTransaction> => {
    const conn: DbOrTx = tx ?? db;
    const id = generateId();

    await conn("wallet_transactions").insert({
      id,
      wallet_account_id: data.walletAccountId,
      user_id: data.userId,
      type: data.type,
      amount_units: data.amountUnits.toString(),
      balance_before_units: data.balanceBeforeUnits.toString(),
      balance_after_units: data.balanceAfterUnits.toString(),
      reference: data.reference,
      related_user_id: data.relatedUserId,
      narration: data.narration,
    });

    return {
      id,
      type: data.type,
      amountUnits: data.amountUnits,
      balanceBeforeUnits: data.balanceBeforeUnits,
      balanceAfterUnits: data.balanceAfterUnits,
      reference: data.reference,
      relatedUserId: data.relatedUserId,
      narration: data.narration,
      createdAt: new Date(),
    };
  };

  const listByUserId = async (
    userId: string,
    limit = 20
  ): Promise<WalletTransaction[]> => {
    const rows = (await db("wallet_transactions")
      .where("user_id", userId)
      .orderBy("created_at", "desc")
      .limit(limit)) as TxRow[];

    return rows.map(mapTx);
  };

  return {
    create,
    listByUserId,
  };
}
