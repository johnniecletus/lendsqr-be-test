import { Knex } from "knex";
import { WalletAccount, WalletTransaction } from "@/types/wallet.types";
export interface WalletRepository {
    create(data: {
        userId: string;
    }, tx?: Knex.Transaction): Promise<WalletAccount>;
    findByUserId(userId: string, tx?: Knex.Transaction, forUpdate?: boolean): Promise<WalletAccount | null>;
    updateBalanceUnits(accountId: string, newBalanceUnits: bigint, tx?: Knex.Transaction): Promise<void>;
}
export interface WalletTransactionRepository {
    create(data: {
        walletAccountId: string;
        userId: string;
        type: "funding" | "withdrawal" | "transfer_debit" | "transfer_credit";
        amountUnits: bigint;
        balanceBeforeUnits: bigint;
        balanceAfterUnits: bigint;
        reference: string;
        relatedUserId: string | null;
        narration: string;
    }, tx?: Knex.Transaction): Promise<WalletTransaction>;
    listByUserId(userId: string, limit?: number): Promise<WalletTransaction[]>;
}
export declare function createWalletRepository(db: Knex): WalletRepository;
export declare function createWalletTransactionRepository(db: Knex): WalletTransactionRepository;
