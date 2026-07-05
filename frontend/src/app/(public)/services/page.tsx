import type { Metadata } from "next";
import Link from "next/link";
import { publicApi } from "@/lib/api";
import type { Service } from "@/types";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Shreeji Art's signage services: LED signs, acrylic, 3D letters, ACP, SS signage, office branding and more.",
};

export default async function ServicesPage() {
  let services: Service[] = [];
  try {
    const res = await publicApi.getServices();
    services = (res.data as Service[]) ?? [];
  } catch {
    /* render empty state on fetch failure */
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Our Services
      </h1>
      <p className="text-center text-gray-500 mb-12">
        End-to-end signage manufacturing and installation across Gujarat
      </p>

      {services.length === 0 ? (
        <p className="text-center text-gray-400">Services loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-brand-gold transition-all group"
            >
              <h2 className="font-bold text-brand-navy group-hover:text-brand-gold transition-colors mb-2">
                {s.name}
              </h2>
              <p className="text-gray-500 text-sm">{s.shortDescription}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
