import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import type { PortfolioItem } from "@/types";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "View Shreeji Art's portfolio of completed signage and branding projects.",
};

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  try {
    const res = await publicApi.getPortfolio();
    items = (res.data as PortfolioItem[]) ?? [];
  } catch { /* render empty state */ }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Our Portfolio
      </h1>
      <p className="text-center text-gray-500 mb-12">
        A showcase of our completed signage and branding projects
      </p>

      {items.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center text-gray-400 text-sm"
            >
              Portfolio items loading…
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-gray-100 aspect-video flex items-center justify-center text-gray-400 text-sm">
                {item.title}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-brand-navy">{item.title}</h3>
                {item.clientName && (
                  <p className="text-sm text-gray-400 mt-1">{item.clientName}</p>
                )}
                {item.description && (
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
