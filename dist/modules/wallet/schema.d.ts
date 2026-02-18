import { z } from "zod";
export declare const fundSchema: z.ZodObject<{
    amount: z.ZodString;
    narration: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const withdrawSchema: z.ZodObject<{
    amount: z.ZodString;
    narration: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const transferSchema: z.ZodObject<{
    amount: z.ZodString;
    toUserId: z.ZodString;
    narration: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
