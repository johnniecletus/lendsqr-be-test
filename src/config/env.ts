import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(2026),
  DB_HOST: z.string().default("127.0.0.1"),
  DB_PORT: z.coerce.number().int().positive().default(3306),
  DB_USER: z.string().default("root"),
  DB_PASSWORD: z.string().default("passwordtodatabasewillbecheckedhere"),
  DB_NAME: z.string().default("demo_credit_wallet"),
  JWT_SECRET: z.string().min(16, "jwtwillbecheckedhereanditmustbeaminimumof16characters"),
  JWT_EXPIRES_IN: z.string().default("1d"),
  ADJUTOR_BASE_URL: z.string().url().default("https://adjutor.lendsqr.com/v2"),
  ADJUTOR_BEARER_TOKEN: z.string().min(1),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${errors}`);
}

export const env = parsed.data;
