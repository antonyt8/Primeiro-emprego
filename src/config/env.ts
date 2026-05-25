const defaultApiHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
const fallbackApiUrl = `http://${defaultApiHost}:8000/api`;

export const API_BASE_URL = import.meta.env.VITE_API_URL ?? fallbackApiUrl;

export type AuthMode = "local-storage" | "http-only-cookie";

const parseAuthMode = (value: string | undefined): AuthMode => {
	if (value === "http-only-cookie") {
		return "http-only-cookie";
	}

	return "local-storage";
};

export const AUTH_MODE = parseAuthMode(import.meta.env.VITE_AUTH_MODE);
