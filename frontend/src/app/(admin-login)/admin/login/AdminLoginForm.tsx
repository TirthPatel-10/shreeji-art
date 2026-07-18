"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";

export default function AdminLoginForm() {
  const { login, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect already-authenticated admins immediately
  useEffect(() => {
    if (!authLoading && isAdmin) {
      router.replace("/admin/dashboard");
    }
  }, [authLoading, isAdmin, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        if (res.data.user.role !== "ROLE_ADMIN") {
          setError(
            "Access denied. This portal is for administrators only. Use the customer login instead."
          );
          return;
        }
        login(res.data.token, res.data.user);
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from");
        router.replace(
          from && from.startsWith("/admin") && from !== "/admin/login"
            ? from
            : "/admin/dashboard"
        );
      } else {
        setError(res.message || "Invalid email or password.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-4 py-12">
      {/* Brand + portal label */}
      <div className="mb-10 text-center select-none">
        <Link
          href="/"
          className="text-brand-gold font-display text-3xl font-bold tracking-wide"
        >
          Shreeji Art
        </Link>
        <div className="mt-3 flex items-center justify-center gap-2 text-gray-500 text-xs font-medium tracking-widest uppercase">
          <LockIcon />
          <span>Admin Portal</span>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-[360px] bg-[#12122a] rounded-2xl border border-white/8 shadow-2xl overflow-hidden">
        {/* Card header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/8">
          <h1 className="text-white text-xl font-semibold">
            Administrator Sign In
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Management dashboard access only
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-7">
          {error && (
            <div className="mb-6 flex gap-3 items-start bg-red-950/60 border border-red-800/50 rounded-xl px-4 py-3">
              <ErrorIcon />
              <p className="text-red-300 text-sm leading-snug">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-400 uppercase tracking-widest"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shreejiart.in"
                className="w-full bg-[#0a0a1e] border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold/60 focus:border-transparent transition"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-400 uppercase tracking-widest"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-[#0a0a1e] border border-white/10 text-white text-sm rounded-xl px-4 py-3 pr-11 placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold/60 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 px-3.5 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || authLoading}
              className="w-full mt-1 bg-brand-gold hover:bg-brand-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl transition-all duration-150 shadow-lg shadow-brand-gold/20"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="mt-8 text-gray-700 hover:text-gray-400 text-sm transition-colors"
      >
        ← Back to Shreeji Art
      </Link>

      {/* Customer login link */}
      <p className="mt-3 text-gray-700 text-xs">
        Not an admin?{" "}
        <Link href="/login" className="text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2">
          Customer login
        </Link>
      </p>
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-red-400 mt-0.5 flex-shrink-0" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="animate-spin" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 10 10" />
    </svg>
  );
}
