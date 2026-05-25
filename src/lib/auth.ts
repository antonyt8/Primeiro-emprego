import { PROGRAM_STORAGE_KEYS } from "@/constants/program";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  cpf?: string;
  role?: string;
}

export type AuthSessionListener = () => void;

const authSessionListeners = new Set<AuthSessionListener>();

const notifyAuthSessionChange = () => {
  authSessionListeners.forEach((listener) => listener());
};

export const subscribeAuthSession = (listener: AuthSessionListener) => {
  authSessionListeners.add(listener);
  return () => authSessionListeners.delete(listener);
};

export const getAuthToken = () => {
  return globalThis.localStorage.getItem(PROGRAM_STORAGE_KEYS.authToken);
};

export const setAuthToken = (token: string) => {
  globalThis.localStorage.setItem(PROGRAM_STORAGE_KEYS.authToken, token);
  notifyAuthSessionChange();
};

export const clearAuthToken = () => {
  globalThis.localStorage.removeItem(PROGRAM_STORAGE_KEYS.authToken);
  notifyAuthSessionChange();
};

export const setAuthUser = (user: AuthUser) => {
  globalThis.localStorage.setItem(PROGRAM_STORAGE_KEYS.authUser, JSON.stringify(user));
  notifyAuthSessionChange();
};

export const getAuthUser = (): AuthUser | null => {
  const raw = globalThis.localStorage.getItem(PROGRAM_STORAGE_KEYS.authUser);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    globalThis.localStorage.removeItem(PROGRAM_STORAGE_KEYS.authUser);
    return null;
  }
};

export const clearAuthUser = () => {
  globalThis.localStorage.removeItem(PROGRAM_STORAGE_KEYS.authUser);
  notifyAuthSessionChange();
};

export const clearSession = () => {
  clearAuthToken();
  clearAuthUser();
  notifyAuthSessionChange();
};

export const isAuthenticated = () => {
  return Boolean(getAuthUser());
};
