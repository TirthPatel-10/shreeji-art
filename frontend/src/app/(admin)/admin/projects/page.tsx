"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { Project } from "@/types";

type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED"
  | "ON_HOLD"
  | "CANCELLED";

const STATUS_OPTIONS: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "REVIEW",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
];
const STATUS_COLORS: Record<string, string> = {
  PLANNING: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  REVIEW: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  ON_HOLD: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    adminApi
      .getProjects()
      .then((res) => setProjects((res.data as Project[]) ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    try {
      const res = await adminApi.updateProjectStatus(id, status);
      if (res.success && res.data) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? (res.data as Project) : p))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Projects</h1>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white h-16 rounded-xl animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <p className="text-4xl mb-3">🏗️</p>
          <p className="font-medium">No projects yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Start</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Est. Completion</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                    {p.referenceNo}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {p.title}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                    {p.startDate
                      ? new Date(p.startDate).toLocaleDateString("en-IN")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                    {p.estimatedCompletion
                      ? new Date(p.estimatedCompletion).toLocaleDateString(
                          "en-IN"
                        )
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={p.status}
                      disabled={updating === p.id}
                      onChange={(e) => updateStatus(p.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                        STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-600"
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
