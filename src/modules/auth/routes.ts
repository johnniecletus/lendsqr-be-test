import { Router } from "express";
import { validate } from "@/common/http";
import { authMiddleware } from "@/middleware/auth";
import { login, me, signup } from "@/modules/auth/controller";
import { loginSchema, signupSchema } from "@/modules/auth/schema";

export const authRouter = Router();

authRouter.post("/signup", validate(signupSchema), signup);
authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/me", authMiddleware, me);
