"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from");
        if (res.data.user.role === "ROLE_ADMIN") {
          router.replace(from ?? "/admin/dashboard");
        } else {
          router.replace(from ?? "/dashboard");
        }
      } else {
        setError(res.message || "Invalid email or password.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Logo badge above card */}
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6 select-none">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <Image
              src="/shreeji-final-logo.png"
              alt="Shreeji Art"
              width={64}
              height={64}
              priority
              className="rounded-full object-cover shadow-lg"
            />
            <span className="font-display font-bold text-lg text-brand-navy tracking-tight">
              Shreeji Art
            </span>
          </Link>
        </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-display font-bold text-brand-navy mb-1 text-center">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Sign in to your Shreeji Art account
        </p>

        {error && (
          <div className="mb-4 text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-gold hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
      </div>
    </main>
  );
}
