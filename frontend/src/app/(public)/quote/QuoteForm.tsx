"use client";

import { useState } from "react";
import { publicApi } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

const serviceTypes = [
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

export default function QuoteForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    message: "",
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
      const res = await publicApi.submitQuoteRequest(form);
      if (res.success) {
        setStatus("success");
        setForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          serviceType: "",
          message: "",
        });
      } else {
        setStatus("error");
        setErrorMsg(res.message || "Failed to submit request.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Connection error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-xl font-bold text-brand-navy mb-2">
          Quote Request Submitted!
        </p>
        <p className="text-gray-500 mb-2">
          We&apos;ll get back to you within 24 hours on business days.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-brand-gold hover:underline text-sm"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white border border-gray-100 rounded-2xl p-8 shadow-sm"
    >
      {status === "error" && (
        <div className="text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={set("phone")}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          required
          value={form.email}
          onChange={set("email")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          value={form.company}
          onChange={set("company")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service Type *
        </label>
        <select
          required
          value={form.serviceType}
          onChange={set("serviceType")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold bg-white"
        >
          <option value="">Select a service</option>
          {serviceTypes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Details *
        </label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={set("message")}
          placeholder="Describe your signage requirements — size, location, quantity, material preferences..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Submitting..." : "Submit Quote Request"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        We&apos;ll respond within 24 hours on business days.
      </p>
    </form>
  );
}
