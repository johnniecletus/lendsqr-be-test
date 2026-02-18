"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.signup = void 0;
const http_1 = require("../../common/http");
const errors_1 = require("../../common/errors");
const dependencies_1 = require("../../modules/dependencies");
const env_1 = require("../../config/env");
function setAuthCookie(res, token) {
    const isProd = env_1.env.NODE_ENV === "production";
    res.cookie("accessToken", token, {
        maxAge: 1.8e+6,
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });
}
function getAuth(req) {
    const auth = req.auth;
    if (!auth) {
        throw new errors_1.UnauthorizedError("Missing authentication context");
    }
    return auth;
}
exports.signup = (0, http_1.asyncHandler)(async (req, res) => {
    const result = await dependencies_1.authService.signup(req.body);
    setAuthCookie(res, result.token);
    res.status(201).json({ success: true, data: { user: result.user } });
});
exports.login = (0, http_1.asyncHandler)(async (req, res) => {
    const result = await dependencies_1.authService.login(req.body);
    setAuthCookie(res, result.token);
    res.status(200).json({ success: true, data: { user: result.user } });
});
exports.me = (0, http_1.asyncHandler)(async (req, res) => {
    const user = await dependencies_1.authService.getUserProfile(getAuth(req).userId);
    res.status(200).json({ success: true, data: user });
});
//# sourceMappingURL=controller.js.map