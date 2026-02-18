"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable("users", (table) => {
        table.string("id", 36).primary();
        table.string("email", 255).notNullable().unique();
        table.string("first_name", 100).notNullable();
        table.string("last_name", 100).notNullable();
        table.string("password_hash", 255).notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    });
    await knex.schema.createTable("wallet_accounts", (table) => {
        table.string("id", 36).primary();
        table.string("user_id", 36).notNullable().unique();
        table.bigInteger("balance_units").notNullable().defaultTo(0);
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
        table
            .foreign("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
    });
    await knex.schema.createTable("wallet_transactions", (table) => {
        table.string("id", 36).primary();
        table.string("wallet_account_id", 36).notNullable();
        table.string("user_id", 36).notNullable();
        table.string("type", 32).notNullable();
        table.bigInteger("amount_units").notNullable();
        table.bigInteger("balance_before_units").notNullable();
        table.bigInteger("balance_after_units").notNullable();
        table.string("reference", 120).notNullable().index();
        table.string("related_user_id", 36).nullable();
        table.string("narration", 255).notNullable();
        table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
        table
            .foreign("wallet_account_id")
            .references("id")
            .inTable("wallet_accounts")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table
            .foreign("user_id")
            .references("id")
            .inTable("users")
            .onDelete("CASCADE")
            .onUpdate("CASCADE");
        table
            .foreign("related_user_id")
            .references("id")
            .inTable("users")
            .onDelete("SET NULL")
            .onUpdate("CASCADE");
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists("wallet_transactions");
    await knex.schema.dropTableIfExists("wallet_accounts");
    await knex.schema.dropTableIfExists("users");
}
//# sourceMappingURL=20260213112000_init_wallet_schema.js.map