"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWalletRepository = createWalletRepository;
exports.createWalletTransactionRepository = createWalletTransactionRepository;
const ids_1 = require("../../common/ids");
function toUnits(v) {
    return BigInt(v);
}
function mapWallet(row) {
    return {
        id: row.id,
        userId: row.user_id,
        balanceUnits: toUnits(row.balance_units),
    };
}
function mapTx(row) {
    return {
        id: row.id,
        type: row.type,
        amountUnits: toUnits(row.amount_units),
        balanceBeforeUnits: toUnits(row.balance_before_units),
        balanceAfterUnits: toUnits(row.balance_after_units),
        reference: row.reference,
        relatedUserId: row.related_user_id,
        narration: row.narration,
        createdAt: row.created_at,
    };
}
function createWalletRepository(db) {
    const create = async (data, tx) => {
        const conn = tx ?? db;
        const id = (0, ids_1.generateId)();
        await conn("wallet_accounts").insert({
            id,
            user_id: data.userId,
            balance_units: 0,
        });
        return {
            id,
            userId: data.userId,
            balanceUnits: 0n,
        };
    };
    const findByUserId = async (userId, tx, forUpdate = false) => {
        const conn = tx ?? db;
        let query = conn("wallet_accounts")
            .where({ user_id: userId })
            .first();
        if (forUpdate && tx) {
            query = query.forUpdate();
        }
        const row = await query;
        return row ? mapWallet(row) : null;
    };
    const updateBalanceUnits = async (accountId, newBalanceUnits, tx) => {
        const conn = tx ?? db;
        await conn("wallet_accounts")
            .where({ id: accountId })
            .update({
            balance_units: newBalanceUnits.toString(),
            updated_at: conn.fn.now(),
        });
    };
    return {
        create,
        findByUserId,
        updateBalanceUnits,
    };
}
function createWalletTransactionRepository(db) {
    const create = async (data, tx) => {
        const conn = tx ?? db;
        const id = (0, ids_1.generateId)();
        await conn("wallet_transactions").insert({
            id,
            wallet_account_id: data.walletAccountId,
            user_id: data.userId,
            type: data.type,
            amount_units: data.amountUnits.toString(),
            balance_before_units: data.balanceBeforeUnits.toString(),
            balance_after_units: data.balanceAfterUnits.toString(),
            reference: data.reference,
            related_user_id: data.relatedUserId,
            narration: data.narration,
        });
        return {
            id,
            type: data.type,
            amountUnits: data.amountUnits,
            balanceBeforeUnits: data.balanceBeforeUnits,
            balanceAfterUnits: data.balanceAfterUnits,
            reference: data.reference,
            relatedUserId: data.relatedUserId,
            narration: data.narration,
            createdAt: new Date(),
        };
    };
    const listByUserId = async (userId, limit = 20) => {
        const rows = (await db("wallet_transactions")
            .where("user_id", userId)
            .orderBy("created_at", "desc")
            .limit(limit));
        return rows.map(mapTx);
    };
    return {
        create,
        listByUserId,
    };
}
//# sourceMappingURL=repository.js.map