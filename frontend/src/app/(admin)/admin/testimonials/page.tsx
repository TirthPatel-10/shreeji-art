import type { Metadata } from "next";

export const metadata: Metadata = { title: "Testimonials — Admin" };

export default function AdminTestimonialsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
        <button className="bg-brand-gold text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-gold-dark transition-colors">
          + Add Testimonial
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">⭐</p>
        <p className="font-medium">Testimonials load from API</p>
      </div>
    </div>
  );
}
