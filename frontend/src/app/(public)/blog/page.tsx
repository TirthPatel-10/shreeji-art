import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read Shreeji Art's blog — signage tips, industry news, and branding insights.",
};

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Blog
      </h1>
      <p className="text-center text-gray-500 mb-12">
        Signage tips, industry news, and branding insights
      </p>
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
            <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-full mb-1" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
          </div>
        ))}
      </div>
    </main>
  );
}
