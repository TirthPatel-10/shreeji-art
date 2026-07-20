"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { Quote, QuoteStatus } from "@/types";

const STATUS_OPTIONS: QuoteStatus[] = [
  "PENDING",
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  DRAFT: "bg-gray-100 text-gray-600",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-orange-100 text-orange-600",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Review",
  DRAFT: "Under Review",
  SENT: "Quote Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);

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

  function toggleExpand(id: number) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quote Management</h1>
        <span className="text-sm text-gray-400">{quotes.length} total</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-white h-16 rounded-xl animate-pulse border border-gray-100"
            />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📄</p>
          <p className="font-medium">No quote requests yet</p>
          <p className="text-sm mt-1">
            Customer-submitted quote requests will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left w-8" />
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  Service
                </th>
                <th className="px-4 py-3 text-left hidden xl:table-cell">
                  Company
                </th>
                <th className="px-4 py-3 text-left hidden md:table-cell">
                  Submitted
                </th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const isExpanded = expanded === q.id;
                const serviceLabel = q.title?.replace(
                  / — Quote Request$/,
                  ""
                );
                return (
                  <>
                    <tr
                      key={q.id}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Expand toggle */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleExpand(q.id)}
                          className="w-6 h-6 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                          title={isExpanded ? "Collapse" : "Expand details"}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`transition-transform duration-150 ${isExpanded ? "rotate-90" : ""}`}
                          >
                            <path
                              d="M4 2l4 4-4 4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </td>

                      {/* Reference */}
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono whitespace-nowrap">
                        {q.referenceNo}
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 leading-tight">
                          {q.customerName ?? "—"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {q.customerEmail ?? ""}
                        </p>
                        {q.customerPhone && (
                          <p className="text-xs text-gray-400">
                            {q.customerPhone}
                          </p>
                        )}
                      </td>

                      {/* Service */}
                      <td className="px-4 py-3 text-gray-700 hidden lg:table-cell">
                        {serviceLabel ?? "—"}
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3 text-gray-500 text-sm hidden xl:table-cell">
                        {q.companyName ?? "—"}
                      </td>

                      {/* Submitted */}
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap hidden md:table-cell">
                        {q.createdAt
                          ? new Date(q.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <select
                          value={q.status}
                          disabled={updating === q.id}
                          onChange={(e) => updateStatus(q.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold disabled:opacity-50 ${
                            STATUS_COLORS[q.status] ??
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABELS[s] ?? s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr
                        key={`${q.id}-detail`}
                        className="bg-blue-50/40 border-b border-blue-100"
                      >
                        <td />
                        <td colSpan={6} className="px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {/* Left: project details */}
                            <div>
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                Project Details
                              </p>
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {q.description ?? (
                                  <span className="text-gray-400 italic">
                                    No details provided.
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Right: customer info */}
                            <div className="space-y-2">
                              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                                Customer Info
                              </p>
                              <InfoRow label="Name" value={q.customerName} />
                              <InfoRow label="Email" value={q.customerEmail} />
                              <InfoRow label="Phone" value={q.customerPhone} />
                              <InfoRow
                                label="Company"
                                value={q.companyName}
                              />
                              <InfoRow
                                label="Service"
                                value={serviceLabel}
                              />
                              <InfoRow
                                label="Ref No"
                                value={q.referenceNo}
                                mono
                              />
                              <InfoRow
                                label="Amount"
                                value={
                                  q.totalAmount != null
                                    ? `₹${Number(q.totalAmount).toLocaleString("en-IN")}`
                                    : undefined
                                }
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono,
}: {
  label: string;
  value?: string | null;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-400 w-20 flex-shrink-0">{label}</span>
      <span
        className={`text-gray-700 break-all ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
