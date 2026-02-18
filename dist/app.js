"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("./common/http");
const routes_1 = require("./modules/auth/routes");
const routes_2 = require("./modules/health/routes");
const routes_3 = require("./modules/wallet/routes");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    credentials: true
}));
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", routes_2.healthRouter);
app.use("/api/v1/auth", routes_1.authRouter);
app.use("/api/v1/wallet", routes_3.walletRouter);
app.use(http_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map