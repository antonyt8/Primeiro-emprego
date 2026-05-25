import { request } from "@/api/http";
import { clearSession, setAuthToken, setAuthUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  cpf: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

const persistSession = (data: AuthResponse) => {
  setAuthToken(data.token);
  setAuthUser(data.user);
};

export const authApi = {
  login: async (payload: LoginPayload) => {
    const data = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: payload,
    });
    persistSession(data);
    return data;
  },

  register: async (payload: RegisterPayload) => {
    const data = await request<AuthResponse>("/auth/register", {
      method: "POST",
      body: payload,
    });
    persistSession(data);
    return data;
  },

  me: async () => {
    try {
      const user = await request<AuthUser>("/auth/me", { method: "GET" });
      setAuthUser(user);
      return user;
    } catch {
      return null;
    }
  },

  logout: async () => {
    try {
      await request<void>("/auth/logout", { method: "POST" });
    } finally {
      clearSession();
    }
  },
};
