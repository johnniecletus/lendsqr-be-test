import { z } from "zod";

const amountPattern = /^\d+(\.\d{1,4})?$/;

export const fundSchema = z.object({
  amount: z.string().regex(amountPattern, "amount must be a valid positive number with up to 4 decimals"),
  narration: z.string().trim().max(255).optional(),
});

export const withdrawSchema = z.object({
  amount: z.string().regex(amountPattern, "amount must be a valid positive number with up to 4 decimals"),
  narration: z.string().trim().max(255).optional(),
});

export const transferSchema = z.object({
  amount: z.string().regex(amountPattern, "amount must be a valid positive number with up to 4 decimals"),
  toUserId: z.string().uuid(),
  narration: z.string().trim().max(255).optional(),
});
