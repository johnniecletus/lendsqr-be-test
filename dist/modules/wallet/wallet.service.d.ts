import { Knex } from "knex";
import { WalletRepository, WalletTransactionRepository } from "../../modules/wallet/repository";
import { FundInput, TransferInput, WithdrawInput } from "@/types/wallet.types";
type WalletServiceDeps = {
    db: Knex;
    wallets: WalletRepository;
    transactions: WalletTransactionRepository;
};
export declare function createWalletService({ db, wallets, transactions, }: WalletServiceDeps): {
    getBalance: (userId: string) => Promise<{
        balance: string;
    }>;
    fund: (userId: string, input: FundInput) => Promise<{
        balance: string;
        reference: string;
    }>;
    withdraw: (userId: string, input: WithdrawInput) => Promise<{
        balance: string;
        reference: string;
    }>;
    transfer: (fromUserId: string, input: TransferInput) => Promise<{
        reference: string;
        amount: string;
        senderBalance: string;
    }>;
    listTransactions: (userId: string, limit?: number) => Promise<{
        id: string;
        type: "funding" | "withdrawal" | "transfer_debit" | "transfer_credit";
        reference: string;
        relatedUserId: string | null;
        narration: string;
        createdAt: Date;
        amount: string;
        balanceBefore: string;
        balanceAfter: string;
    }[]>;
};
export {};
