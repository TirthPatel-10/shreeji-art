"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";
import type { Quote, Project } from "@/types";

export default function CustomerDashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([customerApi.getMyQuotes(), customerApi.getMyProjects()])
      .then(([qRes, pRes]) => {
        setQuotes((qRes.data as Quote[]) ?? []);
        setProjects((pRes.data as Project[]) ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeQuotes = quotes.filter((q) =>
    ["PENDING", "DRAFT", "SENT"].includes(q.status)
  ).length;
  const activeProjects = projects.filter((p) =>
    !["COMPLETED", "CANCELLED"].includes(p.status)
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Active Quotes"
          value={loading ? "…" : String(activeQuotes)}
          href="/quotes"
        />
        <StatCard
          label="Active Projects"
          value={loading ? "…" : String(activeProjects)}
          href="/projects"
        />
        <StatCard
          label="Completed Projects"
          value={loading ? "…" : String(completedProjects)}
          href="/projects"
        />
      </div>

      {!loading && quotes.length === 0 && projects.length === 0 && (
        <div className="bg-brand-navy rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-white font-semibold text-lg mb-1">Need new signage?</p>
            <p className="text-gray-400 text-sm max-w-sm">
              Submit a quote request and our team will prepare a detailed proposal within 24 hours.
            </p>
          </div>
          <Link
            href="/quotes/new"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-gold text-white font-semibold text-sm hover:bg-brand-gold/90 transition-colors"
          >
            Request a Quote
          </Link>
        </div>
      )}

      {!loading && quotes.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-brand-navy">Recent Quotes</h2>
            <Link
              href="/quotes/new"
              className="text-xs font-semibold text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              + Request a Quote
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
            {quotes.slice(0, 3).map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-brand-navy">{q.title}</p>
                  <p className="text-xs text-gray-400">{q.referenceNo}</p>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor(q.status)}`}
                >
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
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

function statusColor(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    DRAFT: "bg-gray-100 text-gray-600",
    SENT: "bg-blue-100 text-blue-700",
    ACCEPTED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    EXPIRED: "bg-orange-100 text-orange-700",
  };
  return map[status] ?? "bg-gray-100 text-gray-600";
}
