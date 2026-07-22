"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FolderKanban,
  Home,
  LogOut,
  Menu,
  ReceiptText,
  UserRound,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const portalLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/quote", label: "Request a Quote", icon: ReceiptText },
  { href: "/quotes", label: "My Quotes", icon: ReceiptText },
  { href: "/projects", label: "My Projects", icon: FolderKanban },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

export default function CustomerLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading, isAdmin, isCustomer, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (isAdmin) {
      router.replace("/admin/dashboard");
      return;
    }

    if (!isCustomer) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isAdmin, isCustomer, loading, pathname, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    router.replace("/");
  }

  if (loading || !user || !isCustomer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-navy-deep">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-gold border-t-transparent" />
          <p className="text-sm font-medium text-white/60">
            Opening customer portal...
          </p>
        </div>
      </div>
    );
  }

  const customerName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="min-h-screen bg-[#f6f4ee] lg:flex">
      <CustomerSidebar
        customerName={customerName}
        customerEmail={user.email}
        pathname={pathname}
        onLogout={handleLogout}
      />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-brand-navy/95 px-4 py-3 text-white shadow-sa-lg backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/shreeji-final-logo.png"
              alt=""
              width={40}
              height={40}
              className="rounded-full border border-brand-gold/30 object-cover"
            />
            <span>
              <span className="block font-display text-lg font-semibold leading-none text-brand-gold">
                Shreeji Art
              </span>
              <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                Customer Portal
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open customer menu"
            aria-expanded={mobileOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close customer menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[86vw] max-w-sm flex-col bg-brand-navy-deep text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/shreeji-final-logo.png"
                  alt=""
                  width={42}
                  height={42}
                  className="rounded-full border border-brand-gold/30 object-cover"
                />
                <span className="font-display text-xl font-semibold text-brand-gold">
                  Shreeji Art
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close customer menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <CustomerSidebarContent
              customerName={customerName}
              customerEmail={user.email}
              pathname={pathname}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      ) : null}

      <main className="min-h-screen flex-1 px-4 pb-10 pt-24 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}

function CustomerSidebar({
  customerName,
  customerEmail,
  pathname,
  onLogout,
}: {
  customerName: string;
  customerEmail: string;
  pathname: string;
  onLogout: () => void;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-brand-navy-deep text-white shadow-2xl lg:flex">
      <div className="border-b border-white/10 p-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/shreeji-final-logo.png"
            alt=""
            width={48}
            height={48}
            className="rounded-full border border-brand-gold/30 object-cover shadow-[0_0_28px_rgba(212,160,23,0.18)]"
          />
          <span>
            <span className="block font-display text-2xl font-semibold leading-none text-brand-gold">
              Shreeji Art
            </span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Customer Portal
            </span>
          </span>
        </Link>
      </div>

      <CustomerSidebarContent
        customerName={customerName}
        customerEmail={customerEmail}
        pathname={pathname}
        onLogout={onLogout}
      />
    </aside>
  );
}

function CustomerSidebarContent({
  customerName,
  customerEmail,
  pathname,
  onLogout,
}: {
  customerName: string;
  customerEmail: string;
  pathname: string;
  onLogout: () => void;
}) {
  return (
    <>
      <div className="p-5">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Signed in as
          </p>
          <p className="mt-2 truncate font-display text-xl font-semibold text-white">
            {customerName}
          </p>
          <p className="mt-1 truncate text-xs text-white/45">{customerEmail}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4" aria-label="Customer portal">
        {portalLinks.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={[
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none",
                active
                  ? "bg-brand-gold text-brand-navy shadow-[0_18px_38px_rgba(212,160,23,0.22)]"
                  : "text-white/62 hover:bg-white/[0.08] hover:text-white",
              ].join(" ")}
            >
              <Icon
                className={`h-4 w-4 ${
                  active ? "text-brand-navy" : "text-brand-gold"
                }`}
                aria-hidden="true"
              />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
        >
          <LogOut className="h-4 w-4 text-brand-gold" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </>
  );
}
