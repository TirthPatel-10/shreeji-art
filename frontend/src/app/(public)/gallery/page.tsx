import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse Shreeji Art's gallery of signage work across Ahmedabad.",
};

export default function GalleryPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Gallery
      </h1>
      <p className="text-center text-gray-500 mb-12">
        Browse our work — filter by signage type
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center text-gray-400 text-xs"
          >
            Image {i + 1}
          </div>
        ))}
      </div>
    </main>
  );
}
