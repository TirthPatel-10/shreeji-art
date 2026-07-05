"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { Quote, QuoteStatus } from "@/types";

const STATUS_OPTIONS: QuoteStatus[] = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
];
const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-orange-100 text-orange-700",
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    adminApi
      .getQuotes()
      .then((res) => setQuotes((res.data as Quote[]) ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      const res = await adminApi.updateQuoteStatus(id, status);
      if (res.success && res.data) {
        setQuotes((prev) =>
          prev.map((q) => (q.id === id ? (res.data as Quote) : q))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quotes</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white h-16 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📄</p>
          <p className="font-medium">No quotes yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Amount</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Valid Until</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {quotes.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                    {q.referenceNo}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {q.title}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700 hidden md:table-cell">
                    {q.totalAmount != null
                      ? `₹${Number(q.totalAmount).toLocaleString("en-IN")}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {q.validUntil
                      ? new Date(q.validUntil).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={q.status}
                      disabled={updating === q.id}
                      onChange={(e) => updateStatus(q.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                        STATUS_COLORS[q.status] ?? "bg-gray-100 text-gray-600"
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
