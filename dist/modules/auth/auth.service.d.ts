import { SignupInput, LoginInput, AuthResult, PublicUser, AuthServiceDeps } from "@/types/auth.types";
export declare function createAuthService({ db, users, wallets }: AuthServiceDeps): {
    signup: (input: SignupInput) => Promise<AuthResult>;
    login: (input: LoginInput) => Promise<AuthResult>;
    getUserProfile: (userId: string) => Promise<PublicUser>;
};
