import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/config/env";
import { clearSession, getAuthToken } from "@/lib/auth";

export class HttpError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.payload = payload;
  }
}

const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

export interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export const http = axios.create({
  baseURL: base,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      clearSession();
    }

    return Promise.reject(error);
  }
);

export async function request<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const isFormData = typeof FormData !== "undefined" && init.body instanceof FormData;
  const body = init.body;

  try {
    const response = await http.request<T>({
      url: path,
      method: method as
        | "GET"
        | "POST"
        | "PUT"
        | "PATCH"
        | "DELETE"
        | "OPTIONS"
        | "HEAD"
        | undefined,
      data: body,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(init.headers as Record<string, string> | undefined),
      },
    });

    const payload = response.data as unknown;

    // Se a API usar o envelope padrão { data: ..., meta?, message? },
    // retornamos o conteúdo de `data` para simplificar os consumidores.
    if (payload && typeof payload === "object" && "data" in (payload as Record<string, unknown>)) {
      return (payload as Record<string, unknown>).data as T;
    }

    return payload as T;
  } catch (error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status ?? 0;
    const payload = axiosError.response?.data;

    throw new HttpError(`Request failed with status ${status}`, status, payload);
  }
}
