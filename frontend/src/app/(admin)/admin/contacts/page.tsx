"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { ContactRequest } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-yellow-100 text-yellow-700",
  READ: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
};

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    adminApi
      .getContactRequests()
      .then((res) => setContacts((res.data as ContactRequest[]) ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Requests</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white h-16 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">📬</p>
          <p className="font-medium">No contact requests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                onClick={() =>
                  setExpanded((prev) => (prev === c.id ? null : c.id))
                }
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {c.name} — {c.subject}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {c.email}
                    {c.phone ? ` · ${c.phone}` : ""}
                    {" · "}
                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ml-4 flex-shrink-0 ${
                    STATUS_COLORS[c.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {c.status}
                </span>
              </button>
              {expanded === c.id && (
                <div className="px-5 pb-4 border-t border-gray-50">
                  <p className="text-sm text-gray-600 mt-3 whitespace-pre-line">
                    {c.message}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={`mailto:${c.email}`}
                      className="text-xs text-brand-gold hover:underline"
                    >
                      Reply via email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
