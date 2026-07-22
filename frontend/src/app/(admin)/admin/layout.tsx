"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  FolderKanban,
  ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings,
  SlidersHorizontal,
  Star,
  UsersRound,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/customers", label: "Customers", icon: UsersRound },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/quotes", label: "Quotes", icon: MessageSquareQuote },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/portfolio", label: "Portfolio", icon: ImageIcon },
  { href: "/admin/services", label: "Services", icon: Zap },
  { href: "/admin/blog", label: "Blog", icon: BookOpenText },
  { href: "/admin/contacts", label: "Contact Requests", icon: BriefcaseBusiness },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
] as const;

const SECTION_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/customers": "Customers",
  "/admin/leads": "Leads",
  "/admin/quotes": "Quotes",
  "/admin/projects": "Projects",
  "/admin/portfolio": "Portfolio",
  "/admin/services": "Services",
  "/admin/blog": "Blog",
  "/admin/contacts": "Contact Requests",
  "/admin/testimonials": "Testimonials",
  "/admin/settings": "Settings",
  "/admin/profile": "Admin Profile",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/admin/login");
      } else if (!isAdmin) {
        router.replace("/dashboard");
      }
    }
  }, [loading, user, isAdmin, router]);

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
    router.replace("/admin/login");
  }

  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-navy-deep">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-gold border-t-transparent" />
          <p className="text-sm font-medium text-white/60">
            Opening admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  const sectionTitle = getSectionTitle(pathname);
  const adminName = `${user.firstName} ${user.lastName}`.trim();

  return (
    <div className="admin-surface min-h-screen bg-[#f5f3ec] lg:flex">
      <AdminSidebar
        adminName={adminName}
        email={user.email}
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
                Admin
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open admin menu"
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
            aria-label="Close admin menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[88vw] max-w-sm flex-col bg-brand-navy-deep text-white shadow-2xl">
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
                aria-label="Close admin menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <AdminSidebarContent
              adminName={adminName}
              email={user.email}
              pathname={pathname}
              onLogout={handleLogout}
            />
          </aside>
        </div>
      ) : null}

      <main className="min-h-screen flex-1 px-4 pb-10 pt-24 sm:px-6 lg:ml-72 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 hidden items-center justify-between gap-6 rounded-[2rem] border border-white bg-white/80 px-6 py-5 shadow-sa-lg backdrop-blur-xl lg:flex">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                Admin Control Room
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-brand-navy">
                {sectionTitle}
              </h1>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-[#fbfaf6] px-4 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="text-right">
                <p className="text-sm font-semibold text-brand-navy">{adminName}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          </header>

          {children}
        </div>
      </main>
    </div>
  );
}

function AdminSidebar({
  adminName,
  email,
  pathname,
  onLogout,
}: {
  adminName: string;
  email: string;
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
              Admin Dashboard
            </span>
          </span>
        </Link>
      </div>

      <AdminSidebarContent
        adminName={adminName}
        email={email}
        pathname={pathname}
        onLogout={onLogout}
      />
    </aside>
  );
}

function AdminSidebarContent({
  adminName,
  email,
  pathname,
  onLogout,
}: {
  adminName: string;
  email: string;
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
            {adminName}
          </p>
          <p className="mt-1 truncate text-xs text-white/45">{email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 pb-4" aria-label="Admin sections">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const active =
            pathname === link.href ||
            (link.href !== "/admin/dashboard" && pathname.startsWith(link.href));

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
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/admin/profile"
          className="mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/60 transition-colors hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          <BarChart3 className="h-4 w-4 text-brand-gold" aria-hidden="true" />
          Admin Profile
        </Link>
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

function getSectionTitle(pathname: string) {
  const exact = SECTION_TITLES[pathname];
  if (exact) return exact;

  const match = adminLinks.find(
    (link) => link.href !== "/admin/dashboard" && pathname.startsWith(link.href)
  );

  return match?.label ?? "Admin";
}
