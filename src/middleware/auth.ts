import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@/common/errors";
import { verifyJwt } from "@/modules/auth/token.service";

export type AuthedRequest = Request & {
  auth?: {
    userId: string;
    email: string;
  };
};

export function authMiddleware(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      throw new UnauthorizedError("Unauthorized");
    }

    const { payload, expired } = verifyJwt(accessToken);

    if (expired) {
      throw new UnauthorizedError("Token expired");
    }

    if (!payload) {
      throw new UnauthorizedError("Invalid token");
    }

    req.auth = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (err) {
    next(
      err instanceof UnauthorizedError
        ? err
        : new UnauthorizedError("Invalid or expired token")
    );
  }
}

