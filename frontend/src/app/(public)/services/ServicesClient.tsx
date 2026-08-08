"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Factory,
  MessageSquareText,
  Palette,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  InteractiveServiceCard,
  type InteractiveServiceCardAccent,
} from "@/components/ui/interactive-service-card";
import { SERVICE_DETAILS, type ServiceDetail } from "@/lib/service-details";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

interface ServicesClientProps {
  services: Service[];
}

const PROCESS_STEPS = [
  {
    title: "Consultation",
    text: "We understand the location, visibility needs, budget, and brand expectations.",
    icon: MessageSquareText,
  },
  {
    title: "Design",
    text: "Layouts, materials, lighting, and proportions are refined before production.",
    icon: Palette,
  },
  {
    title: "Manufacturing",
    text: "Your signage is fabricated with accurate finishing and workshop quality control.",
    icon: Factory,
  },
  {
    title: "Quality Check",
    text: "Lighting, structure, surfaces, and fitment details are checked before dispatch.",
    icon: ShieldCheck,
  },
  {
    title: "Installation",
    text: "Our team handles mounting, alignment, wiring coordination, and final handover.",
    icon: Wrench,
  },
];

const FAQ_ITEMS = [
  {
    q: "How long does a typical signage project take?",
    a: "Most projects complete within 7 to 12 working days after design approval. Larger or multi-location work may need a longer schedule, which we confirm before production.",
  },
  {
    q: "Do you help choose the right material?",
    a: "Yes. We recommend materials based on indoor or outdoor use, lighting needs, brand finish, budget, and long-term durability.",
  },
  {
    q: "Can you manage design, fabrication, and installation together?",
    a: "Yes. Shreeji Art can support the complete workflow from concept and technical planning to manufacturing, site installation, and final handover.",
  },
  {
    q: "Do you make custom signage sizes and shapes?",
    a: "Yes. We fabricate custom dimensions, letters, panels, frames, and mixed-material signage based on your site and brand requirements.",
  },
  {
    q: "Can I request a quote before finalizing the design?",
    a: "Yes. Share your requirement, approximate size, location, and reference ideas. Our team will guide you with a practical estimate and next steps.",
  },
];

const SERVICE_ACCENTS: Partial<Record<ServiceDetail["slug"], InteractiveServiceCardAccent>> = {
  "led-sign-boards": "gold",
  "acrylic-signs": "blue",
  "3d-letter-signs": "purple",
  "acp-signage": "green",
  "stainless-steel-signs": "gold",
  "glow-sign-boards": "orange",
  "office-branding": "blue",
  "retail-branding": "gold",
  "industrial-signage": "green",
  wayfinding: "purple",
  "custom-fabrication": "gold",
  installation: "orange",
};

function findLiveService(detail: ServiceDetail, services: Service[]) {
  return services.find((service) => {
    const slug = service.slug?.toLowerCase();
    return slug === detail.slug || detail.apiSlugs?.includes(slug);
  });
}

function getServiceTitle(detail: ServiceDetail, services: Service[]) {
  return findLiveService(detail, services)?.name || detail.label;
}

function getServiceDescription(detail: ServiceDetail, services: Service[]) {
  return findLiveService(detail, services)?.shortDescription || detail.summary;
}

function ProcessTimeline() {
  return (
    <section className="bg-[#F8F6F2] py-24 sm:py-28 lg:py-32" aria-labelledby="process-title">
      <div className="sa-container">
        <AnimateIn from="bottom" className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-brand-gold">Manufacturing Process</p>
          <h2
            id="process-title"
            className="mt-4 font-display text-[clamp(2.4rem,4vw,3.45rem)] font-semibold leading-[1.05] tracking-tight text-brand-navy"
          >
            A clear path from idea to installation.
          </h2>
          <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
            Every project moves through a simple, controlled workflow so the final sign looks right,
            installs cleanly, and lasts.
          </p>
        </AnimateIn>

        <div className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <div
            className="absolute left-[10%] right-[10%] top-[2.2rem] hidden h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent lg:block"
            aria-hidden="true"
          />
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimateIn key={step.title} from="bottom" delay={index * 60}>
                <div className="relative h-full rounded-[1.6rem] border border-brand-navy/10 bg-white/75 p-6 shadow-sa-xs transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:border-brand-gold/45 hover:bg-white motion-reduce:transform-none">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/35 bg-brand-navy text-brand-gold shadow-[0_12px_30px_rgba(18,20,38,0.18)]">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold/90">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-brand-navy">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">{step.text}</p>
                </div>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#F2EEE6] py-24 sm:py-28 lg:py-32" aria-labelledby="services-faq-title">
      <div className="sa-container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <AnimateIn from="left">
          <p className="text-caption text-brand-gold">FAQ</p>
          <h2
            id="services-faq-title"
            className="mt-4 font-display text-[clamp(2.35rem,4vw,3.35rem)] font-semibold leading-[1.05] tracking-tight text-brand-navy"
          >
            Questions before you start?
          </h2>
          <p className="mt-5 max-w-md text-base leading-8 text-gray-600">
            A quick guide to timelines, materials, and how we approach signage projects.
          </p>
        </AnimateIn>

        <AnimateIn from="right">
          <div className="overflow-hidden rounded-[1.75rem] border border-brand-navy/10 bg-white shadow-[0_24px_70px_rgba(18,20,38,0.08)]">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.q} className="border-b border-brand-navy/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="group flex w-full items-center justify-between gap-5 px-6 py-5 text-left font-semibold text-brand-navy transition-colors duration-[250ms] hover:bg-[#F8F6F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-gold sm:px-7 sm:py-6"
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-brand-gold transition-all duration-[250ms] group-hover:brightness-110",
                        isOpen && "rotate-180"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    className={cn(
                      "grid transition-all duration-[250ms] ease-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-7 text-gray-600 sm:px-7">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

export default function ServicesClient({ services }: ServicesClientProps) {
  const serviceCards = useMemo(() => SERVICE_DETAILS, []);

  return (
    <div className="min-h-screen bg-[#F8F6F2]">
      <Navbar />

      <main>
        <section className="relative isolate flex min-h-[64vh] items-center overflow-hidden bg-brand-deep pt-20 text-white">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/gallery/led-sign/led-sign-02.svg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
              unoptimized
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#0B0B14_0%,rgba(18,20,38,0.96)_44%,rgba(18,20,38,0.76)_100%)]" />
            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(217,165,20,0.38) 1px, transparent 1px), linear-gradient(90deg, rgba(217,165,20,0.32) 1px, transparent 1px)",
                backgroundSize: "76px 76px",
              }}
              aria-hidden="true"
            />
            <div
              className="absolute right-[-8rem] top-16 h-72 w-72 rounded-[2rem] border border-brand-gold/40 opacity-[0.045] rotate-12 sm:h-96 sm:w-96"
              aria-hidden="true"
            />
            <div
              className="absolute right-[8%] top-[22%] h-px w-64 bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent opacity-[0.045]"
              aria-hidden="true"
            />
            <div
              className="absolute left-[8%] top-[34%] h-44 w-44 rounded-full bg-brand-gold/15 blur-3xl opacity-25"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-deep to-transparent" />
          </div>

          <div className="sa-container py-20 sm:py-24 lg:py-28">
            <AnimateIn from="bottom" className="max-w-3xl">
              <span className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                Signage Services
              </span>
              <h1 className="mt-7 font-display text-5xl font-semibold leading-[0.96] tracking-tight sm:text-6xl lg:text-7xl">
                Premium signage solutions for visible brands.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Explore Shreeji Art&apos;s core capabilities across illuminated signage, fabrication,
                branding, wayfinding, and professional installation.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#services-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy shadow-sa-gold transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-brand-gold-light hover:shadow-[0_18px_40px_rgba(217,165,20,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold motion-reduce:transform-none"
                >
                  View Services
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center rounded-full border border-white/22 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-brand-gold/55 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold motion-reduce:transform-none"
                >
                  Request a Quote
                </Link>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section
          id="services-grid"
          className="relative overflow-hidden bg-[#F2EEE6] py-24 sm:py-28 lg:py-32"
          aria-labelledby="services-grid-title"
        >
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"
            aria-hidden="true"
          />
          <div className="sa-container">
            <AnimateIn from="bottom" className="mx-auto max-w-3xl text-center">
              <p className="text-caption text-brand-gold">What We Make</p>
              <h2
                id="services-grid-title"
                className="mt-4 font-display text-[clamp(2.4rem,4vw,3.45rem)] font-semibold leading-[1.05] tracking-tight text-brand-navy"
              >
                Cleanly organized, easy to choose.
              </h2>
              <p className="mt-5 text-base leading-8 text-gray-600 sm:text-lg">
                Choose a service to see details, materials, applications, and the best way to start your project.
              </p>
            </AnimateIn>

            <div className="mx-auto mt-16 grid max-w-6xl gap-7">
              {serviceCards.map((detail, index) => {
                const title = getServiceTitle(detail, services);
                const description = getServiceDescription(detail, services);

                return (
                  <AnimateIn
                    key={detail.slug}
                    from="rise"
                    delay={(index % 2) * 70}
                    duration={620}
                    threshold={0.16}
                  >
                    <InteractiveServiceCard
                      title={title}
                      slug={detail.slug}
                      category={detail.category}
                      description={description}
                      imageSrc={detail.image}
                      altText={`${title} by Shreeji Art`}
                      features={detail.benefits}
                      accent={SERVICE_ACCENTS[detail.slug] || "gold"}
                      featured={
                        detail.slug === "led-sign-boards" ||
                        detail.slug === "acrylic-signs" ||
                        detail.slug === "stainless-steel-signs"
                      }
                      reversed={index % 2 === 1}
                    />
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        <ProcessTimeline />
        <FaqSection />

        <section className="bg-[#F8F6F2] px-4 py-24 sm:py-28 lg:py-32">
          <AnimateIn from="bottom">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-brand-navy px-6 py-16 text-center text-white shadow-sa-premium sm:px-10 sm:py-18">
              <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <CheckCircle2 className="mx-auto h-8 w-8 text-brand-gold" aria-hidden="true" />
              </div>
              <h2 className="relative mx-auto mt-6 max-w-3xl font-display text-[clamp(2.25rem,4vw,3.4rem)] font-semibold leading-[1.05] tracking-tight">
                Ready to create signage that gets noticed?
              </h2>
              <div className="relative mt-9">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy shadow-sa-gold transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-brand-gold-light hover:shadow-[0_18px_40px_rgba(217,165,20,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold motion-reduce:transform-none"
                >
                  Request a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </AnimateIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
