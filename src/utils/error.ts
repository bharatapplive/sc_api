/**
 * AppError - Base error class for application-specific errors
 * Extends the native Error class to include HTTP status codes
 */
export class AppError extends Error {
  /**
   * @param statusCode - HTTP status code for the error
   * @param message - Error message describing what went wrong
   */
  constructor(public statusCode: number, public message: string) {
    super(message);
    console.log(`[AppError] Created error with status ${statusCode}: ${message}`);
    // Set the prototype explicitly to ensure instanceof checks work correctly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * DatabaseError - Error class for database-related failures
 * Used when MongoDB operations fail
 */
export class DatabaseError extends AppError {
  /**
   * @param message - Error message (defaults to 'Database connection failed')
   */
  constructor(message: string = 'Database connection failed') {
    super(500, message);
    console.log('[DatabaseError] Database error occurred:', message);
  }
}

/**
 * ValidationError - Error class for input validation failures
 * Used when user input does not meet validation requirements
 */
export class ValidationError extends AppError {
  /**
   * @param message - Error message (defaults to 'Validation failed')
   */
  constructor(message: string = 'Validation failed') {
    super(400, message);
    console.log('[ValidationError] Validation error occurred:', message);
  }
}

/**
 * NotFoundError - Error class for resource not found scenarios
 * Used when a requested resource does not exist
 */
export class NotFoundError extends AppError {
  /**
   * @param message - Error message (defaults to 'Resource not found')
   */
  constructor(message: string = 'Resource not found') {
    super(404, message);
    console.log('[NotFoundError] Resource not found error occurred:', message);
  }
}
