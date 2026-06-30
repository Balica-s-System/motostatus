import type { ApiErrorCode } from "@/lib/api-error";

interface ApiResult<T> {
  data: T | null;
  error: { error: string; code: ApiErrorCode; issues?: unknown[] } | null;
}

function isApiErrorResponse(body: unknown): body is {
  error: string;
  code: ApiErrorCode;
  issues?: unknown[];
} {
  return (
    typeof body === "object" &&
    body !== null &&
    "error" in body &&
    "code" in body
  );
}

function handleRedirect(code: ApiErrorCode) {
  if (code === "UNAUTHORIZED") {
    window.location.href = "/session-expired";
    return;
  }
  if (code === "FORBIDDEN") {
    window.location.href = "/forbidden";
    return;
  }
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(input, init);
    const body = await response.json().catch(() => null);

    if (!response.ok) {
      if (isApiErrorResponse(body)) {
        if (typeof window !== "undefined") {
          handleRedirect(body.code);
        }
        return { data: null, error: body };
      }

      return {
        data: null,
        error: {
          error: body?.error || `Erro ${response.status}`,
          code: "INTERNAL_SERVER_ERROR" as ApiErrorCode,
        },
      };
    }

    return { data: body as T, error: null };
  } catch (err) {
    console.error("apiFetch error:", err);
    return {
      data: null,
      error: {
        error: "Erro de conexão com o servidor",
        code: "INTERNAL_SERVER_ERROR" as ApiErrorCode,
      },
    };
  }
}
