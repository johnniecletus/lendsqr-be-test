"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletRouter = void 0;
const express_1 = require("express");
const http_1 = require("../../common/http");
const auth_1 = require("../../middleware/auth");
const controller_1 = require("../../modules/wallet/controller");
const schema_1 = require("../../modules/wallet/schema");
exports.walletRouter = (0, express_1.Router)();
exports.walletRouter.use(auth_1.authMiddleware);
exports.walletRouter.get("/balance", controller_1.getBalance);
exports.walletRouter.get("/transactions", controller_1.getTransactions);
exports.walletRouter.post("/fund", (0, http_1.validate)(schema_1.fundSchema), controller_1.fundWallet);
exports.walletRouter.post("/withdraw", (0, http_1.validate)(schema_1.withdrawSchema), controller_1.withdrawWallet);
exports.walletRouter.post("/transfer", (0, http_1.validate)(schema_1.transferSchema), controller_1.transferWallet);
//# sourceMappingURL=routes.js.map