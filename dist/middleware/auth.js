"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const errors_1 = require("../common/errors");
const token_service_1 = require("../modules/auth/token.service");
function authMiddleware(req, _res, next) {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new errors_1.UnauthorizedError("Unauthorized");
        }
        const { payload, expired } = (0, token_service_1.verifyJwt)(accessToken);
        if (expired) {
            throw new errors_1.UnauthorizedError("Token expired");
        }
        if (!payload) {
            throw new errors_1.UnauthorizedError("Invalid token");
        }
        req.auth = {
            userId: payload.userId,
            email: payload.email,
        };
        next();
    }
    catch (err) {
        next(err instanceof errors_1.UnauthorizedError
            ? err
            : new errors_1.UnauthorizedError("Invalid or expired token"));
    }
}
//# sourceMappingURL=auth.js.map