"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const portalLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quotes", label: "My Quotes" },
  { href: "/projects", label: "My Projects" },
  { href: "/profile", label: "Profile" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-brand-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-brand-navy text-white flex-shrink-0 hidden md:flex flex-col">
        {/* Brand */}
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3">
            <Image
              src="/shreeji-final-logo.png"
              alt=""
              width={40}
              height={40}
              className="rounded-full object-cover flex-shrink-0"
            />
            <span className="text-brand-gold font-display font-bold text-lg leading-tight">
              Shreeji Art
            </span>
          </Link>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">
            Customer Portal
          </p>
          <p className="text-xs text-gray-300 mt-1 truncate">
            {user.firstName} {user.lastName}
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {portalLinks.map((l) => {
            const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-white/15 text-brand-gold font-medium"
                    : "hover:bg-white/10 hover:text-brand-gold text-gray-300"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Request a Quote CTA */}
          <div className="pt-3">
            <Link
              href="/quotes/new"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-brand-gold/15 text-brand-gold border border-brand-gold/25 hover:bg-brand-gold/25 transition-colors"
            >
              <span className="text-base leading-none">+</span>
              Request a Quote
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-brand-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2">
          <Image
            src="/shreeji-final-logo.png"
            alt=""
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <span className="text-brand-gold font-display font-bold text-base">Shreeji Art</span>
        </Link>
        <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-white">
          Sign out
        </button>
      </div>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 max-w-5xl">{children}</main>
    </div>
  );
}
