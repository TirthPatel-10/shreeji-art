"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";

export default function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.register(form);
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        router.replace("/dashboard");
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#080A14] px-4 py-24 text-white sm:px-6">
      <style jsx>{`
        @keyframes register-card-enter {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes register-glow-gold-drift {
          0%,
          100% {
            transform: translate(-62%, -20%);
          }
          50% {
            transform: translate(calc(-62% + 26px), calc(-20% - 18px));
          }
        }

        @keyframes register-glow-blue-drift {
          0%,
          100% {
            transform: translate(-8%, -82%) rotate(10deg);
          }
          50% {
            transform: translate(calc(-8% - 22px), calc(-82% + 24px)) rotate(10deg);
          }
        }

        .register-card-glass {
          animation: register-card-enter 520ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        .register-glow-gold {
          animation: register-glow-gold-drift 19s ease-in-out infinite;
        }

        .register-glow-blue {
          animation: register-glow-blue-drift 22s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .register-card-glass,
          .register-glow-gold,
          .register-glow-blue {
            animation: none;
          }
        }
      `}</style>
      <div
        className="absolute inset-0 -z-30 opacity-[0.035] sm:opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.28) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.28) 1px,transparent 1px)",
          backgroundSize: "68px 68px",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-20 opacity-[0.028] sm:opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(132deg,transparent 0 47%,rgba(255,255,255,.22) 48%,transparent 49% 100%),radial-gradient(circle at 72% 78%,rgba(255,255,255,.18) 0 1px,transparent 1px)",
          backgroundSize: "180px 180px, 42px 42px",
        }}
        aria-hidden="true"
      />
      <div
        className="register-glow-gold pointer-events-none absolute left-1/2 top-1/2 z-0 h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle,rgba(217,167,15,0.24),rgba(217,167,15,0.18)_35%,transparent_72%)] blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="register-glow-blue pointer-events-none absolute left-1/2 top-1/2 z-0 h-[44rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(47,76,143,0.22),rgba(47,76,143,0.16)_36%,transparent_72%)] blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="absolute right-[-10rem] top-[-8rem] -z-20 hidden h-[30rem] w-[30rem] rounded-full bg-brand-gold/8 blur-[115px] sm:block"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(8,10,20,0.22)_42%,rgba(8,10,20,0.86)_100%)]"
        aria-hidden="true"
      />
      <Link
        href="/"
        className="group absolute left-5 top-5 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-[rgba(18,20,34,0.44)] px-4 py-2 text-sm font-medium text-white/76 shadow-[inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-[14px] transition-all duration-200 hover:border-brand-gold/[0.48] hover:bg-brand-gold/[0.075] hover:text-[#F1D28A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A14] sm:left-8 sm:top-8"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden="true" />
        Return to Website
      </Link>

      <div className="register-card-glass relative z-10 w-full max-w-[520px] overflow-hidden rounded-[26px] border border-[rgba(222,174,25,0.38)] bg-[linear-gradient(145deg,rgba(30,32,50,0.62),rgba(8,10,22,0.48))] p-6 text-center shadow-[0_42px_110px_rgba(0,0,0,.56),0_18px_46px_rgba(0,0,0,.34),0_0_48px_rgba(214,166,20,.08),inset_0_1px_0_rgba(255,255,255,.12),inset_0_0_0_1px_rgba(255,255,255,.035)] backdrop-blur-[32px] backdrop-saturate-[1.45] sm:p-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-36 rounded-t-[26px] bg-[linear-gradient(125deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.035)_32%,transparent_58%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-20 top-3 z-0 h-24 w-[130%] -rotate-6 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.105),transparent)] blur-xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-x-8 top-0 z-0 h-px bg-gradient-to-r from-transparent via-white/32 to-transparent"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-20 -top-24 z-0 h-60 w-60 rounded-full bg-brand-gold/[0.18] blur-[62px]"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto mb-4 flex flex-col items-center">
          <Link href="/" className="group inline-flex flex-col items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
            <span
              className="absolute top-1 h-20 w-20 animate-pulse-subtle rounded-full bg-brand-gold/10 blur-2xl motion-reduce:animate-none"
              aria-hidden="true"
            />
            <Image
              src="/shreeji-final-logo.png"
              alt="Shreeji Art"
              width={64}
              height={64}
              priority
              className="animate-scale-in rounded-full object-cover shadow-[0_16px_38px_-18px_rgba(212,160,23,.85)] ring-1 ring-brand-gold/30"
            />
            <span className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-brand-gold">
              Shreeji <span className="text-brand-gold">Art</span>
            </span>
          </Link>
        </div>

        <h1 className="relative z-10 font-display text-4xl font-semibold tracking-tight text-[#F8F6F1]">
          Create Your Account
        </h1>
        <p className="relative z-10 mt-2 text-sm leading-6 text-white/76">
          Register to access your Shreeji Art account.
        </p>

        {error && (
          <div className="relative z-10 mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-left text-sm leading-6 text-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative z-10 mt-5 space-y-4 text-left">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
              <label className="mb-2 block text-sm font-medium text-white/90">
                First Name
              </label>
              <input
                type="text"
                required
                autoComplete="given-name"
                placeholder="First name"
                value={form.firstName}
                onChange={set("firstName")}
                className="h-12 w-full rounded-2xl border border-white/[0.22] bg-[linear-gradient(180deg,rgba(5,7,16,0.48),rgba(13,15,28,0.38))] px-4 text-sm text-white shadow-[inset_0_2px_10px_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.035)] transition-all duration-200 [color-scheme:dark] placeholder:text-white/46 hover:border-white/34 hover:bg-[linear-gradient(180deg,rgba(5,7,16,0.56),rgba(13,15,28,0.44))] focus:border-[rgba(232,181,23,0.88)] focus:outline-none focus:ring-4 focus:ring-brand-gold/[0.13] focus:shadow-[0_0_0_3px_rgba(232,181,23,0.13),inset_0_2px_10px_rgba(0,0,0,.32)]"
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: "120ms" }}>
              <label className="mb-2 block text-sm font-medium text-white/90">
                Last Name
              </label>
              <input
                type="text"
                required
                autoComplete="family-name"
                placeholder="Last name"
                value={form.lastName}
                onChange={set("lastName")}
                className="h-12 w-full rounded-2xl border border-white/[0.22] bg-[linear-gradient(180deg,rgba(5,7,16,0.48),rgba(13,15,28,0.38))] px-4 text-sm text-white shadow-[inset_0_2px_10px_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.035)] transition-all duration-200 [color-scheme:dark] placeholder:text-white/46 hover:border-white/34 hover:bg-[linear-gradient(180deg,rgba(5,7,16,0.56),rgba(13,15,28,0.44))] focus:border-[rgba(232,181,23,0.88)] focus:outline-none focus:ring-4 focus:ring-brand-gold/[0.13] focus:shadow-[0_0_0_3px_rgba(232,181,23,0.13),inset_0_2px_10px_rgba(0,0,0,.32)]"
              />
            </div>
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "160ms" }}>
            <label className="mb-2 block text-sm font-medium text-white/90">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              className="h-12 w-full rounded-2xl border border-white/[0.22] bg-[linear-gradient(180deg,rgba(5,7,16,0.48),rgba(13,15,28,0.38))] px-4 text-sm text-white shadow-[inset_0_2px_10px_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.035)] transition-all duration-200 [color-scheme:dark] placeholder:text-white/46 hover:border-white/34 hover:bg-[linear-gradient(180deg,rgba(5,7,16,0.56),rgba(13,15,28,0.44))] focus:border-[rgba(232,181,23,0.88)] focus:outline-none focus:ring-4 focus:ring-brand-gold/[0.13] focus:shadow-[0_0_0_3px_rgba(232,181,23,0.13),inset_0_2px_10px_rgba(0,0,0,.32)]"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "220ms" }}>
            <label className="mb-2 block text-sm font-medium text-white/90">
              Phone
            </label>
            <input
              type="tel"
              required
              autoComplete="tel"
              placeholder="+91 73836 28386"
              value={form.phone}
              onChange={set("phone")}
              className="h-12 w-full rounded-2xl border border-white/[0.22] bg-[linear-gradient(180deg,rgba(5,7,16,0.48),rgba(13,15,28,0.38))] px-4 text-sm text-white shadow-[inset_0_2px_10px_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.035)] transition-all duration-200 [color-scheme:dark] placeholder:text-white/46 hover:border-white/34 hover:bg-[linear-gradient(180deg,rgba(5,7,16,0.56),rgba(13,15,28,0.44))] focus:border-[rgba(232,181,23,0.88)] focus:outline-none focus:ring-4 focus:ring-brand-gold/[0.13] focus:shadow-[0_0_0_3px_rgba(232,181,23,0.13),inset_0_2px_10px_rgba(0,0,0,.32)]"
            />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "280ms" }}>
            <label className="mb-2 block text-sm font-medium text-white/90">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={set("password")}
              className="h-12 w-full rounded-2xl border border-white/[0.22] bg-[linear-gradient(180deg,rgba(5,7,16,0.48),rgba(13,15,28,0.38))] px-4 text-sm text-white shadow-[inset_0_2px_10px_rgba(0,0,0,.34),inset_0_1px_0_rgba(255,255,255,.035)] transition-all duration-200 [color-scheme:dark] placeholder:text-white/46 hover:border-white/34 hover:bg-[linear-gradient(180deg,rgba(5,7,16,0.56),rgba(13,15,28,0.44))] focus:border-[rgba(232,181,23,0.88)] focus:outline-none focus:ring-4 focus:ring-brand-gold/[0.13] focus:shadow-[0_0_0_3px_rgba(232,181,23,0.13),inset_0_2px_10px_rgba(0,0,0,.32)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[linear-gradient(135deg,#D7A20D_0%,#F2BF24_55%,#F7CC3A_100%)] px-6 py-3.5 text-sm font-semibold text-brand-navy shadow-[0_14px_34px_rgba(220,166,15,.24),inset_0_1px_0_rgba(255,255,255,.30)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_20px_44px_rgba(220,166,15,.34),inset_0_1px_0_rgba(255,255,255,.36)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#121423] disabled:pointer-events-none disabled:opacity-60 motion-reduce:transform-none motion-reduce:transition-none"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="relative z-10 mt-4.5 text-center text-sm text-white/58">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-gold transition-colors hover:text-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
