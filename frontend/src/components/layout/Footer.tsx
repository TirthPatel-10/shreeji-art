import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";

const SERVICES_COL = [
  "LED Signs",
  "Acrylic Signs",
  "3D Letter Signs",
  "ACP Signage",
  "SS Signage",
  "Office Branding",
  "Glow Sign Boards",
  "Wayfinding Systems",
];

const COMPANY_COL = [
  { href: "/about",     label: "About Us"  },
  { href: "/services",  label: "Services"  },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/gallery",   label: "Gallery"   },
  { href: "/blog",      label: "Blog"      },
  { href: "/contact",   label: "Contact"   },
];

export default function Footer() {
  return (
    <footer className="bg-[#060610] text-gray-400">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-5">
              <Image
                src="/SA.png"
                alt=""
                width={42}
                height={42}
                className="invert mix-blend-screen"
              />
              <span className="font-display font-bold text-2xl text-brand-gold tracking-tight">
                Shreeji Art
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500 mb-5 max-w-xs">
              Premium signage manufacturing and branding solutions in Ahmedabad,
              Gujarat. Crafting signs that define brands since 2013.
            </p>
            <Link
              href="/quote"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-brand-gold hover:text-brand-gold-light transition-colors"
            >
              Get a Free Quote
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
              Services
            </h4>
            <ul className="space-y-2.5">
              {SERVICES_COL.map((s) => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-sm text-gray-500 hover:text-brand-gold transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {COMPANY_COL.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-500 hover:text-brand-gold transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
              Contact
            </h4>
            <address className="not-italic space-y-3 text-sm text-gray-500">
              <p className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-brand-gold mt-0.5" />
                <span>Ahmedabad, Gujarat — 380001, India</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand-gold" />
                <a href="tel:+919999999999" className="hover:text-brand-gold transition-colors">
                  +91 99999 99999
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-gold" />
                <a href="mailto:info@shreejiart.in" className="hover:text-brand-gold transition-colors">
                  info@shreejiart.in
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Shreeji Art. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/quote" className="hover:text-brand-gold transition-colors">
              Get a Quote
            </Link>
            <Link href="/login" className="hover:text-brand-gold transition-colors">
              Customer Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
