import { ZodError as ZodValidationError } from "zod";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR"
  | "VALIDATION_ERROR";

interface ApiErrorResponse {
  error: string;
  code: ApiErrorCode;
  issues?: unknown[];
}

const STATUS_MAP: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  VALIDATION_ERROR: 400,
};

export function apiError(
  message: string,
  code: ApiErrorCode,
  issues?: unknown[],
): Response {
  const body: ApiErrorResponse = { error: message, code };
  if (issues) body.issues = issues;
  return Response.json(body, { status: STATUS_MAP[code] });
}

export function handleApiError(err: unknown): Response {
  if (err instanceof ZodValidationError) {
    return apiError("Dados inválidos", "VALIDATION_ERROR", err.issues);
  }

  if (err instanceof AppError) {
    return apiError(err.message, err.code);
  }

  console.error("Unhandled API error:", err);
  return apiError("Erro interno do servidor", "INTERNAL_SERVER_ERROR");
}

export class AppError extends Error {
  constructor(
    message: string,
    public code: ApiErrorCode,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Autenticação necessária") {
    super(message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Acesso não permitido") {
    super(message, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflito") {
    super(message, "CONFLICT");
    this.name = "ConflictError";
  }
}
