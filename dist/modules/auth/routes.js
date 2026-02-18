"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const http_1 = require("../../common/http");
const auth_1 = require("../../middleware/auth");
const controller_1 = require("../../modules/auth/controller");
const schema_1 = require("../../modules/auth/schema");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", (0, http_1.validate)(schema_1.signupSchema), controller_1.signup);
exports.authRouter.post("/login", (0, http_1.validate)(schema_1.loginSchema), controller_1.login);
exports.authRouter.get("/me", auth_1.authMiddleware, controller_1.me);
//# sourceMappingURL=routes.js.map