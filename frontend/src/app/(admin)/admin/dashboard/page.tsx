"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { Lead, Project } from "@/types";

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    customers: 0,
    leads: 0,
    quotes: 0,
    projects: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getCustomers(),
      adminApi.getLeads(),
      adminApi.getQuotes(),
      adminApi.getProjects(),
    ]).then(([cRes, lRes, qRes, pRes]) => {
      const leads = (lRes.data as Lead[]) ?? [];
      const projects = (pRes.data as Project[]) ?? [];
      setCounts({
        customers: ((cRes.data as unknown[]) ?? []).length,
        leads: leads.filter((l) => l.status === "NEW").length,
        quotes: ((qRes.data as unknown[]) ?? []).length,
        projects: projects.filter(
          (p) => !["COMPLETED", "CANCELLED"].includes(p.status)
        ).length,
      });
      setRecentLeads(leads.slice(0, 5));
      setRecentProjects(projects.slice(0, 5));
      setLoading(false);
    });
  }, []);

  const stats = [
    { label: "Total Customers", value: counts.customers, color: "text-blue-600" },
    { label: "New Leads", value: counts.leads, color: "text-yellow-600" },
    { label: "Quotes", value: counts.quotes, color: "text-purple-600" },
    {
      label: "Active Projects",
      value: counts.projects,
      color: "text-green-600",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">
              {s.label}
            </p>
            <p className={`text-3xl font-bold ${s.color}`}>
              {loading ? "…" : s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Recent Leads</h2>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : recentLeads.length === 0 ? (
            <p className="text-gray-400 text-sm">No leads yet.</p>
          ) : (
            <div className="space-y-2">
              {recentLeads.map((l) => (
                <div key={l.id} className="flex justify-between text-sm">
                  <span className="text-gray-700 truncate">{l.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${
                      l.status === "NEW"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Recent Projects</h2>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          ) : recentProjects.length === 0 ? (
            <p className="text-gray-400 text-sm">No projects yet.</p>
          ) : (
            <div className="space-y-2">
              {recentProjects.map((p) => (
                <div key={p.id} className="flex justify-between text-sm">
                  <span className="text-gray-700 truncate">{p.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex-shrink-0 ml-2">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
