import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <span className="text-brand-gold font-display font-bold text-xl block mb-3">
              Shreeji Art
            </span>
            <p className="text-sm leading-relaxed">
              Premium signage manufacturing and branding solutions in Ahmedabad,
              Gujarat, India.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Services
            </h4>
            <ul className="space-y-2 text-sm">
              {["LED Signs", "Acrylic Signs", "3D Letter Signs", "ACP Signage", "Office Branding"].map(
                (s) => (
                  <li key={s}>
                    <Link href="/services" className="hover:text-brand-gold transition-colors">
                      {s}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/about", label: "About Us" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/gallery", label: "Gallery" },
                { href: "/blog", label: "Blog" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-brand-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
              Contact
            </h4>
            <address className="not-italic text-sm space-y-2">
              <p>Ahmedabad, Gujarat — 380001</p>
              <p>
                <a href="tel:+919999999999" className="hover:text-brand-gold transition-colors">
                  +91 99999 99999
                </a>
              </p>
              <p>
                <a href="mailto:info@shreejiart.in" className="hover:text-brand-gold transition-colors">
                  info@shreejiart.in
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Shreeji Art. All rights reserved.</p>
          <div className="flex gap-4">
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
