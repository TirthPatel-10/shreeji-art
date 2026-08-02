"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, apiErrorMessage, caughtApiErrorMessage } from "@/lib/api";
import type { Project, ProjectStatus } from "@/types";

const STATUS_OPTIONS: ProjectStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "QUALITY_CHECK",
  "INSTALLATION",
  "COMPLETED",
  "CANCELLED",
];
const STATUS_LABELS: Record<ProjectStatus, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  QUALITY_CHECK: "Quality Check",
  INSTALLATION: "Installation",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
const STATUS_COLORS: Record<string, string> = {
  PLANNED: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  QUALITY_CHECK: "bg-yellow-100 text-yellow-700",
  INSTALLATION: "bg-violet-100 text-violet-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getProjects();
      if (!res.success) {
        setError(apiErrorMessage(res, "Could not load projects."));
        setProjects([]);
        return;
      }
      setProjects((res.data as Project[]) ?? []);
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while loading projects."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function updateStatus(id: number, status: ProjectStatus) {
    setUpdating(id);
    setError("");
    setNotice("");
    try {
      const res = await adminApi.updateProjectStatus(id, status);
      if (!res.success || !res.data) {
        setError(apiErrorMessage(res, "Could not update project status."));
        return;
      }
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? (res.data as Project) : p))
      );
      setNotice(`Project status updated to ${STATUS_LABELS[status]}.`);
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while updating project status."));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button
          type="button"
          onClick={loadProjects}
          disabled={loading}
          className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Retry / Refresh
        </button>
      </div>

      {notice ? (
        <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      ) : null}

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
                      onChange={(e) => updateStatus(p.id, e.target.value as ProjectStatus)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                        STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
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
