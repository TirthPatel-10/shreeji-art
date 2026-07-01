import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Shreeji Art's signage services: LED signs, acrylic, 3D letters, ACP, SS signage, office branding and more.",
};

const services = [
  {
    name: "LED Signs",
    slug: "led-signs",
    icon: "💡",
    desc: "Energy-efficient LED signage for storefronts, malls, and commercial spaces.",
  },
  {
    name: "Acrylic Signs",
    slug: "acrylic-signs",
    icon: "🔷",
    desc: "Premium acrylic cut letters and backlit acrylic signage.",
  },
  {
    name: "3D Letter Signs",
    slug: "3d-letter-signs",
    icon: "🅰️",
    desc: "Stainless steel, brass, and chrome 3D letter signs for a bold brand presence.",
  },
  {
    name: "ACP Signage",
    slug: "acp-signage",
    icon: "🏢",
    desc: "Aluminium composite panel boards for facades, hoardings, and name plates.",
  },
  {
    name: "SS Signage",
    slug: "stainless-steel-signage",
    icon: "⚙️",
    desc: "Stainless steel cut-out letters and panels for premium exterior signage.",
  },
  {
    name: "Glow Sign Boards",
    slug: "glow-sign-boards",
    icon: "✨",
    desc: "Illuminated flex and LED glow boards for maximum night-time visibility.",
  },
  {
    name: "Wayfinding Signs",
    slug: "wayfinding-signs",
    icon: "🗺️",
    desc: "Directional and wayfinding signage systems for malls, hospitals, and campuses.",
  },
  {
    name: "Office Branding",
    slug: "office-branding",
    icon: "🏬",
    desc: "Complete interior office branding — logo walls, cabin plates, reception signs.",
  },
  {
    name: "Retail Branding",
    slug: "retail-branding",
    icon: "🛍️",
    desc: "Shop-front signage, display boards, and in-store visual branding.",
  },
  {
    name: "Industrial Signage",
    slug: "industrial-signage",
    icon: "🏭",
    desc: "Safety signs, plant name boards, and industrial identification signage.",
  },
  {
    name: "Custom Fabrication",
    slug: "custom-fabrication",
    icon: "🔧",
    desc: "Bespoke fabrication for unique shapes, materials, and installation requirements.",
  },
];

export default function ServicesPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Our Services
      </h1>
      <p className="text-center text-gray-500 mb-12">
        End-to-end signage manufacturing and installation across Gujarat
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-brand-gold transition-all group"
          >
            <div className="text-4xl mb-4">{s.icon}</div>
            <h2 className="font-bold text-brand-navy group-hover:text-brand-gold transition-colors mb-2">
              {s.name}
            </h2>
            <p className="text-gray-500 text-sm">{s.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
