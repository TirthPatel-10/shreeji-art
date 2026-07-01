import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Request a free signage quote from Shreeji Art, Ahmedabad.",
};

const serviceTypes = [
  "LED Signs",
  "Acrylic Signs",
  "3D Letter Signs",
  "ACP Signage",
  "Stainless Steel Signage",
  "Glow Sign Boards",
  "Wayfinding Signs",
  "Office Branding",
  "Retail Branding",
  "Industrial Signage",
  "Custom Fabrication",
  "Other",
];

export default function QuotePage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-2 text-center">
        Request a Free Quote
      </h1>
      <p className="text-center text-gray-500 mb-10">
        Fill in your details and we&apos;ll get back to you within 24 hours
      </p>

      <form className="space-y-5 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input
            type="email"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type *
          </label>
          <select
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold bg-white"
          >
            <option value="">Select a service</option>
            {serviceTypes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Details *
          </label>
          <textarea
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
            placeholder="Describe your signage requirements — size, location, quantity, material preferences..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-bold py-3 rounded-lg transition-colors"
        >
          Submit Quote Request
        </button>
        <p className="text-xs text-gray-400 text-center">
          We&apos;ll respond within 24 hours on business days.
        </p>
      </form>
    </main>
  );
}
