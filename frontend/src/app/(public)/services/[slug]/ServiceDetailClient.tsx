"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Factory,
  ImageOff,
  Layers,
  Lightbulb,
  MapPin,
  RefreshCw,
  Shield,
  Sparkles,
  Square,
  Store,
  Type,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import { publicApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  getRelatedServices,
  type ServiceDetail,
  type ServiceIconKey,
} from "@/lib/service-details";
import type { GalleryItem, PortfolioItem, Service } from "@/types";

type RelatedStatus = "loading" | "ready" | "empty" | "error";

type RelatedItem = {
  id: string;
  title: string;
  href: string;
  image?: string;
  meta?: string;
};

const ICONS: Record<ServiceIconKey, typeof Lightbulb> = {
  lightbulb: Lightbulb,
  square: Square,
  type: Type,
  layers: Layers,
  shield: Shield,
  sparkles: Sparkles,
  briefcase: Briefcase,
  store: Store,
  factory: Factory,
  map: MapPin,
  wrench: Wrench,
  installation: Wrench,
};

function serviceMatchesText(service: ServiceDetail, text: string) {
  const normalized = text.toLowerCase();
  return [service.label, service.slug, ...(service.apiSlugs ?? []), ...service.relatedKeywords].some((keyword) =>
    normalized.includes(keyword.toLowerCase())
  );
}

function portfolioImage(item: PortfolioItem) {
  return item.images?.find(Boolean);
}

function relatedFromPortfolio(service: ServiceDetail, items: PortfolioItem[]): RelatedItem[] {
  return items
    .filter((item) => {
      const searchText = [
        item.title,
        item.description,
        item.clientName,
        item.service?.name,
        item.service?.slug,
        ...(item.tags ?? []),
      ]
        .filter(Boolean)
        .join(" ");

      return serviceMatchesText(service, searchText);
    })
    .slice(0, 3)
    .map((item) => ({
      id: `portfolio-${item.id}`,
      title: item.title,
      href: `/portfolio/${item.slug}`,
      image: portfolioImage(item),
      meta: item.service?.name || item.clientName || "Portfolio",
    }));
}

function relatedFromGallery(service: ServiceDetail, items: GalleryItem[]): RelatedItem[] {
  return items
    .filter((item) =>
      serviceMatchesText(
        service,
        [item.title, item.category, item.imageUrl].filter(Boolean).join(" ")
      )
    )
    .slice(0, 3)
    .map((item) => ({
      id: `gallery-${item.id}`,
      title: item.title,
      href: "/gallery",
      image: item.imageUrl,
      meta: item.category || "Gallery",
    }));
}

function RelatedImage({
  src,
  title,
  priority,
}: {
  src?: string;
  title: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-navy via-brand-deep to-brand-navy-light">
        <ImageOff className="h-8 w-8 text-white/35" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      priority={priority}
      className="object-cover transition-transform duration-700 ease-smooth group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
      unoptimized={src.endsWith(".svg")}
      onError={() => setFailed(true)}
    />
  );
}

function WorkSkeletons() {
  return (
    <div className="grid gap-5 md:grid-cols-3" aria-label="Loading related work">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sa-xs"
        >
          <div className="h-44 animate-pulse bg-gray-100" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-20 animate-pulse rounded-full bg-gray-100" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RelatedWork({ service }: { service: ServiceDetail }) {
  const [status, setStatus] = useState<RelatedStatus>("loading");
  const [items, setItems] = useState<RelatedItem[]>([]);

  useEffect(() => {
    let active = true;

    async function loadRelatedWork() {
      setStatus("loading");

      try {
        const [portfolioRes, galleryRes] = await Promise.all([
          publicApi.getPortfolio(),
          publicApi.getGallery(),
        ]);

        if (!active) return;

        const portfolio =
          portfolioRes.success && Array.isArray(portfolioRes.data)
            ? (portfolioRes.data as PortfolioItem[])
            : [];
        const gallery =
          galleryRes.success && Array.isArray(galleryRes.data)
            ? (galleryRes.data as GalleryItem[])
            : [];

        const related = [
          ...relatedFromPortfolio(service, portfolio),
          ...relatedFromGallery(service, gallery),
        ].slice(0, 3);

        setItems(related);
        setStatus(related.length > 0 ? "ready" : "empty");
      } catch {
        if (!active) return;
        setStatus("error");
      }
    }

    loadRelatedWork();

    return () => {
      active = false;
    };
  }, [service]);

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="related-work-title">
      <div className="sa-container">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-caption text-brand-gold">Related Work</p>
            <h2
              id="related-work-title"
              className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-navy"
            >
              Project references from live data
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
          >
            View all work
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {status === "loading" ? (
          <WorkSkeletons />
        ) : status === "error" ? (
          <div className="rounded-[1.5rem] border border-red-100 bg-red-50 p-7 text-center">
            <RefreshCw className="mx-auto h-7 w-7 text-red-500" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-red-900">Related work could not load</h3>
            <p className="mt-2 text-sm text-red-700">
              The page is still available. Please refresh to retry the portfolio and gallery request.
            </p>
          </div>
        ) : status === "empty" ? (
          <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-8 text-center">
            <ImageOff className="mx-auto h-8 w-8 text-gray-400" aria-hidden="true" />
            <h3 className="mt-3 font-semibold text-brand-navy">No related work published yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Live portfolio or gallery items tagged for {service.label} will appear here once published.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {items.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                className="group overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sa-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/35 hover:shadow-sa-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span className="relative block h-44 overflow-hidden bg-gray-100">
                  <RelatedImage src={item.image} title={item.title} priority={index === 0} />
                  <span className="absolute inset-0 bg-gradient-to-t from-brand-navy/75 via-transparent to-transparent opacity-70" />
                </span>
                <span className="block p-5">
                  {item.meta ? (
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                      {item.meta}
                    </span>
                  ) : null}
                  <span className="mt-2 block font-display text-xl font-semibold text-brand-navy">
                    {item.title}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FaqItem({
  item,
  index,
  open,
  onToggle,
}: {
  item: ServiceDetail["faq"][number];
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const buttonId = `service-faq-${index}-button`;
  const panelId = `service-faq-${index}-panel`;

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 rounded-xl py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      >
        <span className="font-semibold text-brand-navy">{item.question}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-brand-gold transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-smooth motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-sm leading-6 text-gray-500">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function ServiceDetailClient({ service }: { service: ServiceDetail }) {
  const [openFaq, setOpenFaq] = useState(0);
  const Icon = ICONS[service.icon];
  const relatedServices = useMemo(() => getRelatedServices(service), [service]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="relative isolate overflow-hidden bg-brand-deep pt-20 text-white">
          <div className="absolute inset-0 -z-10">
            <Image
              src={service.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-28"
              unoptimized={service.image.endsWith(".svg")}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-deep via-brand-navy/90 to-brand-navy/65" />
          </div>
          <div className="absolute right-12 top-24 hidden h-44 w-44 rounded-full bg-brand-gold/15 blur-[70px] lg:block" aria-hidden="true" />

          <div className="sa-container py-16 sm:py-20 lg:py-24">
            <AnimateIn from="bottom" className="max-w-3xl">
              <nav className="mb-7 flex items-center gap-2 text-sm text-white/55" aria-label="Breadcrumb">
                <Link href="/" className="transition-colors hover:text-brand-gold">
                  Home
                </Link>
                <span aria-hidden="true">/</span>
                <Link href="/services" className="transition-colors hover:text-brand-gold">
                  Services
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white/75">{service.label}</span>
              </nav>

              <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-brand-gold">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {service.category}
              </span>
              <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[0.95] tracking-tight">
                {service.label}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                {service.description}
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={`/quote?service=${encodeURIComponent(service.label)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy shadow-sa-gold transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep motion-reduce:transform-none motion-reduce:transition-none"
                >
                  Request Quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-gold/50 hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep motion-reduce:transform-none motion-reduce:transition-none"
                >
                  View Related Work
                </Link>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section className="bg-[#FAF8F2] py-16 sm:py-20">
          <div className="sa-container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <AnimateIn from="left">
              <p className="text-caption text-brand-gold">Overview</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">
                Built for visibility, durability, and brand trust.
              </h2>
              <p className="mt-5 text-base leading-7 text-gray-600">{service.overview}</p>
            </AnimateIn>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                { title: "Applications", items: service.applications },
                { title: "Benefits", items: service.benefits },
                { title: "Materials", items: service.materials },
                { title: "Process", items: service.process },
              ].map((section, index) => (
                <AnimateIn key={section.title} from="bottom" delay={index * 70}>
                  <div className="h-full rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sa-xs">
                    <h3 className="font-display text-xl font-semibold text-brand-navy">{section.title}</h3>
                    <ul className="mt-5 space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-gray-600">
                          <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <RelatedWork service={service} />

        <section className="bg-gray-50 py-16 sm:py-20" aria-labelledby="service-faq-title">
          <div className="sa-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <AnimateIn from="left">
              <p className="text-caption text-brand-gold">Questions</p>
              <h2
                id="service-faq-title"
                className="mt-3 font-display text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl"
              >
                Frequently asked about {service.shortLabel ?? service.label}
              </h2>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                Clear answers before you begin. For exact pricing and timelines, request a site-specific quote.
              </p>
            </AnimateIn>

            <AnimateIn from="right">
              <div className="rounded-[1.5rem] border border-gray-100 bg-white px-5 shadow-sa-xs sm:px-7">
                {service.faq.map((item, index) => (
                  <FaqItem
                    key={item.question}
                    item={item}
                    index={index}
                    open={openFaq === index}
                    onToggle={() => setOpenFaq(openFaq === index ? -1 : index)}
                  />
                ))}
              </div>
            </AnimateIn>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20" aria-labelledby="related-services-title">
          <div className="sa-container">
            <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-caption text-brand-gold">Explore More</p>
                <h2
                  id="related-services-title"
                  className="mt-2 font-display text-3xl font-semibold tracking-tight text-brand-navy"
                >
                  Related services
                </h2>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold transition-colors hover:text-brand-gold-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                All services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {relatedServices.map((item) => {
                const RelatedIcon = ICONS[item.icon];

                return (
                  <Link
                    key={item.slug}
                    href={`/services/${item.slug}`}
                    className="group rounded-[1.5rem] border border-gray-100 bg-white p-6 shadow-sa-xs transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/35 hover:shadow-sa-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-navy">
                      <RelatedIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="block font-display text-xl font-semibold text-brand-navy">
                      {item.label}
                    </span>
                    <span className="mt-3 block text-sm leading-6 text-gray-500">{item.summary}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-brand-navy py-16 text-white sm:py-20">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-gold/12 blur-[80px]" aria-hidden="true" />
          <div className="sa-container relative z-10 text-center">
            <p className="text-caption text-brand-gold">Start Your Project</p>
            <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Need {service.shortLabel ?? service.label} for your business?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/65">
              Share your requirements and our team will recommend the right materials, lighting, fabrication, and installation approach.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/quote?service=${encodeURIComponent(service.label)}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-sm font-semibold text-brand-navy shadow-sa-gold transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy motion-reduce:transform-none motion-reduce:transition-none"
              >
                Request a Free Quote
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/18 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-gold/50 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy motion-reduce:transform-none motion-reduce:transition-none"
              >
                Contact Shreeji Art
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
