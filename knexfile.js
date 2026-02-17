require("dotenv").config();
require("ts-node/register");
require("tsconfig-paths/register");

/** @type {import('knex').Knex.Config} */
const shared = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lendsqr_wallet",
  },
  migrations: {
    directory: "./src/db/migrations",
    extension: "ts",
  },
};

module.exports = {
  development: shared,
  test: shared,
  production: shared,
};
