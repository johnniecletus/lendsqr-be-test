"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = exports.authService = void 0;
const knex_1 = require("../db/knex");
const auth_service_1 = require("../modules/auth/auth.service");
const repository_1 = require("../modules/auth/repository");
const repository_2 = require("../modules/wallet/repository");
const wallet_service_1 = require("../modules/wallet/wallet.service");
const users = (0, repository_1.createUserRepository)(knex_1.db);
const wallets = (0, repository_2.createWalletRepository)(knex_1.db);
const walletTransactions = (0, repository_2.createWalletTransactionRepository)(knex_1.db);
exports.authService = (0, auth_service_1.createAuthService)({
    db: knex_1.db,
    users,
    wallets,
});
exports.walletService = (0, wallet_service_1.createWalletService)({
    db: knex_1.db,
    wallets,
    transactions: walletTransactions,
});
//# sourceMappingURL=dependencies.js.map