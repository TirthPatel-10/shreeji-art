"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { publicApi } from "@/lib/api";

type Status = "idle" | "loading" | "success" | "error";

const fieldClass =
  "w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3.5 text-base text-[#121426] shadow-sm transition-colors duration-200 placeholder:text-[#667085]/60 hover:border-[#D9A514]/60 focus:border-[#D9A514] focus:outline-none focus:ring-4 focus:ring-[#D9A514]/18 disabled:cursor-not-allowed disabled:bg-[#FAF8F2] disabled:opacity-70 motion-reduce:transition-none";

const labelClass =
  "mb-2 block text-sm font-semibold text-[#121426]";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isSubmitting = status === "loading";

  function set(field: keyof typeof form) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      if (status === "error") {
        setStatus("idle");
        setErrorMsg("");
      }
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await publicApi.submitContact(form);

      if (res.success) {
        setStatus("success");
        setForm(initialForm);
      } else {
        setStatus("error");
        setErrorMsg(
          res.message ||
            "We could not send your message. Please check the details and try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "We could not reach the server. Please check your connection and try again."
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-[1.5rem] border border-[#E5E7EB] bg-[#FAF8F2] px-6 py-12 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#D9A514]/35 bg-white text-[#D9A514] shadow-sm">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-[#121426]">
          Message sent
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-[#667085]">
          Thank you for contacting Shreeji Art. We will get back to you within
          24 working hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 inline-flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#121426] transition-colors hover:border-[#D9A514] hover:text-[#D9A514] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A514] focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
      {status === "error" ? (
        <div
          className="flex items-start gap-3 rounded-2xl border border-[#D9A514]/45 bg-[#FAF8F2] px-4 py-3.5 text-[#121426]"
          role="alert"
        >
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-[#D9A514]"
            aria-hidden="true"
          />
          <p className="text-base leading-6">{errorMsg}</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelClass}>
            Name *
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={set("name")}
            placeholder="Your full name"
            className={fieldClass}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="cf-email" className={labelClass}>
            Email *
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            placeholder="your@email.com"
            className={fieldClass}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 XXXXX XXXXX"
            className={fieldClass}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="cf-subject" className={labelClass}>
            Subject *
          </label>
          <input
            id="cf-subject"
            name="subject"
            type="text"
            required
            value={form.subject}
            onChange={set("subject")}
            placeholder="LED sign, acrylic letters..."
            className={fieldClass}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={set("message")}
          placeholder="Tell us about your signage project - type, size, location, quantity, timeline, and any reference details."
          className={`${fieldClass} resize-none leading-6`}
          disabled={isSubmitting}
        />
        <p className="mt-2 text-sm leading-6 text-[#667085]">
          Helpful details: sign type, approximate size, installation location,
          and deadline.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D9A514] px-6 py-4 text-base font-semibold text-[#121426] shadow-sm transition-colors duration-200 hover:bg-[#D9A514]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A514] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending message...
          </>
        ) : (
          <>
            Send Message
            <Send className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
