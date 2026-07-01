import Link from "next/link";

const portalLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/quotes", label: "My Quotes" },
  { href: "/projects", label: "My Projects" },
  { href: "/profile", label: "Profile" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-brand-navy text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="text-brand-gold font-display font-bold text-lg">
            Shreeji Art
          </Link>
          <p className="text-xs text-gray-400 mt-1">Customer Portal</p>
        </div>
        <nav className="flex-1 py-4 px-3 space-y-1">
          {portalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block px-3 py-2 rounded-lg text-sm hover:bg-white/10 hover:text-brand-gold transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button className="text-sm text-gray-400 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 max-w-5xl">{children}</main>
    </div>
  );
}
