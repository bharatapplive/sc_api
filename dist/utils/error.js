"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = exports.ValidationError = exports.DatabaseError = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    message;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        console.log(`[AppError] Created error with status ${statusCode}: ${message}`);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
class DatabaseError extends AppError {
    constructor(message = 'Database connection failed') {
        super(500, message);
        console.log('[DatabaseError] Database error occurred:', message);
    }
}
exports.DatabaseError = DatabaseError;
class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(400, message);
        console.log('[ValidationError] Validation error occurred:', message);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(404, message);
        console.log('[NotFoundError] Resource not found error occurred:', message);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=error.js.map