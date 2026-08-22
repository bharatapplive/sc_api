export declare class AppError extends Error {
    statusCode: number;
    message: string;
    constructor(statusCode: number, message: string);
}
export declare class DatabaseError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(message?: string);
}
export declare class NotFoundError extends AppError {
    constructor(message?: string);
}
