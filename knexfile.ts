import type { Knex } from "knex";

const shared: Knex.Config = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: "./src/db/migrations",
  },
};

const config: Record<string, Knex.Config> = {
  development: shared,
  test: shared,
  production: shared,
};

export default config;
