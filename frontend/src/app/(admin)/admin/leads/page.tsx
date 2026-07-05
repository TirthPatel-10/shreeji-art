"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { Lead, LeadStatus } from "@/types";

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
];
const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-yellow-100 text-yellow-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  QUALIFIED: "bg-purple-100 text-purple-700",
  CONVERTED: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    adminApi
      .getLeads()
      .then((res) => setLeads((res.data as Lead[]) ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      const res = await adminApi.updateLeadStatus(id, status);
      if (res.success && res.data) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? (res.data as Lead) : l))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Leads</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white h-16 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📥</p>
          <p className="font-medium">No leads yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Service</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">
                    <p>{l.name}</p>
                    <p className="text-xs text-gray-400">{l.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{l.email}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {l.serviceType || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden lg:table-cell">
                    {new Date(l.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={l.status}
                      disabled={updating === l.id}
                      onChange={(e) => updateStatus(l.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                        STATUS_COLORS[l.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
