import type { Knex } from "knex";

export type Tx = Knex.Transaction;

export type UserRecord = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
};

export type WalletAccountRecord = {
  id: string;
  user_id: string;
  balance: string;
  created_at: Date;
  updated_at: Date;
};


export type TransactionType = "funding" | "withdrawal" | "transfer_debit" | "transfer_credit";


export type WalletTransactionRecord = {
  id: string;
  wallet_account_id: string;
  user_id: string;
  type: TransactionType;
  amount: string;
  balance_before: string;
  balance_after: string;
  reference: string;
  related_user_id: string | null;
  narration: string;
  created_at: Date;
};