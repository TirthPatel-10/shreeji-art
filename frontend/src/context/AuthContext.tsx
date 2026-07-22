"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isAdmin: boolean;
  isCustomer: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function clearStoredAuth() {
  localStorage.removeItem("sa_token");
  localStorage.removeItem("sa_user");
  document.cookie = "sa_auth=; path=/; max-age=0; SameSite=Strict";
  document.cookie = "sa_role=; path=/; max-age=0; SameSite=Strict";
}

function getTokenExpirationSeconds(token: string) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "="
    );
    const decoded = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function isValidStoredUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<AuthUser>;
  return (
    typeof user.id === "number" &&
    typeof user.email === "string" &&
    typeof user.firstName === "string" &&
    typeof user.lastName === "string" &&
    (user.role === "ROLE_ADMIN" || user.role === "ROLE_CUSTOMER")
  );
}

function isUsableToken(token: string | null) {
  if (!token) return false;
  const exp = getTokenExpirationSeconds(token);
  return exp !== null && exp * 1000 > Date.now();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sa_token");
    const stored = localStorage.getItem("sa_user");

    if (!stored || !isUsableToken(token)) {
      clearStoredAuth();
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as unknown;
      if (!isValidStoredUser(parsed)) {
        clearStoredAuth();
      } else {
        setUser(parsed);
      }
    } catch {
      clearStoredAuth();
    }
    setLoading(false);
  }, []);

  function login(token: string, userData: AuthUser) {
    if (!token || !isUsableToken(token) || !isValidStoredUser(userData)) {
      clearStoredAuth();
      setUser(null);
      return;
    }

    const exp = getTokenExpirationSeconds(token);
    const maxAge = exp
      ? Math.max(0, Math.floor(exp - Date.now() / 1000))
      : 86400;

    localStorage.setItem("sa_token", token);
    localStorage.setItem("sa_user", JSON.stringify(userData));
    document.cookie = `sa_auth=1; path=/; max-age=${maxAge}; SameSite=Strict`;
    document.cookie = `sa_role=${userData.role}; path=/; max-age=${maxAge}; SameSite=Strict`;
    setUser(userData);
  }

  function logout() {
    clearStoredAuth();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === "ROLE_ADMIN",
        isCustomer: user?.role === "ROLE_CUSTOMER",
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
