"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const jwtTtlString = zod_1.z
    .string()
    .regex(/^\d+(ms|s|m|h|d|w|y)$/i, "TTL must look like 15m, 6h, 7d, 30s")
    .transform((v) => v);
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(2026),
    DB_HOST: zod_1.z.string().default("127.0.0.1"),
    DB_PORT: zod_1.z.coerce.number().int().positive().default(3306),
    DB_USER: zod_1.z.string().default("root"),
    DB_PASSWORD: zod_1.z.string().default("passwordtodatabasewillbecheckedhere"),
    DB_NAME: zod_1.z.string().default("demo_credit_wallet"),
    JWT_PRIVATE_KEY: zod_1.z.string().min(1, "Private key is required"),
    JWT_PUBLIC_KEY: zod_1.z.string().min(1, "Public key is required"),
    JWT_EXPIRES_IN: jwtTtlString.default("30m"),
    ADJUTOR_BASE_URL: zod_1.z.string().url().default("https://adjutor.lendsqr.com/v2"),
    ADJUTOR_BEARER_TOKEN: zod_1.z.string().min(1),
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
    const errors = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
    throw new Error(`Invalid environment configuration:\n${errors}`);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map