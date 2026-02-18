"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.email(),
    firstName: zod_1.z.string().trim().min(2).max(100),
    lastName: zod_1.z.string().trim().min(2).max(100),
    password: zod_1.z.string().min(8).max(72),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z.string().min(8).max(72),
});
//# sourceMappingURL=schema.js.map