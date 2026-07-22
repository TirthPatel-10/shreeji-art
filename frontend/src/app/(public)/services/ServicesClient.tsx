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

function ServiceCard({
  detail,
  index,
  services,
}: {
  detail: ServiceDetail;
  index: number;
  services: Service[];
}) {
  const title = getServiceTitle(detail, services);
  const description = getServiceDescription(detail, services);

  return (
    <AnimateIn from="bottom" delay={(index % 3) * 70}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sa-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-gold/60 hover:shadow-sa-premium">
        <Link
          href={`/services/${detail.slug}`}
          className="relative block aspect-[4/3] overflow-hidden bg-brand-deep"
          aria-label={`Learn more about ${title}`}
        >
          <Image
            src={detail.image}
            alt={`${title} by Shreeji Art`}
            fill
            sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
            unoptimized={detail.image.endsWith(".svg")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/12 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/90 px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
            {detail.category}
          </span>
        </Link>

        <div className="flex flex-1 flex-col p-6">
          <h2 className="font-display text-2xl font-semibold leading-tight text-brand-navy">
            {title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">{description}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/services/${detail.slug}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-brand-navy transition-colors hover:border-brand-gold hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              Learn More
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={`/quote?service=${encodeURIComponent(title)}`}
              className="inline-flex flex-1 items-center justify-center rounded-full bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-navy shadow-sa-gold transition-colors hover:bg-brand-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </article>
    </AnimateIn>
  );
}

function ProcessTimeline() {
  return (
    <section className="bg-white py-20 sm:py-24" aria-labelledby="process-title">
      <div className="sa-container">
        <AnimateIn from="bottom" className="mx-auto max-w-3xl text-center">
          <p className="text-caption text-brand-gold">Manufacturing Process</p>
          <h2
            id="process-title"
            className="mt-4 font-display text-4xl font-semibold tracking-tight text-brand-navy sm:text-5xl"
          >
            A clear path from idea to installation.
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600">
            Every project moves through a simple, controlled workflow so the final sign looks right,
            installs cleanly, and lasts.
          </p>
        </AnimateIn>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <AnimateIn key={step.title} from="bottom" delay={index * 60}>
                <div className="relative h-full rounded-[1.5rem] border border-gray-200 bg-[#FAF8F2] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50">
                  {index < PROCESS_STEPS.length - 1 ? (
                    <div
                      className="absolute left-[calc(100%-0.5rem)] top-10 hidden h-px w-5 bg-brand-gold/35 lg:block"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-brand-navy">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-600">{step.text}</p>
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
    <section className="bg-[#FAF8F2] py-20 sm:py-24" aria-labelledby="services-faq-title">
      <div className="sa-container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <AnimateIn from="left">
          <p className="text-caption text-brand-gold">FAQ</p>
          <h2
            id="services-faq-title"
            className="mt-4 font-display text-4xl font-semibold tracking-tight text-brand-navy sm:text-5xl"
          >
            Questions before you start?
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-gray-600">
            A quick guide to timelines, materials, and how we approach signage projects.
          </p>
        </AnimateIn>

        <AnimateIn from="right">
          <div className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sa-xs">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.q} className="border-b border-gray-100 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left font-semibold text-brand-navy transition-colors hover:bg-[#FAF8F2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-gold"
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={cn("h-5 w-5 shrink-0 text-brand-gold transition-transform", isOpen && "rotate-180")}
                      aria-hidden="true"
                    />
                  </button>
                  <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-7 text-gray-600">{item.a}</p>
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
    <div className="min-h-screen bg-white">
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
            <div className="absolute inset-0 bg-[linear-gradient(90deg,#080916_0%,rgba(18,20,38,0.96)_44%,rgba(18,20,38,0.74)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-deep to-transparent" />
          </div>

          <div className="sa-container py-16 sm:py-20">
            <AnimateIn from="bottom" className="max-w-3xl">
              <span className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                Signage Services
              </span>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Premium signage solutions for visible brands.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                Explore Shreeji Art&apos;s core capabilities across illuminated signage, fabrication,
                branding, wayfinding, and professional installation.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#services-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy shadow-sa-gold transition-colors hover:bg-brand-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                >
                  View Services
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-brand-gold/50 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                >
                  Get Quote
                </Link>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section id="services-grid" className="bg-[#FAF8F2] py-20 sm:py-24" aria-labelledby="services-grid-title">
          <div className="sa-container">
            <AnimateIn from="bottom" className="mx-auto max-w-3xl text-center">
              <p className="text-caption text-brand-gold">What We Make</p>
              <h2
                id="services-grid-title"
                className="mt-4 font-display text-4xl font-semibold tracking-tight text-brand-navy sm:text-5xl"
              >
                Cleanly organized, easy to choose.
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Choose a service to see details, materials, applications, and the best way to start your project.
              </p>
            </AnimateIn>

            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {serviceCards.map((detail, index) => (
                <ServiceCard key={detail.slug} detail={detail} index={index} services={services} />
              ))}
            </div>
          </div>
        </section>

        <ProcessTimeline />
        <FaqSection />

        <section className="bg-white px-4 py-20 sm:py-24">
          <AnimateIn from="bottom">
            <div className="mx-auto max-w-6xl rounded-[2rem] bg-brand-navy px-6 py-14 text-center text-white shadow-sa-premium sm:px-10">
              <CheckCircle2 className="mx-auto h-8 w-8 text-brand-gold" aria-hidden="true" />
              <h2 className="mx-auto mt-5 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                Ready to create signage that gets noticed?
              </h2>
              <div className="mt-8">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy shadow-sa-gold transition-colors hover:bg-brand-gold-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                >
                  Request a Free Quote
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
