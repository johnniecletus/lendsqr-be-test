"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.transferWallet = exports.withdrawWallet = exports.fundWallet = exports.getBalance = void 0;
const http_1 = require("../../common/http");
const errors_1 = require("../../common/errors");
const dependencies_1 = require("../../modules/dependencies");
function getAuth(req) {
    const auth = req.auth;
    if (!auth) {
        throw new errors_1.UnauthorizedError("Missing authentication context");
    }
    return auth;
}
exports.getBalance = (0, http_1.asyncHandler)(async (req, res) => {
    const data = await dependencies_1.walletService.getBalance(getAuth(req).userId);
    res.status(200).json({ success: true, data });
});
exports.fundWallet = (0, http_1.asyncHandler)(async (req, res) => {
    const data = await dependencies_1.walletService.fund(getAuth(req).userId, req.body);
    res.status(200).json({ success: true, data });
});
exports.withdrawWallet = (0, http_1.asyncHandler)(async (req, res) => {
    const data = await dependencies_1.walletService.withdraw(getAuth(req).userId, req.body);
    res.status(200).json({ success: true, data });
});
exports.transferWallet = (0, http_1.asyncHandler)(async (req, res) => {
    const data = await dependencies_1.walletService.transfer(getAuth(req).userId, req.body);
    res.status(200).json({ success: true, data });
});
exports.getTransactions = (0, http_1.asyncHandler)(async (req, res) => {
    const data = await dependencies_1.walletService.listTransactions(getAuth(req).userId);
    res.status(200).json({ success: true, data });
});
//# sourceMappingURL=controller.js.map