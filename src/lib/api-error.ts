import { HttpError } from "@/api/http";

export const getApiErrorMessage = (error: unknown, fallback = "Nao foi possivel concluir a operacao.") => {
  if (!(error instanceof HttpError)) {
    if (error instanceof Error && error.message) {
      return error.message;
    }

    return fallback;
  }

  if (error.payload && typeof error.payload === "object") {
    const payload = error.payload as {
      message?: string;
      reason?: string;
      error?: string;
      errors?: Record<string, string[] | string>;
    };

    if (payload.reason) return payload.reason;
    if (payload.message) return payload.message;
    if (payload.error) return payload.error;

    const firstError = payload.errors && Object.values(payload.errors)[0];
    if (Array.isArray(firstError) && firstError[0]) return firstError[0];
    if (typeof firstError === "string") return firstError;
  }

  return error.status ? `Erro ${error.status}.` : fallback;
};

export const getFieldErrors = (error: unknown) => {
  if (!(error instanceof HttpError) || !error.payload || typeof error.payload !== "object") {
    return {} as Record<string, string>;
  }

  const payload = error.payload as { errors?: Record<string, string[] | string> };
  const fieldErrors: Record<string, string> = {};

  if (!payload.errors) {
    return fieldErrors;
  }

  Object.entries(payload.errors).forEach(([field, value]) => {
    if (Array.isArray(value) && value[0]) {
      fieldErrors[field] = value[0];
    } else if (typeof value === "string") {
      fieldErrors[field] = value;
    }
  });

  return fieldErrors;
};