import { createContext, useContext } from "react";
import type { AuthUser } from "@/lib/auth";

export interface SessionContextValue {
  authReady: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  role: string | null;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => Promise<void>;
}

export const SessionContext = createContext<SessionContextValue>({
  authReady: false,
  isAuthenticated: false,
  user: null,
  role: null,
  setIsAuthenticated: () => {},
  logout: async () => {},
});

export const useSession = () => useContext(SessionContext);
