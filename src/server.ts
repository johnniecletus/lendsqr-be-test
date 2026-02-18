import app from "./app";
import { env } from "@/config/env";
import { db } from "@/db/knex";
import { logger } from "@/lib/logger";

const server = app.listen(env.PORT, () => {
  logger.info(`Wallet service listening on port ${env.PORT}`);
});

const shutdown = async () => {
  logger.info("Shutting down server");
  server.close(async () => {
    await db.destroy();
    process.exit(0);
  });
};

process.on("SIGINT", () => {
  void shutdown();
});

process.on("SIGTERM", () => {
  void shutdown();
});
