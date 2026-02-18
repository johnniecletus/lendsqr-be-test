import { z } from "zod";
export declare const signupSchema: z.ZodObject<{
    email: z.ZodEmail;
    firstName: z.ZodString;
    lastName: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
