export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "APP_ERROR",
    public status: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = "AppError"
  }
}

export class HttpError extends AppError {
  constructor(status: number, message: string, details?: unknown) {
    super(message, `HTTP_${status}`, status, details)
    this.name = "HttpError"
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, "NOT_FOUND", 404)
    this.name = "NotFoundError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED", 401)
    this.name = "UnauthorizedError"
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access forbidden") {
    super(message, "FORBIDDEN", 403)
    this.name = "ForbiddenError"
  }
}
