"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const knex_1 = require("./db/knex");
const logger_1 = require("./lib/logger");
const server = app_1.app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`Wallet service listening on port ${env_1.env.PORT}`);
});
const shutdown = async () => {
    logger_1.logger.info("Shutting down server");
    server.close(async () => {
        await knex_1.db.destroy();
        process.exit(0);
    });
};
process.on("SIGINT", () => {
    void shutdown();
});
process.on("SIGTERM", () => {
    void shutdown();
});
//# sourceMappingURL=server.js.map