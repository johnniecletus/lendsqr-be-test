import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "@/common/http";
import { authRouter } from "@/modules/auth/routes";
import { healthRouter } from "@/modules/health/routes";
import { walletRouter } from "@/modules/wallet/routes";

export const app = express();

app.use(helmet());
app.use(cors({
    credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/wallet", walletRouter);


app.use(errorHandler);
