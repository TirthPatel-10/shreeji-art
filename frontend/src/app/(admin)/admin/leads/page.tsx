import type { Metadata } from "next";

export const metadata: Metadata = { title: "Leads — Admin" };

export default function AdminLeadsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leads</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">📥</p>
        <p className="font-medium">Leads inbox loads from API</p>
        <p className="text-sm mt-1">New quote requests appear here. Implement GET /api/v1/leads.</p>
      </div>
    </div>
  );
}
