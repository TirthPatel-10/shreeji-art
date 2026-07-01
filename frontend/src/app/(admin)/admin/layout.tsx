import Link from "next/link";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/customers", label: "Customers", icon: "👥" },
  { href: "/admin/leads", label: "Leads", icon: "📥" },
  { href: "/admin/quotes", label: "Quotes", icon: "📄" },
  { href: "/admin/projects", label: "Projects", icon: "🏗️" },
  { href: "/admin/portfolio", label: "Portfolio", icon: "🖼️" },
  { href: "/admin/services", label: "Services", icon: "⚡" },
  { href: "/admin/blog", label: "Blog", icon: "✍️" },
  { href: "/admin/contacts", label: "Contact Requests", icon: "📬" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-brand-navy text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="text-brand-gold font-display font-bold text-lg">
            Shreeji Art
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {adminLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/10 hover:text-brand-gold transition-colors"
            >
              <span className="text-base">{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <Link
            href="/admin/profile"
            className="flex-1 text-sm text-gray-300 hover:text-white transition-colors"
          >
            Admin Profile
          </Link>
          <button className="text-xs text-gray-500 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
    </div>
  );
}
