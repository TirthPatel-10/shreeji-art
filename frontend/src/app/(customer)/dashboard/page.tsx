"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { customerApi } from "@/lib/api";
import type { Project, Quote } from "@/types";

type DashboardStatus = "loading" | "ready" | "error";

const ACTIVE_QUOTE_STATUSES = ["PENDING", "DRAFT", "SENT"] as const;
const ACTIVE_PROJECT_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "QUALITY_CHECK",
  "INSTALLATION",
] as const;

const QUOTE_LABELS: Record<string, string> = {
  PENDING: "Pending Review",
  DRAFT: "Draft",
  SENT: "Quote Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

const PROJECT_LABELS: Record<string, string> = {
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  QUALITY_CHECK: "Quality Check",
  INSTALLATION: "Installation",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function CustomerDashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  const loadDashboard = useCallback(() => {
    setStatus("loading");
    setErrorMsg("");

    Promise.all([customerApi.getMyQuotes(), customerApi.getMyProjects()])
      .then(([quoteResponse, projectResponse]) => {
        if (!quoteResponse.success || !projectResponse.success) {
          throw new Error(
            quoteResponse.message ||
              projectResponse.message ||
              "Unable to load dashboard data."
          );
        }

        setQuotes((quoteResponse.data as Quote[]) ?? []);
        setProjects((projectResponse.data as Project[]) ?? []);
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("error");
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Unable to load your customer dashboard."
        );
      });
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const activeQuotes = quotes.filter((quote) =>
    ACTIVE_QUOTE_STATUSES.includes(
      quote.status as (typeof ACTIVE_QUOTE_STATUSES)[number]
    )
  ).length;

  const activeProjects = projects.filter((project) =>
    ACTIVE_PROJECT_STATUSES.includes(
      project.status as (typeof ACTIVE_PROJECT_STATUSES)[number]
    )
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  const recentQuotes = useMemo(
    () =>
      [...quotes]
        .sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt))
        .slice(0, 4),
    [quotes]
  );

  const latestProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt))
        .slice(0, 4),
    [projects]
  );

  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  if (status === "error") {
    return (
      <section className="rounded-[2rem] border border-red-200 bg-white p-8 text-center shadow-sa-xl sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="h-8 w-8" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-brand-navy">
          Could not load dashboard
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
          {errorMsg || "Please retry. Your customer data was not changed."}
        </p>
        <button
          type="button"
          onClick={loadDashboard}
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-navy shadow-sa-md transition-all hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Retry
        </button>
      </section>
    );
  }

  const hasAnyActivity = quotes.length > 0 || projects.length > 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-navy p-6 text-white shadow-sa-xl sm:p-8 lg:p-10">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(212,160,23,0.22),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]"
          aria-hidden="true"
        />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
              Customer Dashboard
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Your signage workroom
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/64 sm:text-base">
              Track quote requests, project progress, and next steps for your
              Shreeji Art signage projects.
            </p>
          </div>
          <Link
            href="/quote"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy shadow-[0_20px_45px_rgba(212,160,23,0.25)] transition-all hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy motion-reduce:transition-none"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Request a Quote
          </Link>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <MetricCard
          title="Active Quotes"
          value={activeQuotes}
          href="/quotes"
          icon={FileText}
          description="Requests currently under review or proposal."
        />
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          href="/projects"
          icon={FolderKanban}
          description="Projects moving through planning, production, or installation."
        />
        <MetricCard
          title="Completed Projects"
          value={completedProjects}
          href="/projects"
          icon={CheckCircle2}
          description="Finished signage work recorded in your portal."
        />
      </section>

      {!hasAnyActivity ? (
        <EmptyDashboard />
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          <ActivityPanel
            title="Recent quote activity"
            href="/quotes"
            emptyTitle="No quotes yet"
            emptyText="Submit a quote request and your latest quote activity will appear here."
          >
            {recentQuotes.map((quote) => (
              <ActivityItem
                key={quote.id}
                title={quote.title}
                reference={quote.referenceNo}
                description={quote.description}
                date={quote.createdAt}
                status={quote.status}
                statusLabel={QUOTE_LABELS[quote.status] ?? quote.status}
                href="/quotes"
              />
            ))}
          </ActivityPanel>

          <ActivityPanel
            title="Latest project activity"
            href="/projects"
            emptyTitle="No projects yet"
            emptyText="When a project starts, progress updates will appear here."
          >
            {latestProjects.map((project) => (
              <ActivityItem
                key={project.id}
                title={project.title}
                reference={project.referenceNo}
                description={project.description}
                date={project.createdAt}
                status={project.status}
                statusLabel={PROJECT_LABELS[project.status] ?? project.status}
                href="/projects"
              />
            ))}
          </ActivityPanel>
        </section>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  href,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  href: string;
  icon: ElementType;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-[1.75rem] border border-white bg-white p-6 shadow-sa-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-sa-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-navy">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <ArrowRight
          className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-brand-gold motion-reduce:transform-none"
          aria-hidden="true"
        />
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-gray-400">
        {title}
      </p>
      <p className="mt-2 font-display text-5xl font-semibold text-brand-navy">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-gray-500">{description}</p>
    </Link>
  );
}

function ActivityPanel({
  title,
  href,
  emptyTitle,
  emptyText,
  children,
}: {
  title: string;
  href: string;
  emptyTitle: string;
  emptyText: string;
  children: ReactNode;
}) {
  const hasChildren = Boolean(children) && Array.isArray(children)
    ? children.length > 0
    : Boolean(children);

  return (
    <section className="rounded-[2rem] border border-white bg-white p-6 shadow-sa-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-brand-navy">
          {title}
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {hasChildren ? (
        <div className="space-y-3">{children}</div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <p className="font-semibold text-brand-navy">{emptyTitle}</p>
          <p className="mt-2 text-sm leading-6 text-gray-500">{emptyText}</p>
        </div>
      )}
    </section>
  );
}

function ActivityItem({
  title,
  reference,
  description,
  date,
  status,
  statusLabel,
  href,
}: {
  title: string;
  reference: string;
  description?: string;
  date?: string;
  status: string;
  statusLabel: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-[1.4rem] border border-gray-100 bg-[#fbfaf6] p-4 transition-all duration-200 hover:border-brand-gold/35 hover:bg-white hover:shadow-sa-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate font-semibold text-brand-navy">{title}</p>
          <p className="mt-1 font-mono text-xs text-gray-400">{reference}</p>
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(status)}`}>
          {statusLabel}
        </span>
      </div>
      {description ? (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
          {description}
        </p>
      ) : null}
      {date ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-gray-400">
          <Clock3 className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
          {formatDate(date)}
        </p>
      ) : null}
    </Link>
  );
}

function EmptyDashboard() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-sa-xl">
      <div className="grid gap-0 lg:grid-cols-[1fr_0.85fr]">
        <div className="p-8 sm:p-10">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold">
            <Sparkles className="h-6 w-6" aria-hidden="true" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold text-brand-navy">
            Ready to start your first signage project?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Submit a quote request and our team will review your project details.
            Your quotes and projects will appear here once they are created.
          </p>
          <Link
            href="/quote"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy shadow-[0_18px_38px_rgba(212,160,23,0.22)] transition-all hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Request a Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="bg-brand-navy p-8 text-white sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
            What happens next
          </p>
          <div className="mt-6 space-y-4">
            {[
              "Tell us the sign type, location, and size.",
              "We review materials, lighting, and installation needs.",
              "Your quote and project updates appear in this portal.",
            ].map((item) => (
              <div key={item} className="flex gap-3 text-sm leading-6 text-white/70">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-label="Loading customer dashboard">
      <div className="h-56 animate-pulse rounded-[2rem] bg-brand-navy/90" />
      <div className="grid gap-5 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-[1.75rem] border border-white bg-white shadow-sa-lg"
          />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="h-96 animate-pulse rounded-[2rem] border border-white bg-white shadow-sa-xl"
          />
        ))}
      </div>
    </div>
  );
}

function dateValue(value?: string) {
  if (!value) return 0;
  const date = new Date(value).getTime();
  return Number.isNaN(date) ? 0 : date;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    DRAFT: "bg-gray-100 text-gray-700",
    SENT: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-orange-100 text-orange-800",
    PLANNED: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    QUALITY_CHECK: "bg-amber-100 text-amber-800",
    INSTALLATION: "bg-violet-100 text-violet-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return map[status] ?? "bg-gray-100 text-gray-700";
}
