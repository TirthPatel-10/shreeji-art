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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sa_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored) as AuthUser);
      } catch {
        localStorage.removeItem("sa_user");
        localStorage.removeItem("sa_token");
        document.cookie = "sa_auth=; path=/; max-age=0; SameSite=Strict";
      }
    }
    setLoading(false);
  }, []);

  function login(token: string, userData: AuthUser) {
    localStorage.setItem("sa_token", token);
    localStorage.setItem("sa_user", JSON.stringify(userData));
    document.cookie = `sa_auth=1; path=/; max-age=86400; SameSite=Strict`;
    document.cookie = `sa_role=${userData.role}; path=/; max-age=86400; SameSite=Strict`;
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("sa_token");
    localStorage.removeItem("sa_user");
    document.cookie = "sa_auth=; path=/; max-age=0; SameSite=Strict";
    document.cookie = "sa_role=; path=/; max-age=0; SameSite=Strict";
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
        isAuthenticated: user !== null,
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
