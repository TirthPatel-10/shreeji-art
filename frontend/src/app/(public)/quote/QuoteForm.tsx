"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Loader2,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import { customerApi, publicApi } from "@/lib/api";
import { SITE_CONTACT } from "@/lib/contact";
import { useAuth } from "@/context/AuthContext";

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

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  serviceType: "",
  message: "",
};

const fieldClass =
  "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-brand-navy shadow-inner shadow-gray-900/[0.02] transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-brand-gold focus:outline-none focus:ring-4 focus:ring-brand-gold/15 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none";

const labelClass = "mb-2 block text-sm font-semibold text-brand-navy";

const SUPPORT_ITEMS = [
  {
    icon: Clock,
    title: "Estimated response",
    text: "Within 24 working hours",
  },
  {
    icon: ShieldCheck,
    title: "No-obligation quote",
    text: "Clear guidance before commitment",
  },
  {
    icon: CheckCircle2,
    title: "Material guidance",
    text: "Acrylic, ACP, LED, SS, and finish advice",
  },
  {
    icon: CheckCircle2,
    title: "Installation planning",
    text: "Site, surface, lighting, and access review",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp assistance",
    text: "Share references or measurements quickly",
  },
] as const;

export default function QuoteForm() {
  const router = useRouter();
  const { user, isCustomer, loading: authLoading } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isSubmitting = status === "loading";

  useEffect(() => {
    if (!isCustomer || !user) return;

    setForm((prev) => ({
      ...prev,
      name: prev.name || `${user.firstName} ${user.lastName}`.trim(),
      email: prev.email || user.email,
      phone: prev.phone || user.phone || "",
    }));
  }, [isCustomer, user]);

  function set(field: keyof typeof form) {
    return (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (status === "error") {
        setStatus("idle");
        setErrorMsg("");
      }
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (authLoading) return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = isCustomer
        ? await customerApi.submitQuoteRequest({
            serviceType: form.serviceType,
            description: form.message,
            companyName: form.company || undefined,
          })
        : await publicApi.submitQuoteRequest(form);

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
        if (isCustomer) {
          window.setTimeout(() => router.push("/quotes"), 1200);
        }
      } else {
        setStatus("error");
        if (res.errors) {
          const firstError = Object.values(res.errors)[0];
          setErrorMsg(
            firstError ||
              res.message ||
              "Please check the highlighted details and try again."
          );
        } else {
          setErrorMsg(
            res.message ||
              "We could not submit your quote request. Please try again."
          );
        }
      }
    } catch (err) {
      setStatus("error");
      const msg = err instanceof Error ? err.message : "";
      if (msg === "NETWORK_ERROR") {
        setErrorMsg(
          "Cannot reach the server. Please check your internet connection and try again."
        );
      } else if (msg.startsWith("HTTP_5")) {
        setErrorMsg("Server error. Please try again in a moment.");
      } else if (msg.startsWith("HTTP_4")) {
        setErrorMsg("Invalid request. Please check your details and try again.");
      } else {
        setErrorMsg("An unexpected error occurred. Please try again.");
      }
    }
  }

  if (status === "success") {
    return (
      <div
        className="mx-auto grid max-w-2xl place-items-center rounded-[2rem] border border-emerald-200 bg-white p-8 text-center shadow-sa-lg sm:p-10"
        role="status"
        aria-live="polite"
      >
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h2 className="font-display text-3xl font-semibold text-brand-navy">
          Quote request submitted
        </h2>
        <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600">
          We&apos;ll review your signage requirements and follow up with the
          next steps within 24 working hours.
        </p>
        {isCustomer ? (
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gold/10 px-4 py-2 text-sm font-semibold text-brand-gold">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Redirecting to My Quotes...
          </p>
        ) : (
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-7 inline-flex items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10 px-6 py-3 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            Submit another request
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-gray-100 bg-white p-5 shadow-sa-xl sm:p-7 lg:p-9"
      >
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Project Request
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy">
            Tell us what you need built.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            A few clear details help us recommend the right signage approach
            without unnecessary back-and-forth.
          </p>
        </div>

        {isCustomer && user ? (
          <div className="mb-7 rounded-2xl border border-brand-gold/20 bg-brand-gold/10 px-4 py-3 text-sm leading-6 text-brand-navy">
            Submitting as{" "}
            <span className="font-semibold">
              {user.firstName} {user.lastName}
            </span>{" "}
            ({user.email}). Your quote will be saved to My Quotes.
          </div>
        ) : null}

        {status === "error" ? (
          <div
            className="mb-7 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5 text-red-700"
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-sm leading-6">{errorMsg}</p>
          </div>
        ) : null}

        <div className="space-y-8">
          <fieldset disabled={isSubmitting || authLoading}>
            <legend className="font-display text-xl font-semibold text-brand-navy">
              Contact Information
            </legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="quote-name" className={labelClass}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="quote-name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your full name"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="quote-phone" className={labelClass}>
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="quote-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+91 XXXXX XXXXX"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="quote-email" className={labelClass}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="your@email.com"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="quote-company" className={labelClass}>
                  Company Name
                </label>
                <input
                  id="quote-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={form.company}
                  onChange={set("company")}
                  placeholder="Business name (optional)"
                  className={fieldClass}
                />
              </div>
            </div>
          </fieldset>

          <fieldset disabled={isSubmitting || authLoading}>
            <legend className="font-display text-xl font-semibold text-brand-navy">
              Project Information
            </legend>
            <div className="mt-5 space-y-5">
              <div>
                <label htmlFor="quote-service-type" className={labelClass}>
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="quote-service-type"
                  name="serviceType"
                  required
                  value={form.serviceType}
                  onChange={set("serviceType")}
                  className={fieldClass}
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quote-message" className={labelClass}>
                  Project Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="quote-message"
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Describe size, location, quantity, material preferences, lighting, deadline, and installation needs."
                  className={`${fieldClass} resize-none leading-6`}
                />
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  You can share reference photos or drawings later by WhatsApp
                  or email.
                </p>
              </div>
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || authLoading}
          className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-gold px-6 py-4 text-sm font-bold text-brand-navy shadow-[0_16px_34px_rgba(212,160,23,0.24)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transform-none motion-reduce:transition-none"
        >
          {authLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Checking session...
            </>
          ) : isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Submitting request...
            </>
          ) : (
            <>
              Submit Quote Request
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          )}
        </button>

        <p className="mt-4 text-center text-xs leading-5 text-gray-500">
          We&apos;ll review your request and follow up with the next steps.
        </p>
      </form>

      <aside className="rounded-[2rem] border border-white/10 bg-brand-navy-deep p-6 text-white shadow-sa-xl lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
          Support Summary
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold">
          What happens next
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/62">
          Your request goes to the Shreeji Art team for practical guidance and
          estimate planning.
        </p>

        <div className="mt-7 space-y-4">
          {SUPPORT_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold/12 text-brand-gold">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-white/55">
                    {item.text}
                  </span>
                </span>
              </div>
            );
          })}
        </div>

        <a
          href={SITE_CONTACT.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-gold/35 bg-brand-gold/10 px-5 py-3 text-sm font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-brand-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy-deep"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          WhatsApp assistance
        </a>
      </aside>
    </div>
  );
}
