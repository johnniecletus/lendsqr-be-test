import { Router } from "express";
import { validate } from "@/common/http";
import { authMiddleware } from "@/middleware/auth";
import {
  fundWallet,
  getBalance,
  getTransactions,
  transferWallet,
  withdrawWallet,
} from "@/modules/wallet/controller";
import { fundSchema, transferSchema, withdrawSchema } from "@/modules/wallet/schema";

export const walletRouter = Router();

walletRouter.use(authMiddleware);
walletRouter.get("/balance", getBalance);
walletRouter.get("/transactions", getTransactions);
walletRouter.post("/fund", validate(fundSchema), fundWallet);
walletRouter.post("/withdraw", validate(withdrawSchema), withdrawWallet);
walletRouter.post("/transfer", validate(transferSchema), transferWallet);
