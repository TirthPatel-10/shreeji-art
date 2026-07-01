"use client";

import { useState, useEffect } from "react";
import type { AuthUser } from "@/types";

export function useAuth() {
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
      }
    }
    setLoading(false);
  }, []);

  function login(token: string, userData: AuthUser) {
    localStorage.setItem("sa_token", token);
    localStorage.setItem("sa_user", JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem("sa_token");
    localStorage.removeItem("sa_user");
    setUser(null);
  }

  const isAdmin = user?.role === "ROLE_ADMIN";
  const isCustomer = user?.role === "ROLE_CUSTOMER";
  const isAuthenticated = user !== null;

  return { user, loading, login, logout, isAdmin, isCustomer, isAuthenticated };
}
