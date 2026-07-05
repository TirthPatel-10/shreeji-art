"use client";

import { useState, useEffect } from "react";
import { customerApi } from "@/lib/api";
import type { Project } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  PLANNING: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  REVIEW: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
  ON_HOLD: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  REVIEW: "Under Review",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export default function CustomerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi
      .getMyProjects()
      .then((res) => setProjects((res.data as Project[]) ?? []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-brand-navy mb-6">My Projects</h1>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 h-24 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-navy mb-6">My Projects</h1>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400 shadow-sm">
          <p className="text-4xl mb-3">🏗️</p>
          <p className="font-medium">No active projects</p>
          <p className="text-sm mt-1">
            Your ongoing and completed projects will be tracked here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {projects.map((p) => (
            <div key={p.id} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-brand-navy truncate">{p.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{p.referenceNo}</p>
                  {p.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    {p.startDate && (
                      <span>
                        Started: {new Date(p.startDate).toLocaleDateString("en-IN")}
                      </span>
                    )}
                    {p.estimatedCompletion && (
                      <span>
                        Est.:{" "}
                        {new Date(p.estimatedCompletion).toLocaleDateString(
                          "en-IN"
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                    STATUS_COLORS[p.status] ?? "bg-gray-100 text-gray-600"
                  }`}
                >
                  {STATUS_LABELS[p.status] ?? p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
