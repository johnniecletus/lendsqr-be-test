import { type SignOptions } from "jsonwebtoken";
export type JwtUserPayload = {
    userId: string;
    email: string;
};
export type VerifyJwtResult = {
    payload: JwtUserPayload | null;
    expired: boolean;
};
export declare function signJWT(payload: JwtUserPayload, expiresIn: SignOptions["expiresIn"]): string;
export declare function verifyJWT(token: string): VerifyJwtResult;
export declare const verifyJwt: typeof verifyJWT;
