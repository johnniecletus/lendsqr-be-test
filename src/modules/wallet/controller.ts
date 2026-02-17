import { Request, Response } from "express";
import { asyncHandler } from "@/common/http";
import { UnauthorizedError } from "@/common/errors";
import { AuthedRequest } from "@/middleware/auth";
import { walletService } from "@/modules/dependencies";

function getAuth(req: Request) {
  const auth = (req as AuthedRequest).auth;
  if (!auth) {
    throw new UnauthorizedError("Missing authentication context");
  }
  return auth;
}

export const getBalance = asyncHandler(async (req: Request, res: Response) => {
  const data = await walletService.getBalance(getAuth(req).userId);
  res.status(200).json({ success: true, data });
});

export const fundWallet = asyncHandler(async (req: Request, res: Response) => {
  const data = await walletService.fund(getAuth(req).userId, req.body);
  res.status(200).json({ success: true, data });
});

export const withdrawWallet = asyncHandler(async (req: Request, res: Response) => {
  const data = await walletService.withdraw(getAuth(req).userId, req.body);
  res.status(200).json({ success: true, data });
});

export const transferWallet = asyncHandler(async (req: Request, res: Response) => {
  const data = await walletService.transfer(getAuth(req).userId, req.body);
  res.status(200).json({ success: true, data });
});

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const data = await walletService.listTransactions(getAuth(req).userId);
  res.status(200).json({ success: true, data });
});
