import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorHandler } from "@/common/http";
import { healthRouter } from "@/modules/health/routes";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use("/api/v1", healthRouter);


app.use(errorHandler);
