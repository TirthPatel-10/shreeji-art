import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Dashboard" };

export default function CustomerDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Quotes" value="—" href="/quotes" />
        <StatCard label="Active Projects" value="—" href="/projects" />
        <StatCard label="Completed Projects" value="—" href="/projects" />
      </div>
      <p className="text-gray-400 text-sm">
        Your quotes and projects will appear here once created by our team.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-brand-navy">{value}</p>
    </Link>
  );
}
