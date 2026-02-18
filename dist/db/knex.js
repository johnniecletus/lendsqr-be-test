"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.knexConfig = void 0;
const knex_1 = __importDefault(require("knex"));
const env_1 = require("../config/env");
exports.knexConfig = {
    client: "mysql2",
    connection: {
        host: env_1.env.DB_HOST,
        port: env_1.env.DB_PORT,
        user: env_1.env.DB_USER,
        password: env_1.env.DB_PASSWORD,
        database: env_1.env.DB_NAME,
    },
    pool: { min: 2, max: 10 },
    migrations: {
        tableName: "knex_migrations",
        directory: "src/db/migrations",
    },
};
exports.db = (0, knex_1.default)(exports.knexConfig);
//# sourceMappingURL=knex.js.map