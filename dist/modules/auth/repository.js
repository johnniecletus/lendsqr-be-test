"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserRepository = createUserRepository;
const ids_1 = require("../../common/ids");
function mapUser(row) {
    return {
        id: row.id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        passwordHash: row.password_hash,
    };
}
function createUserRepository(db) {
    const findByEmail = async (email, tx) => {
        const conn = tx ?? db;
        const row = await conn("users").where({ email }).first();
        return row ? mapUser(row) : null;
    };
    const findById = async (id, tx) => {
        const conn = tx ?? db;
        const row = await conn("users").where({ id }).first();
        return row ? mapUser(row) : null;
    };
    const create = async (data, tx) => {
        const conn = tx ?? db;
        const id = (0, ids_1.generateId)();
        await conn("users").insert({
            id,
            email: data.email,
            first_name: data.firstName,
            last_name: data.lastName,
            password_hash: data.passwordHash,
        });
        return {
            id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            passwordHash: data.passwordHash,
        };
    };
    return {
        findByEmail,
        findById,
        create,
    };
}
//# sourceMappingURL=repository.js.map