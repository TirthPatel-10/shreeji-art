"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Inbox,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { adminApi, apiErrorMessage, caughtApiErrorMessage } from "@/lib/api";
import type { Lead, LeadStatus } from "@/types";

const STATUS_OPTIONS: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
];

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New Inquiry",
  CONTACTED: "Contacted",
  QUALIFIED: "Quotation Prepared",
  CONVERTED: "Converted to Quote",
  LOST: "Rejected / Closed",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "bg-yellow-100 text-yellow-800",
  CONTACTED: "bg-blue-100 text-blue-800",
  QUALIFIED: "bg-purple-100 text-purple-800",
  CONVERTED: "bg-emerald-100 text-emerald-800",
  LOST: "bg-red-100 text-red-800",
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const sortedLeads = useMemo(
    () =>
      [...leads].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [leads]
  );

  const loadInquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminApi.getLeads();
      if (!res.success) {
        setError(apiErrorMessage(res, "Could not load inquiries."));
        setLeads([]);
        return;
      }
      setLeads((res.data as Lead[]) ?? []);
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while loading inquiries."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInquiries();
  }, [loadInquiries]);

  async function updateStatus(id: number, status: LeadStatus) {
    setUpdating(id);
    setError("");
    setNotice("");
    try {
      const res = await adminApi.updateLeadStatus(id, status);
      if (!res.success || !res.data) {
        setError(apiErrorMessage(res, "Could not update inquiry status."));
        return;
      }
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? (res.data as Lead) : lead))
      );
      setNotice(`Inquiry status updated to ${STATUS_LABELS[status]}.`);
    } catch (error) {
      setError(caughtApiErrorMessage(error, "Connection error while updating inquiry status."));
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white bg-white p-5 shadow-sa-lg sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
              Inquiry Management
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-brand-navy">
              Inquiries
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review customer inquiries from public quote and contact forms.
            </p>
          </div>
          <button
            type="button"
            onClick={loadInquiries}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 px-5 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            Retry / Refresh
          </button>
        </div>
      </section>

      {notice ? (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="space-y-3" aria-label="Loading inquiries">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl border border-gray-100 bg-white" />
          ))}
        </div>
      ) : sortedLeads.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
          <Inbox className="mx-auto h-10 w-10 text-brand-gold" aria-hidden="true" />
          <h3 className="mt-4 font-display text-2xl font-semibold text-brand-navy">
            No inquiries yet
          </h3>
          <p className="mt-2 text-sm">
            New customer inquiries will appear here as soon as they are submitted.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-sa-lg">
          <div className="hidden grid-cols-[1.2fr_1.2fr_1fr_0.8fr_1fr_48px] gap-4 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 lg:grid">
            <span>Name</span>
            <span>Email</span>
            <span>Service</span>
            <span>Date</span>
            <span>Inquiry Status</span>
            <span className="sr-only">Details</span>
          </div>

          <div className="divide-y divide-gray-100">
            {sortedLeads.map((lead) => {
              const expanded = expandedId === lead.id;
              return (
                <article key={lead.id} className="transition-colors hover:bg-gray-50/60">
                  <div className="grid gap-4 px-5 py-4 lg:grid-cols-[1.2fr_1.2fr_1fr_0.8fr_1fr_48px] lg:items-center">
                    <div>
                      <p className="font-semibold text-brand-navy">{lead.name}</p>
                      <p className="mt-1 text-xs text-gray-400">{lead.phone || "No phone"}</p>
                    </div>
                    <p className="break-words text-sm text-gray-600">{lead.email}</p>
                    <p className="text-sm text-gray-500">{lead.serviceType || "Not specified"}</p>
                    <p className="text-xs text-gray-400">{formatDate(lead.createdAt)}</p>
                    <select
                      value={lead.status}
                      disabled={updating === lead.id}
                      onChange={(event) => updateStatus(lead.id, event.target.value as LeadStatus)}
                      aria-label={`Update status for ${lead.name}`}
                      className={`w-full rounded-full border-0 px-3 py-2 text-xs font-bold outline-none transition focus:ring-2 focus:ring-brand-gold disabled:cursor-not-allowed disabled:opacity-60 lg:w-auto ${
                        STATUS_COLORS[lead.status] ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : lead.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-gold/50 hover:text-brand-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                      aria-expanded={expanded}
                      aria-label={`${expanded ? "Hide" : "Show"} inquiry details for ${lead.name}`}
                    >
                      {expanded ? (
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>

                  {expanded ? (
                    <div className="border-t border-gray-100 bg-[#fbfaf6] px-5 py-5">
                      <div className="grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-3">
                        <Detail label="Name" value={lead.name} />
                        <Detail label="Email" value={lead.email} />
                        <Detail label="Phone" value={lead.phone} />
                        <Detail label="Company" value={lead.company} />
                        <Detail label="Service" value={lead.serviceType} />
                        <Detail label="Source" value={lead.source} />
                        <Detail label="Submission Date" value={formatDateTime(lead.createdAt)} />
                        <Detail label="Status" value={STATUS_LABELS[lead.status]} />
                      </div>
                      <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                          Message
                        </p>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                          {lead.message || "No message provided."}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          disabled
                          title="True inquiry-to-quote conversion will be added in a later phase."
                          className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-400"
                        >
                          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          Convert Inquiry — coming later
                        </button>
                        {updating === lead.id ? (
                          <span className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            Saving status...
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
        {label}
      </p>
      <p className="mt-2 break-words font-medium text-brand-navy">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
