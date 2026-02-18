"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceUnavailableError = exports.ConflictError = exports.NotFoundError = exports.UnauthorizedError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 400, code = "BAD_REQUEST") {
        super(message);
        this.name = "AppError";
        this.statusCode = statusCode;
        this.code = code;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.AppError = AppError;
class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, "UNAUTHORIZED");
    }
}
exports.UnauthorizedError = UnauthorizedError;
class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404, "NOT_FOUND");
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409, "CONFLICT");
    }
}
exports.ConflictError = ConflictError;
class ServiceUnavailableError extends AppError {
    constructor(message = "Service unavailable") {
        super(message, 503, "SERVICE_UNAVAILABLE");
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
//# sourceMappingURL=errors.js.map