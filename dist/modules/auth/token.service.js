"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
exports.signJWT = signJWT;
exports.verifyJWT = verifyJWT;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../../config/env");
function normalizePem(key) {
    return key.replace(/\\n/g, "\n").trim();
}
const privateKey = normalizePem(env_1.env.JWT_PRIVATE_KEY);
const publicKey = normalizePem(env_1.env.JWT_PUBLIC_KEY);
function signJWT(payload, expiresIn) {
    return jsonwebtoken_1.default.sign(payload, privateKey, {
        algorithm: "RS256",
        expiresIn,
    });
}
function verifyJWT(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, publicKey, {
            algorithms: ["RS256"],
        });
        const userId = typeof decoded.userId === "string" ? decoded.userId : "";
        const email = typeof decoded.email === "string" ? decoded.email : "";
        if (!userId || !email) {
            return { payload: null, expired: false };
        }
        return {
            payload: { userId, email },
            expired: false,
        };
    }
    catch (error) {
        return {
            payload: null,
            expired: error?.name === "TokenExpiredError" || String(error?.message).includes("jwt expired"),
        };
    }
}
exports.verifyJwt = verifyJWT;
//# sourceMappingURL=token.service.js.map