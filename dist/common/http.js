"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = asyncHandler;
exports.validate = validate;
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const errors_1 = require("../common/errors");
const logger_1 = require("../lib/logger");
function asyncHandler(fn) {
    return (req, res, next) => {
        void fn(req, res, next).catch(next);
    };
}
function validate(schema, location = "body") {
    return (req, _res, next) => {
        try {
            (Object.assign(req[location], schema.parse(req[location])));
            next();
        }
        catch (error) {
            next(error);
        }
    };
}
function errorHandler(error, _req, res, _next) {
    if (error instanceof errors_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
            },
        });
        return;
    }
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            success: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Input validation failed",
                details: error.issues,
            },
        });
        return;
    }
    logger_1.logger.error({ err: error }, "Unhandled error");
    res.status(500).json({
        success: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
        },
    });
}
//# sourceMappingURL=http.js.map