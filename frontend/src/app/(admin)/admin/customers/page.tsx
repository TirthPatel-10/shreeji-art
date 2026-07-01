import type { Metadata } from "next";

export const metadata: Metadata = { title: "Customers — Admin" };

export default function AdminCustomersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Customers</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
        <p className="text-4xl mb-3">👥</p>
        <p className="font-medium">Customer list loads from API</p>
        <p className="text-sm mt-1">Implement GET /api/v1/customers to populate this table.</p>
      </div>
    </div>
  );
}
