import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact Requests — Admin" };

export default function AdminContactsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Requests</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">📬</p>
        <p className="font-medium">Contact form submissions appear here</p>
        <p className="text-sm mt-1">Implement GET /api/v1/contact to view messages.</p>
      </div>
    </div>
  );
}
