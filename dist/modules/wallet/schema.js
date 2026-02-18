"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferSchema = exports.withdrawSchema = exports.fundSchema = void 0;
const zod_1 = require("zod");
const amountPattern = /^\d+(\.\d{1,4})?$/;
exports.fundSchema = zod_1.z.object({
    amount: zod_1.z.string().regex(amountPattern, "amount must be a valid positive number with up to 4 decimals"),
    narration: zod_1.z.string().trim().max(255).optional(),
});
exports.withdrawSchema = zod_1.z.object({
    amount: zod_1.z.string().regex(amountPattern, "amount must be a valid positive number with up to 4 decimals"),
    narration: zod_1.z.string().trim().max(255).optional(),
});
exports.transferSchema = zod_1.z.object({
    amount: zod_1.z.string().regex(amountPattern, "amount must be a valid positive number with up to 4 decimals"),
    toUserId: zod_1.z.string().uuid(),
    narration: zod_1.z.string().trim().max(255).optional(),
});
//# sourceMappingURL=schema.js.map