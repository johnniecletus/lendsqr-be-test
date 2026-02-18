"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
exports.healthRouter = (0, express_1.Router)();
exports.healthRouter.get("/health", (_req, res) => {
    res.status(200).json({ success: true, data: { status: "ok" } });
});
//# sourceMappingURL=routes.js.map