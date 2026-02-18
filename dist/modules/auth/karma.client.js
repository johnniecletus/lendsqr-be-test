"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBlacklisted = void 0;
const errors_1 = require("../../common/errors");
const env_1 = require("../../config/env");
const isBlacklisted = async (identity) => {
    const url = `${env_1.env.ADJUTOR_BASE_URL}/verification/karma/${encodeURIComponent(identity)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${env_1.env.ADJUTOR_BEARER_TOKEN}`,
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new errors_1.ServiceUnavailableError("Could not validate Karma blacklist at this time");
    }
    const payload = (await response.json());
    const data = payload["data"];
    const candidates = [
        payload["blacklisted"],
        payload["isBlacklisted"],
        payload["status"],
        data?.["blacklisted"],
        data?.["status"],
    ];
    return candidates.some((value) => {
        if (typeof value === "boolean") {
            return value;
        }
        if (typeof value === "string") {
            const normalized = value.toLowerCase();
            return (normalized.includes("black") ||
                normalized === "deny" ||
                normalized === "blocked");
        }
        return false;
    });
};
exports.isBlacklisted = isBlacklisted;
//# sourceMappingURL=karma.client.js.map