import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

const stats = [
  { label: "Total Customers", value: "—", color: "text-blue-600" },
  { label: "Open Leads", value: "—", color: "text-yellow-600" },
  { label: "Active Quotes", value: "—", color: "text-purple-600" },
  { label: "Active Projects", value: "—", color: "text-green-600" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Recent Leads</h2>
          <p className="text-gray-400 text-sm">No leads yet — data loads from API.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Recent Projects</h2>
          <p className="text-gray-400 text-sm">No projects yet — data loads from API.</p>
        </div>
      </div>
    </div>
  );
}
