"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthService = createAuthService;
const errors_1 = require("../../common/errors");
const karma_client_1 = require("./karma.client");
const password_service_1 = require("./password.service");
const token_service_1 = require("./token.service");
const env_1 = require("../../config/env");
function toPublicUser(user) {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
    };
}
function createAuthService({ db, users, wallets }) {
    const signup = async (input) => {
        const existingUser = await users.findByEmail(input.email);
        if (existingUser) {
            throw new errors_1.ConflictError("Email already exists");
        }
        const blacklisted = await (0, karma_client_1.isBlacklisted)(input.email);
        if (blacklisted) {
            throw new errors_1.UnauthorizedError("User is blacklisted on Karma and cannot be onboarded");
        }
        const passwordHash = await (0, password_service_1.hashPassword)(input.password);
        const user = await db.transaction(async (trx) => {
            const createdUser = await users.create({
                email: input.email,
                firstName: input.firstName,
                lastName: input.lastName,
                passwordHash,
            }, trx);
            await wallets.create({ userId: createdUser.id }, trx);
            return createdUser;
        });
        const token = (0, token_service_1.signJWT)({ userId: user.id, email: user.email }, env_1.env.JWT_EXPIRES_IN);
        return {
            token,
            user: toPublicUser(user),
        };
    };
    const login = async (input) => {
        const user = await users.findByEmail(input.email);
        if (!user) {
            throw new errors_1.UnauthorizedError("Invalid email or password");
        }
        const passwordValid = await (0, password_service_1.comparePassword)(input.password, user.passwordHash);
        if (!passwordValid) {
            throw new errors_1.UnauthorizedError("Invalid email or password");
        }
        const token = (0, token_service_1.signJWT)({ userId: user.id, email: user.email }, env_1.env.JWT_EXPIRES_IN);
        return {
            token,
            user: toPublicUser(user),
        };
    };
    const getUserProfile = async (userId) => {
        const user = await users.findById(userId);
        if (!user) {
            throw new errors_1.NotFoundError("User profile not found");
        }
        return toPublicUser(user);
    };
    return {
        signup,
        login,
        getUserProfile,
    };
}
//# sourceMappingURL=auth.service.js.map