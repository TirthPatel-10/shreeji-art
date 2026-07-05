"use client";

import { useState } from "react";
import { publicApi } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function set(field: keyof typeof form) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await publicApi.submitContact(form);
      if (res.success) {
        setStatus("success");
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setStatus("error");
        setErrorMsg(res.message || "Failed to send message.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Connection error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-4">✅</p>
        <p className="text-xl font-bold text-brand-navy mb-2">Message Sent!</p>
        <p className="text-gray-500">We&apos;ll get back to you within 24 hours.</p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-brand-gold hover:underline text-sm"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div className="text-sm text-brand-red bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {errorMsg}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={set("name")}
          placeholder="Your name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
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
          placeholder="your@email.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={set("phone")}
          placeholder="+91 XXXXX XXXXX"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Subject *
        </label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={set("subject")}
          placeholder="How can we help?"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Message *
        </label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us about your project..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
