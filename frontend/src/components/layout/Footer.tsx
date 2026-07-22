import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { SITE_CONTACT } from "@/lib/contact";

const SERVICES_LINKS = [
  "LED Sign Boards",
  "Acrylic Signs",
  "3D Letter Signs",
  "ACP Signage",
  "Stainless Steel Signs",
  "Glow Sign Boards",
] as const;

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/quote", label: "Get Quote" },
] as const;

const SOCIAL_LINKS = [
  { href: "https://www.instagram.com/", label: "Instagram", icon: Instagram },
  { href: "https://www.facebook.com/", label: "Facebook", icon: Facebook },
  { href: "https://www.linkedin.com/", label: "LinkedIn", icon: Linkedin },
] as const;

const CONTACT_LINKS = [
  {
    href: SITE_CONTACT.whatsappHref,
    label: "WhatsApp",
    value: SITE_CONTACT.phone,
    icon: MessageCircle,
    external: true,
  },
  {
    href: SITE_CONTACT.phoneHref,
    label: "Phone",
    value: SITE_CONTACT.phone,
    icon: Phone,
    external: false,
  },
  {
    href: SITE_CONTACT.emailHref,
    label: "Email",
    value: SITE_CONTACT.email,
    icon: Mail,
    external: false,
  },
] as const;

const footerLinkClass =
  "text-sm text-white/55 transition-colors hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-deep";

export default function Footer({ compact = false }: { compact?: boolean }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-gold/20 bg-brand-navy-deep text-white">
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
          compact ? "py-10 lg:py-12" : "py-14 lg:py-16"
        }`}
      >
        <div
          className={`grid lg:grid-cols-[1.25fr_0.8fr_0.8fr_1.1fr] ${
            compact ? "gap-7" : "gap-10"
          }`}
        >
          <section aria-labelledby="footer-brand">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-deep"
            >
              <Image
                src="/shreeji-final-logo.png"
                alt=""
                width={54}
                height={54}
                className="rounded-full border border-brand-gold/35 object-cover shadow-[0_0_28px_rgba(212,160,23,0.18)] transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
              />
              <span>
                <span
                  id="footer-brand"
                  className="block font-display text-2xl font-semibold leading-none text-brand-gold"
                >
                  Shreeji Art
                </span>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.26em] text-white/45">
                  Premium Signage Company
                </span>
              </span>
            </Link>

            <p
              className={`max-w-sm text-sm text-white/58 ${
                compact ? "mt-4 leading-6" : "mt-6 leading-7"
              }`}
            >
              Premium signage manufacturing and brand visibility solutions for
              retail, corporate, hospitality, healthcare, and industrial spaces
              across Ahmedabad and Gujarat.
            </p>

            <div
              className={`flex flex-wrap items-center gap-3 ${
                compact ? "mt-5" : "mt-7"
              }`}
            >
              <Link
                href="/quote"
                className="inline-flex items-center justify-center rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-navy shadow-sa-md transition-all duration-200 hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-deep motion-reduce:transition-none"
              >
                Get a Free Quote
              </Link>
              <a
                href={SITE_CONTACT.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:border-brand-gold/50 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-deep motion-reduce:transition-none"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </section>

          <FooterColumn title="Services">
            {SERVICES_LINKS.map((service) => (
              <li key={service}>
                <Link href="/services" className={footerLinkClass}>
                  {service}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Quick Links">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <section aria-labelledby="footer-contact">
            <h2
              id="footer-contact"
              className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold"
            >
              Contact
            </h2>

            <address className="mt-5 space-y-4 not-italic">
              {CONTACT_LINKS.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer" : undefined}
                    className="group flex items-start gap-3 rounded-2xl text-sm text-white/58 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-deep"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10 text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-navy">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                        {item.label}
                      </span>
                      <span className="mt-1 block">{item.value}</span>
                    </span>
                  </a>
                );
              })}

              <p className="flex items-start gap-3 text-sm text-white/58">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10 text-brand-gold">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Address
                  </span>
                  <span className="mt-1 block">
                    {SITE_CONTACT.address}
                  </span>
                </span>
              </p>

              <p className="flex items-start gap-3 text-sm text-white/58">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10 text-brand-gold">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Business Hours
                  </span>
                  <span className="mt-1 block">
                    {SITE_CONTACT.businessHours}
                  </span>
                  <span className="mt-1 block text-white/35">Sunday closed</span>
                </span>
              </p>
            </address>
          </section>
        </div>

        <div
          className={`flex flex-col gap-6 border-t border-white/10 sm:flex-row sm:items-center sm:justify-between ${
            compact ? "mt-8 pt-5" : "mt-12 pt-6"
          }`}
        >
          <p className="text-xs text-white/40">
            © {currentYear} Shreeji Art. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/50 transition-all duration-200 hover:border-brand-gold/45 hover:bg-brand-gold/10 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-deep motion-reduce:transition-none"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              );
            })}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold text-white/45 transition-colors hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-deep"
            >
              Contact us
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <nav aria-labelledby={`footer-${title.toLowerCase().replaceAll(" ", "-")}`}>
      <h2
        id={`footer-${title.toLowerCase().replaceAll(" ", "-")}`}
        className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold"
      >
        {title}
      </h2>
      <ul className="mt-5 space-y-3">{children}</ul>
    </nav>
  );
}
