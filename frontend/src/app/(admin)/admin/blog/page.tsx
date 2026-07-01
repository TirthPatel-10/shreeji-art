import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog — Admin" };

export default function AdminBlogPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        <button className="bg-brand-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors">
          + New Post
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">✍️</p>
        <p className="font-medium">Blog posts load from API</p>
      </div>
    </div>
  );
}
