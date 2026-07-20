"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { customerApi } from "@/lib/api";

const SERVICE_TYPES = [
  "LED Signs",
  "Acrylic Signs",
  "3D Letter Signs",
  "ACP Signage",
  "Stainless Steel Signage",
  "Glow Sign Boards",
  "Wayfinding Signs",
  "Office Branding",
  "Retail Branding",
  "Industrial Signage",
  "Custom Fabrication",
  "Other",
];

type Status = "idle" | "loading" | "success" | "error";

export default function NewQuotePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    serviceType: "",
    companyName: "",
    description: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await customerApi.submitQuoteRequest({
        serviceType: form.serviceType,
        description: form.description,
        companyName: form.companyName || undefined,
      });
      if (res.success) {
        setStatus("success");
        setTimeout(() => router.push("/quotes"), 1800);
      } else {
        setStatus("error");
        if (res.errors) {
          const first = Object.values(res.errors)[0];
          setErrorMsg(first || res.message || "Validation failed.");
        } else {
          setErrorMsg(res.message || "Failed to submit. Please try again.");
        }
      }
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "";
      if (msg === "NETWORK_ERROR") {
        setErrorMsg(
          "Cannot reach the server. Please check your internet connection."
        );
      } else if (msg.startsWith("HTTP_5")) {
        setErrorMsg("Server error. Please try again in a moment.");
      } else if (msg === "HTTP_401") {
        setErrorMsg("Your session has expired. Please sign in again.");
        router.replace("/login");
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
      if (process.env.NODE_ENV === "development") {
        console.error("[NewQuotePage] submission error:", err);
      }
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-5">✅</p>
        <h2 className="text-xl font-bold text-brand-navy mb-2">
          Quote Request Submitted!
        </h2>
        <p className="text-gray-500 text-sm mb-1">
          We&apos;ll prepare your quote within 24 hours.
        </p>
        <p className="text-gray-400 text-xs">Redirecting to My Quotes…</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href="/quotes"
          className="text-gray-400 hover:text-brand-navy transition-colors"
        >
          My Quotes
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-brand-navy font-medium">New Request</span>
      </div>

      <h1 className="text-2xl font-bold text-brand-navy mb-1">
        Request a Quote
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Describe your requirements and we&apos;ll prepare a detailed proposal
        within 24 hours.
      </p>

      {/* Submitting as */}
      {user && (
        <div className="bg-brand-navy/5 border border-brand-navy/10 rounded-xl px-4 py-3 mb-6 text-sm text-gray-500">
          Submitting as{" "}
          <span className="font-medium text-brand-navy">
            {user.firstName} {user.lastName}
          </span>{" "}
          ({user.email})
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-5"
      >
        {status === "error" && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.serviceType}
            onChange={set("serviceType")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold bg-white"
          >
            <option value="">Select a service…</option>
            {SERVICE_TYPES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company / Business Name
          </label>
          <input
            type="text"
            value={form.companyName}
            onChange={set("companyName")}
            placeholder="Your business name (optional)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Details <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={set("description")}
            placeholder="Describe your signage requirements — size, location, quantity, material preferences, deadline…"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "Submitting…" : "Submit Quote Request"}
        </button>
        <p className="text-xs text-gray-400 text-center">
          We respond within 24 hours on business days.
        </p>
      </form>
    </div>
  );
}
