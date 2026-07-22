"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";
import type { Quote } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  DRAFT: "bg-gray-100 text-gray-600",
  SENT: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  EXPIRED: "bg-orange-100 text-orange-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending Review",
  DRAFT: "Draft",
  SENT: "Quote Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-brand-navy">My Quotes</h1>
        </div>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-navy">My Quotes</h1>
        <Link
          href="/quote"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-gold text-white font-semibold text-sm hover:bg-brand-gold/90 transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Request a Quote
        </Link>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center shadow-sm">
          <p className="text-4xl mb-4">📄</p>
          <p className="font-semibold text-brand-navy mb-1">No quotes yet</p>
          <p className="text-sm text-gray-400 mb-6">
            Submit a quote request and we&apos;ll prepare a detailed proposal for your signage project.
          </p>
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-gold text-white font-semibold text-sm hover:bg-brand-gold/90 transition-colors"
          >
            Request your first quote
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {quotes.map((q) => (
            <div key={q.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-navy truncate">{q.title}</p>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{q.referenceNo}</p>
                  {q.description && (
                    <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">
                      {q.description}
                    </p>
                  )}
                  {q.createdAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Submitted {new Date(q.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0 space-y-1">
                  <span
                    className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      STATUS_COLORS[q.status] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {STATUS_LABELS[q.status] ?? q.status}
                  </span>
                  {q.totalAmount != null && (
                    <p className="text-sm font-semibold text-brand-navy">
                      ₹{Number(q.totalAmount).toLocaleString("en-IN")}
                    </p>
                  )}
                  {q.validUntil && (
                    <p className="text-xs text-gray-400">
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
