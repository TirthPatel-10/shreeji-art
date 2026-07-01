import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "View Shreeji Art's portfolio of completed signage and branding projects.",
};

export default function PortfolioPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Our Portfolio
      </h1>
      <p className="text-center text-gray-500 mb-12">
        A showcase of our completed signage and branding projects
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center text-gray-400 text-sm"
          >
            Portfolio item {i + 1} — loaded from API
          </div>
        ))}
      </div>
    </main>
  );
}
