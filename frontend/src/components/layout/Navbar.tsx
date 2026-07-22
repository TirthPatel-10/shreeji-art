"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileDrawerRef = useRef<HTMLElement | null>(null);
  const { isAuthenticated, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const dashboardHref = isAdmin ? "/admin/dashboard" : "/dashboard";
  const dashboardLabel = isAdmin ? "Admin" : "Dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  useEffect(() => {
    const drawer = mobileDrawerRef.current;
    if (!drawer) return;

    if (open) {
      drawer.removeAttribute("inert");
    } else {
      drawer.setAttribute("inert", "");
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    router.replace("/");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 border-b border-white/10 bg-brand-navy/95 text-white backdrop-blur-xl transition-shadow duration-300",
        scrolled ? "shadow-[0_18px_50px_-24px_rgb(7_7_17_/_0.9)]" : "shadow-none"
      )}
    >
      <div className="sa-container">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
            aria-label="Shreeji Art home"
            onClick={() => setOpen(false)}
          >
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-white/20 to-white/5 p-[2px] shadow-sa-glass">
              <span className="absolute inset-0 rounded-full ring-1 ring-brand-gold/25 transition group-hover:ring-brand-gold/55" />
              <span className="relative h-full w-full overflow-hidden rounded-full bg-white">
                <Image
                  src="/shreeji-final-logo.png"
                  alt=""
                  width={44}
                  height={44}
                  priority
                  sizes="44px"
                  className="h-full w-full object-cover"
                />
              </span>
            </span>
            <span className="truncate font-display text-xl font-bold tracking-tight text-white">
              Shreeji <span className="text-brand-gold">Art</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative rounded-full px-3 py-2 text-sm font-medium text-white/75 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy",
                    active && "text-brand-gold"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 rounded-full bg-brand-gold transition-transform duration-200 group-hover:scale-x-100",
                      active && "scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/quote"
              className="rounded-full bg-brand-gold px-4 py-2 text-sm font-semibold text-white shadow-sa-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light hover:text-brand-navy hover:shadow-sa-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy active:translate-y-0"
            >
              Get Quote
            </Link>
            {loading ? null : isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition-all duration-200 hover:border-brand-gold/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                >
                  {dashboardLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full px-3 py-2 text-sm font-medium text-white/60 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/85 transition-all duration-200 hover:border-brand-gold/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              >
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy lg:hidden"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="mobile-navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-16 z-40 bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <aside
        id="mobile-navigation"
        ref={mobileDrawerRef}
        className={cn(
          "fixed right-0 top-16 z-50 h-[calc(100dvh-4rem)] w-full max-w-sm border-l border-white/10 bg-brand-navy/95 p-5 text-white shadow-sa-glass backdrop-blur-2xl transition-transform duration-300 ease-smooth lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              onClick={() => setOpen(false)}
            >
              <span className="h-11 w-11 overflow-hidden rounded-full bg-white ring-1 ring-brand-gold/30">
                <Image
                  src="/shreeji-final-logo.png"
                  alt=""
                  width={44}
                  height={44}
                  priority
                  sizes="44px"
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-display text-xl font-bold">
                Shreeji <span className="text-brand-gold">Art</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              aria-label="Close navigation menu"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-base font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy",
                    active && "bg-white/10 text-brand-gold"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
            <Link
              href="/quote"
              className="flex w-full items-center justify-center rounded-2xl bg-brand-gold px-5 py-3 text-base font-semibold text-white shadow-sa-sm transition-all duration-200 hover:bg-brand-gold-light hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
              onClick={() => setOpen(false)}
            >
              Get Quote
            </Link>
            {loading ? null : isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="flex w-full items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-base font-medium text-white transition-colors hover:border-brand-gold/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                  onClick={() => setOpen(false)}
                >
                  {dashboardLabel}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center rounded-2xl px-5 py-3 text-base font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-2xl border border-white/20 px-5 py-3 text-base font-medium text-white transition-colors hover:border-brand-gold/70 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            )}
          </div>

          <p className="mt-auto pt-6 text-xs uppercase tracking-[0.2em] text-white/40">
            Premium signage company
          </p>
        </div>
      </aside>
    </nav>
  );
}
