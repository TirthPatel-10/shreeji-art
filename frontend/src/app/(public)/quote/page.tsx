import type { Metadata } from "next";
import {
  ClipboardCheck,
  FileText,
  Lightbulb,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import QuoteForm from "./QuoteForm";

export const metadata: Metadata = {
  title: "Request a Free Quote | Shreeji Art",
  description:
    "Request a free signage quote from Shreeji Art in Ahmedabad. Share your signage requirements for LED signs, acrylic signs, 3D letters, ACP signage, branding, and installation.",
};

const TRUST_CHIPS = [
  "No-obligation quote",
  "Material guidance",
  "Fast response",
] as const;

const PROCESS_POINTS = [
  {
    icon: FileText,
    title: "Share Requirements",
    text: "Tell us the signage type, size, location, quantity, and deadline.",
  },
  {
    icon: Lightbulb,
    title: "Receive Guidance",
    text: "We recommend practical material, lighting, fabrication, and installation options.",
  },
  {
    icon: ClipboardCheck,
    title: "Get a Clear Estimate",
    text: "You receive a focused response with next steps and estimate direction.",
  },
] as const;

export default function QuotePage() {
  return (
    <>
      <Navbar />
      <main className="bg-brand-off-white text-brand-navy">
        <section className="relative isolate overflow-hidden border-b border-brand-gold/10 bg-gradient-to-br from-white via-brand-off-white to-brand-gold/10 pt-24">
          <div
            className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-brand-gold/45 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute right-[-8rem] top-[-10rem] -z-10 h-80 w-80 rounded-full bg-brand-gold/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="mx-auto flex min-h-[380px] max-w-7xl items-center px-4 py-14 sm:px-6 lg:min-h-[420px] lg:px-8">
            <AnimateIn from="bottom" duration={600}>
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold shadow-sa-xs backdrop-blur">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Free Project Estimate
                </span>
                <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-brand-navy sm:text-6xl">
                  Request a Free Quote
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
                  Share your signage requirements and our team will recommend
                  the right materials, lighting, fabrication, and installation
                  approach.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  {TRUST_CHIPS.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-brand-navy/10 bg-white px-4 py-2 text-sm font-semibold text-brand-navy shadow-sa-xs"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <QuoteForm />
          </div>
        </section>

        <section className="border-y border-brand-navy/5 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-7 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                How it works
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy">
                A clearer way to plan signage.
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {PROCESS_POINTS.map((item) => {
                const Icon = item.icon;

                return (
                  <AnimateIn key={item.title} from="bottom" duration={520}>
                    <div className="h-full rounded-[1.5rem] border border-gray-100 bg-brand-off-white/70 p-6 shadow-sa-sm">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="mt-5 font-display text-xl font-semibold text-brand-navy">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-gray-600">
                        {item.text}
                      </p>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer compact />
    </>
  );
}
