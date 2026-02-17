import { Request, Response } from "express";
import { asyncHandler } from "@/common/http";
import { UnauthorizedError } from "@/common/errors";
import { AuthedRequest } from "@/middleware/auth";
import { authService } from "@/modules/dependencies";
import { env } from "@/config/env";


function setAuthCookie(res: Response, token: string) {
  const isProd = env.NODE_ENV === "production";

  res.cookie("accessToken", token, {
    maxAge: 1.8e+6,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

function getAuth(req: Request) {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    throw new UnauthorizedError("Missing authentication context");
  }
  return auth;
}

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);
  setAuthCookie(res, result.token);
  res.status(201).json({ success: true, data: { user: result.user } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  setAuthCookie(res, result.token);
  res.status(200).json({ success: true, data: { user: result.user } });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getUserProfile(getAuth(req).userId);
  res.status(200).json({ success: true, data: user });
});
