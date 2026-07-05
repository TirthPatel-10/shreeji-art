"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";

interface CustomerRow {
  id: number;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  city?: string;
  state?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    adminApi
      .getCustomers()
      .then((res) => setCustomers((res.data as CustomerRow[]) ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.companyName ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <input
          type="search"
          placeholder="Search by name, email or company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold w-full sm:w-72"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white h-14 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">👥</p>
          <p className="font-medium">
            {search ? "No customers match your search." : "No customers yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Company</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">City</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {c.firstName} {c.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {c.companyName || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                    {c.city || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400">
            {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
            {search && ` matching "${search}"`}
          </div>
        </div>
      )}
    </div>
  );
}
