import knex, { Knex } from "knex";
import { env } from "@/config/env";

export const knexConfig: Knex.Config = {
  client: "mysql2",
  connection: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  },
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: "knex_migrations",
    directory: "src/db/migrations",
  },
};

export const db = knex(knexConfig);
