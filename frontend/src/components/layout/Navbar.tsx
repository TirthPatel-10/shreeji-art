"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

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
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const dashboardHref = isAdmin ? "/admin/dashboard" : "/dashboard";
  const dashboardLabel = isAdmin ? "Admin" : "Dashboard";

  function handleLogout() {
    logout();
    setOpen(false);
    router.replace("/");
  }

  return (
    <nav className="bg-brand-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/SA.png"
              alt=""
              width={34}
              height={34}
              priority
              className="invert mix-blend-screen"
            />
            <span className="text-brand-gold font-display font-bold text-xl">
              Shreeji Art
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  pathname === l.href
                    ? "text-sm text-brand-gold font-medium transition-colors"
                    : "text-sm hover:text-brand-gold transition-colors"
                }
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Get Quote
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  className="text-sm border border-white/30 hover:border-brand-gold px-4 py-2 rounded-lg transition-colors"
                >
                  {dashboardLabel}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm border border-white/30 hover:border-brand-gold px-4 py-2 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-navy-light px-4 pb-4 space-y-2">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href
                  ? "block py-2 text-sm text-brand-gold font-medium transition-colors"
                  : "block py-2 text-sm hover:text-brand-gold transition-colors"
              }
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/quote"
            className="block mt-2 bg-brand-gold text-white text-sm font-semibold px-4 py-2 rounded-lg text-center"
            onClick={() => setOpen(false)}
          >
            Get Quote
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href={dashboardHref}
                className="block text-sm text-center border border-white/30 px-4 py-2 rounded-lg"
                onClick={() => setOpen(false)}
              >
                {dashboardLabel}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-sm text-center text-gray-300 py-2 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="block text-sm text-center border border-white/30 px-4 py-2 rounded-lg"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
