import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";

import type { AuthPayload } from "../api/client";

type AuthState = {
  token: string | null;
  user: AuthPayload["user"] | null;
  setAuth: (payload: AuthPayload) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

const TOKEN_KEY = "ai-study-assistant-token";
const USER_KEY = "ai-study-assistant-user";

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthPayload["user"] | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthPayload["user"]) : null;
  });

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      setAuth: (payload) => {
        localStorage.setItem(TOKEN_KEY, payload.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
        setToken(payload.access_token);
        setUser(payload.user);
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      },
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

