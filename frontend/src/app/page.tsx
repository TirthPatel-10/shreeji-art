import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-navy text-white py-24 px-6 text-center">
        <p className="text-brand-gold uppercase tracking-widest text-sm font-semibold mb-4">
          Ahmedabad&apos;s Premier Signage Partner
        </p>
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
          Crafting Signs That <br />
          <span className="text-brand-gold">Speak for Your Brand</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
          From LED signs and acrylic letters to full office branding — Shreeji Art
          manufactures and installs premium signage across Ahmedabad and Gujarat.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/quote"
            className="bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Request a Quote
          </Link>
          <Link
            href="/portfolio"
            className="border border-white hover:bg-white hover:text-brand-navy text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            View Our Work
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center text-brand-navy mb-2">
            Our Services
          </h2>
          <p className="text-center text-gray-500 mb-12">
            End-to-end signage manufacturing and installation
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center group"
              >
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-semibold text-brand-navy group-hover:text-brand-gold transition-colors text-sm">
                  {s.name}
                </h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/services"
              className="text-brand-gold font-semibold hover:underline"
            >
              See all services →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-display font-bold text-brand-navy mb-12">
            Why Choose Shreeji Art?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {highlights.map((h) => (
              <div key={h.title} className="flex flex-col items-center">
                <div className="text-4xl mb-4">{h.icon}</div>
                <h3 className="font-bold text-brand-navy mb-2">{h.title}</h3>
                <p className="text-gray-500 text-sm">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-gold py-16 px-6 text-white text-center">
        <h2 className="text-3xl font-display font-bold mb-4">
          Ready to Transform Your Space?
        </h2>
        <p className="mb-8 text-white/90">
          Get a free consultation and quote within 24 hours.
        </p>
        <Link
          href="/quote"
          className="bg-white text-brand-gold font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Get Free Quote
        </Link>
      </section>
    </main>
  );
}

const services = [
  { name: "LED Signs", slug: "led-signs", icon: "💡" },
  { name: "Acrylic Signs", slug: "acrylic-signs", icon: "🔷" },
  { name: "3D Letter Signs", slug: "3d-letter-signs", icon: "🅰️" },
  { name: "ACP Signage", slug: "acp-signage", icon: "🏢" },
  { name: "SS Signage", slug: "stainless-steel-signage", icon: "⚙️" },
  { name: "Glow Sign Boards", slug: "glow-sign-boards", icon: "✨" },
  { name: "Office Branding", slug: "office-branding", icon: "🏬" },
  { name: "Wayfinding Signs", slug: "wayfinding-signs", icon: "🗺️" },
];

const highlights = [
  {
    icon: "🏆",
    title: "10+ Years Experience",
    desc: "Trusted by hundreds of businesses across Ahmedabad and Gujarat.",
  },
  {
    icon: "⚡",
    title: "Fast Turnaround",
    desc: "Most projects delivered within 5–10 working days.",
  },
  {
    icon: "🎨",
    title: "In-House Design",
    desc: "Our designers work with you to get the look exactly right.",
  },
];
