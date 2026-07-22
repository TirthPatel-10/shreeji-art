"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  FolderKanban,
  Inbox,
  MessageSquareQuote,
  RefreshCw,
  UsersRound,
} from "lucide-react";
import { adminApi } from "@/lib/api";
import type { Lead, Project, Quote } from "@/types";

type DashboardStatus = "loading" | "ready" | "error";

const ACTIVE_PROJECT_STATUSES = [
  "PLANNING",
  "PLANNED",
  "IN_PROGRESS",
  "REVIEW",
  "QUALITY_CHECK",
  "INSTALLATION",
  "ON_HOLD",
] as const;

const QUOTE_LABELS: Record<string, string> = {
  PENDING: "Pending Review",
  DRAFT: "Under Review",
  SENT: "Quote Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

const PROJECT_LABELS: Record<string, string> = {
  PLANNING: "Planning",
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  REVIEW: "Under Review",
  QUALITY_CHECK: "Quality Check",
  INSTALLATION: "Installation",
  COMPLETED: "Completed",
  ON_HOLD: "On Hold",
  CANCELLED: "Cancelled",
};

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    customers: 0,
    leads: 0,
    quotes: 0,
    projects: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentQuotes, setRecentQuotes] = useState<Quote[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<DashboardStatus>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const loadDashboard = useCallback(() => {
    setStatus("loading");
    setErrorMsg("");

    Promise.all([
      adminApi.getCustomers(),
      adminApi.getLeads(),
      adminApi.getQuotes(),
      adminApi.getProjects(),
    ])
      .then(([customerResponse, leadResponse, quoteResponse, projectResponse]) => {
        if (
          !customerResponse.success ||
          !leadResponse.success ||
          !quoteResponse.success ||
          !projectResponse.success
        ) {
          throw new Error(
            customerResponse.message ||
              leadResponse.message ||
              quoteResponse.message ||
              projectResponse.message ||
              "Unable to load admin dashboard data."
          );
        }

        const leads = newestFirst((leadResponse.data as Lead[]) ?? []);
        const quotes = newestFirst((quoteResponse.data as Quote[]) ?? []);
        const projects = newestFirst((projectResponse.data as Project[]) ?? []);

        setCounts({
          customers: ((customerResponse.data as unknown[]) ?? []).length,
          leads: leads.filter((lead) => lead.status === "NEW").length,
          quotes: quotes.length,
          projects: projects.filter((project) =>
            ACTIVE_PROJECT_STATUSES.includes(
              project.status as (typeof ACTIVE_PROJECT_STATUSES)[number]
            )
          ).length,
        });
        setRecentLeads(leads.slice(0, 5));
        setRecentQuotes(quotes.slice(0, 5));
        setRecentProjects(projects.slice(0, 5));
        setLastUpdatedAt(new Date());
        setStatus("ready");
      })
      .catch((error) => {
        setStatus("error");
        setErrorMsg(
          error instanceof Error
            ? error.message
            : "Unable to load admin dashboard data."
        );
      });
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const stats = useMemo(
    () => [
      {
        label: "Total Customers",
        value: counts.customers,
        href: "/admin/customers",
        icon: UsersRound,
        detail: "Registered customer accounts",
      },
      {
        label: "New Leads",
        value: counts.leads,
        href: "/admin/leads",
        icon: Inbox,
        detail: "Leads waiting for follow-up",
      },
      {
        label: "Quotes",
        value: counts.quotes,
        href: "/admin/quotes",
        icon: MessageSquareQuote,
        detail: "All quote records in the system",
      },
      {
        label: "Active Projects",
        value: counts.projects,
        href: "/admin/projects",
        icon: FolderKanban,
        detail: "Projects not completed or cancelled",
      },
    ],
    [counts.customers, counts.leads, counts.projects, counts.quotes]
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
          Could not load admin dashboard
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
          {errorMsg || "Please retry. No admin data was changed."}
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

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-navy p-6 text-white shadow-sa-xl sm:p-8 lg:p-10">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(212,160,23,0.22),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_42%)]"
          aria-hidden="true"
        />
        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
              Live operations
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Admin Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/64 sm:text-base">
              Monitor incoming leads, quote requests, active projects, and
              customer activity from one premium control room.
            </p>
          </div>
          <button
            type="button"
            onClick={loadDashboard}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-brand-gold/45 hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh data
          </button>
        </div>
        {lastUpdatedAt ? (
          <p className="relative mt-6 text-xs text-white/45">
            Last updated{" "}
            {lastUpdatedAt.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        ) : null}
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <ActivityPanel
          title="Newest leads"
          href="/admin/leads"
          emptyTitle="No leads yet"
          emptyText="New contact and quote leads will appear here."
        >
          {recentLeads.map((lead) => (
            <ActivityRow
              key={lead.id}
              title={lead.name}
              subtitle={lead.email}
              meta={lead.serviceType}
              date={lead.createdAt}
              status={lead.status}
              href="/admin/leads"
            />
          ))}
        </ActivityPanel>

        <ActivityPanel
          title="Recent quotes"
          href="/admin/quotes"
          emptyTitle="No quotes yet"
          emptyText="Customer quote requests will appear here newest-first."
        >
          {recentQuotes.map((quote) => (
            <ActivityRow
              key={quote.id}
              title={quote.customerName || quote.title}
              subtitle={quote.referenceNo}
              meta={quote.title}
              date={quote.createdAt}
              status={QUOTE_LABELS[quote.status] ?? quote.status}
              href="/admin/quotes"
            />
          ))}
        </ActivityPanel>
      </section>

      <ActivityPanel
        title="Latest project activity"
        href="/admin/projects"
        emptyTitle="No projects yet"
        emptyText="Projects will appear here when they are created."
      >
        {recentProjects.map((project) => (
          <ActivityRow
            key={project.id}
            title={project.title}
            subtitle={project.referenceNo}
            meta={project.description}
            date={project.createdAt}
            status={PROJECT_LABELS[project.status] ?? project.status}
            href="/admin/projects"
          />
        ))}
      </ActivityPanel>
    </div>
  );
}

function MetricCard({
  label,
  value,
  href,
  icon: Icon,
  detail,
}: {
  label: string;
  value: number;
  href: string;
  icon: ElementType;
  detail: string;
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
        {label}
      </p>
      <p className="mt-2 font-display text-5xl font-semibold text-brand-navy">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-gray-500">{detail}</p>
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
  children: ReactNode[];
}) {
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

      {children.length > 0 ? (
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

function ActivityRow({
  title,
  subtitle,
  meta,
  date,
  status,
  href,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  date?: string;
  status: string;
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
          {subtitle ? (
            <p className="mt-1 truncate text-xs text-gray-400">{subtitle}</p>
          ) : null}
        </div>
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass(status)}`}>
          {status}
        </span>
      </div>
      {meta ? (
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
          {meta}
        </p>
      ) : null}
      {date ? (
        <p className="mt-3 text-xs text-gray-400">{formatDate(date)}</p>
      ) : null}
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8" aria-label="Loading admin dashboard">
      <div className="h-64 animate-pulse rounded-[2rem] bg-brand-navy/90" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-56 animate-pulse rounded-[1.75rem] border border-white bg-white shadow-sa-lg"
          />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
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

function newestFirst<T extends { createdAt?: string }>(items: T[]) {
  return [...items].sort((a, b) => dateValue(b.createdAt) - dateValue(a.createdAt));
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
  const normalized = status.toUpperCase().replace(/\s+/g, "_");
  const map: Record<string, string> = {
    NEW: "bg-yellow-100 text-yellow-800",
    CONTACTED: "bg-blue-100 text-blue-800",
    QUALIFIED: "bg-purple-100 text-purple-800",
    CONVERTED: "bg-emerald-100 text-emerald-800",
    LOST: "bg-red-100 text-red-800",
    PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
    UNDER_REVIEW: "bg-gray-100 text-gray-700",
    QUOTE_SENT: "bg-blue-100 text-blue-800",
    ACCEPTED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-800",
    EXPIRED: "bg-orange-100 text-orange-800",
    PLANNING: "bg-slate-100 text-slate-700",
    PLANNED: "bg-slate-100 text-slate-700",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    REVIEW: "bg-amber-100 text-amber-800",
    QUALITY_CHECK: "bg-amber-100 text-amber-800",
    INSTALLATION: "bg-violet-100 text-violet-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    ON_HOLD: "bg-orange-100 text-orange-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return map[normalized] ?? "bg-gray-100 text-gray-700";
}
