"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletService = createWalletService;
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const ids_1 = require("../../common/ids");
function createWalletService({ db, wallets, transactions, }) {
    const getBalance = async (userId) => {
        const wallet = await wallets.findByUserId(userId);
        if (!wallet)
            throw new errors_1.NotFoundError("Wallet not found");
        return { balance: (0, money_1.formatUnitsToAmount)(wallet.balanceUnits) };
    };
    const fund = async (userId, input) => {
        return db.transaction(async (trx) => {
            const wallet = await wallets.findByUserId(userId, trx, true);
            if (!wallet)
                throw new errors_1.NotFoundError("Wallet not found");
            const amountUnits = (0, money_1.parseAmountToUnits)(input.amount);
            (0, money_1.assertPositive)(amountUnits);
            const beforeUnits = wallet.balanceUnits;
            const afterUnits = beforeUnits + amountUnits;
            const reference = (0, ids_1.generateRef)("FUND");
            await wallets.updateBalanceUnits(wallet.id, afterUnits, trx);
            await transactions.create({
                walletAccountId: wallet.id,
                userId,
                type: "funding",
                amountUnits,
                balanceBeforeUnits: beforeUnits,
                balanceAfterUnits: afterUnits,
                reference,
                relatedUserId: null,
                narration: input.narration ?? "Wallet funding",
            }, trx);
            return { balance: (0, money_1.formatUnitsToAmount)(afterUnits), reference };
        });
    };
    const withdraw = async (userId, input) => {
        return db.transaction(async (trx) => {
            const wallet = await wallets.findByUserId(userId, trx, true);
            if (!wallet)
                throw new errors_1.NotFoundError("Wallet not found");
            const amountUnits = (0, money_1.parseAmountToUnits)(input.amount);
            (0, money_1.assertPositive)(amountUnits);
            const beforeUnits = wallet.balanceUnits;
            if (beforeUnits < amountUnits) {
                throw new errors_1.AppError("Insufficient balance", 400, "INSUFFICIENT_BALANCE");
            }
            const afterUnits = beforeUnits - amountUnits;
            const reference = (0, ids_1.generateRef)("WD");
            await wallets.updateBalanceUnits(wallet.id, afterUnits, trx);
            await transactions.create({
                walletAccountId: wallet.id,
                userId,
                type: "withdrawal",
                amountUnits,
                balanceBeforeUnits: beforeUnits,
                balanceAfterUnits: afterUnits,
                reference,
                relatedUserId: null,
                narration: input.narration ?? "Wallet withdrawal",
            }, trx);
            return { balance: (0, money_1.formatUnitsToAmount)(afterUnits), reference };
        });
    };
    const transfer = async (fromUserId, input) => {
        const toUserId = input.toUserId;
        if (!toUserId) {
            throw new errors_1.AppError("Recipient user is required", 400, "INVALID_TRANSFER");
        }
        if (fromUserId === toUserId) {
            throw new errors_1.AppError("Cannot transfer to self", 400, "INVALID_TRANSFER");
        }
        return db.transaction(async (trx) => {
            const firstUserId = fromUserId < toUserId ? fromUserId : toUserId;
            const secondUserId = fromUserId < toUserId ? toUserId : fromUserId;
            const firstWallet = await wallets.findByUserId(firstUserId, trx, true);
            const secondWallet = await wallets.findByUserId(secondUserId, trx, true);
            const senderWallet = fromUserId === firstUserId ? firstWallet : secondWallet;
            const recipientWallet = fromUserId === firstUserId ? secondWallet : firstWallet;
            if (!senderWallet || !recipientWallet) {
                throw new errors_1.NotFoundError("One or more wallet accounts not found");
            }
            const amountUnits = (0, money_1.parseAmountToUnits)(input.amount);
            (0, money_1.assertPositive)(amountUnits);
            const senderBefore = senderWallet.balanceUnits;
            if (senderBefore < amountUnits) {
                throw new errors_1.AppError("Insufficient balance", 400, "INSUFFICIENT_BALANCE");
            }
            const recipientBefore = recipientWallet.balanceUnits;
            const senderAfter = senderBefore - amountUnits;
            const recipientAfter = recipientBefore + amountUnits;
            const reference = (0, ids_1.generateRef)("TRF");
            const narration = input.narration ?? "Wallet transfer";
            await wallets.updateBalanceUnits(senderWallet.id, senderAfter, trx);
            await wallets.updateBalanceUnits(recipientWallet.id, recipientAfter, trx);
            await transactions.create({
                walletAccountId: senderWallet.id,
                userId: fromUserId,
                type: "transfer_debit",
                amountUnits,
                balanceBeforeUnits: senderBefore,
                balanceAfterUnits: senderAfter,
                reference,
                relatedUserId: input.toUserId,
                narration,
            }, trx);
            await transactions.create({
                walletAccountId: recipientWallet.id,
                userId: input.toUserId,
                type: "transfer_credit",
                amountUnits,
                balanceBeforeUnits: recipientBefore,
                balanceAfterUnits: recipientAfter,
                reference,
                relatedUserId: fromUserId,
                narration,
            }, trx);
            return {
                reference,
                amount: (0, money_1.formatUnitsToAmount)(amountUnits),
                senderBalance: (0, money_1.formatUnitsToAmount)(senderAfter),
            };
        });
    };
    const listTransactions = async (userId, limit = 20) => {
        const txs = await transactions.listByUserId(userId, limit);
        return txs.map((t) => ({
            ...t,
            amount: (0, money_1.formatUnitsToAmount)(t.amountUnits),
            balanceBefore: (0, money_1.formatUnitsToAmount)(t.balanceBeforeUnits),
            balanceAfter: (0, money_1.formatUnitsToAmount)(t.balanceAfterUnits),
        }));
    };
    return {
        getBalance,
        fund,
        withdraw,
        transfer,
        listTransactions,
    };
}
//# sourceMappingURL=wallet.service.js.map