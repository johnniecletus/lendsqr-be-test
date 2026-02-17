import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "@/config/env";

function normalizePem(key: string) {
  return key.replace(/\\n/g, "\n").trim();
}

const privateKey = normalizePem(env.JWT_PRIVATE_KEY);
const publicKey = normalizePem(env.JWT_PUBLIC_KEY);

export type JwtUserPayload = {
  userId: string;
  email: string;
};

export type VerifyJwtResult = {
  payload: JwtUserPayload | null;
  expired: boolean;
};

export function signJWT(
  payload: JwtUserPayload,
  expiresIn: SignOptions["expiresIn"]
) {
  return jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn,
  });
}

export function verifyJWT(token: string): VerifyJwtResult {
  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    const userId = typeof decoded.userId === "string" ? decoded.userId : "";
    const email = typeof decoded.email === "string" ? decoded.email : "";

    if (!userId || !email) {
      return { payload: null, expired: false };
    }

    return {
      payload: { userId, email },
      expired: false,
    };
  } catch (error: any) {
    return {
      payload: null,
      expired: error?.name === "TokenExpiredError" || String(error?.message).includes("jwt expired"),
    };
  }
}

export const verifyJwt = verifyJWT;
