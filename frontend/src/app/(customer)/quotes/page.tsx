import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Quotes" };

export default function CustomerQuotesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">My Quotes</h1>
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
        <p className="text-4xl mb-3">📄</p>
        <p className="font-medium">No quotes yet</p>
        <p className="text-sm mt-1">
          Quotes sent to you by Shreeji Art will appear here.
        </p>
      </div>
    </div>
  );
}
