export type WalletAccount = {
  id: string;
  userId: string;
  balanceUnits: bigint;
};

export type FundInput = {
  amount: string;
  narration?: string;
};

export type WithdrawInput = {
  amount: string;
  narration?: string;
};

export type TransferInput = {
  amount: string;
  toUserId: string;
  narration?: string;
};

export type WalletTransaction = {
  id: string;
  type: "funding" | "withdrawal" | "transfer_debit" | "transfer_credit";
  amountUnits: bigint;
  balanceBeforeUnits: bigint;
  balanceAfterUnits: bigint;
  reference: string;
  relatedUserId: string | null;
  narration: string;
  createdAt: Date;
};


export type WalletTransactionView = WalletTransaction & {
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
};
