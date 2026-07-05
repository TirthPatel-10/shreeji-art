"use client";

import { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";
import type { Quote } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-orange-100 text-orange-700",
};

export default function CustomerQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi
      .getMyQuotes()
      .then((res) => setQuotes((res.data as Quote[]) ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-brand-navy mb-6">My Quotes</h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 h-20 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">My Quotes</h1>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
          <p className="text-4xl mb-3">📄</p>
          <p className="font-medium">No quotes yet</p>
          <p className="text-sm mt-1">
            Quotes sent to you by Shreeji Art will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {quotes.map((q) => (
            <div key={q.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-navy truncate">{q.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{q.referenceNo}</p>
                  {q.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {q.description}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      STATUS_COLORS[q.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {q.status}
                  </span>
                  {q.totalAmount != null && (
                    <p className="text-sm font-semibold text-brand-navy mt-1">
                      ₹{Number(q.totalAmount).toLocaleString("en-IN")}
                    </p>
                  )}
                  {q.validUntil && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Valid until{" "}
                      {new Date(q.validUntil).toLocaleDateString("en-IN")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
