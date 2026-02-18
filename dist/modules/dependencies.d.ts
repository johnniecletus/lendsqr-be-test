export declare const authService: {
    signup: (input: import("../types/auth.types").SignupInput) => Promise<import("../types/auth.types").AuthResult>;
    login: (input: import("../types/auth.types").LoginInput) => Promise<import("../types/auth.types").AuthResult>;
    getUserProfile: (userId: string) => Promise<import("../types/auth.types").PublicUser>;
};
export declare const walletService: {
    getBalance: (userId: string) => Promise<{
        balance: string;
    }>;
    fund: (userId: string, input: import("../types/wallet.types").FundInput) => Promise<{
        balance: string;
        reference: string;
    }>;
    withdraw: (userId: string, input: import("../types/wallet.types").WithdrawInput) => Promise<{
        balance: string;
        reference: string;
    }>;
    transfer: (fromUserId: string, input: import("../types/wallet.types").TransferInput) => Promise<{
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
