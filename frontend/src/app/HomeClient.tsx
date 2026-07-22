"use client";

import { type ElementType, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  CircleGauge,
  Factory,
  Gem,
  HeartPulse,
  Hotel,
  Layers3,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShoppingBag,
  Star,
  Wrench,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { AnimateIn } from "@/components/ui/animate-in";
import { Skeleton } from "@/components/ui/skeleton";
import { SITE_CONTACT } from "@/lib/contact";
import { cn } from "@/lib/utils";
import type { PortfolioItem, Service, Testimonial } from "@/types";

export type ServicesStatus = "loading" | "ready" | "empty" | "error";
export type PortfolioStatus = "loading" | "ready" | "empty" | "error";

interface HomeClientProps {
  services: Service[];
  servicesStatus?: ServicesStatus;
  portfolio: PortfolioItem[];
  portfolioStatus?: PortfolioStatus;
  testimonials: Testimonial[];
}

interface IconCard {
  icon: ElementType;
  title: string;
  description: string;
}

const HOME_SERVICE_SLUGS = [
  "led-sign-boards",
  "acrylic-signs",
  "3d-letter-signs",
  "acp-signage",
  "stainless-steel-signs",
  "glow-sign-boards",
] as const;

const HOME_SERVICE_API_ALIASES: Partial<Record<(typeof HOME_SERVICE_SLUGS)[number], string[]>> = {
  "led-sign-boards": ["led-signs"],
  "stainless-steel-signs": ["stainless-steel-signage"],
};

const SERVICE_CARD_IMAGES: Record<(typeof HOME_SERVICE_SLUGS)[number], string> = {
  "led-sign-boards": "/gallery/led-sign/led-sign-01.svg",
  "acrylic-signs": "/gallery/acrylic/acrylic-01.svg",
  "3d-letter-signs": "/gallery/3d-letters/3d-letters-01.svg",
  "acp-signage": "/gallery/acp/acp-01.svg",
  "stainless-steel-signs": "/gallery/stainless-steel/stainless-steel-01.svg",
  "glow-sign-boards": "/gallery/glow-sign/glow-sign-01.svg",
};

const SERVICE_DISPLAY_NAMES: Record<(typeof HOME_SERVICE_SLUGS)[number], string> = {
  "led-sign-boards": "LED Sign Boards",
  "acrylic-signs": "Acrylic Signs",
  "3d-letter-signs": "3D Letter Signs",
  "acp-signage": "ACP Signage",
  "stainless-steel-signs": "Stainless Steel Signs",
  "glow-sign-boards": "Glow Sign Boards",
};

const PORTFOLIO_FILTERS = [
  { label: "All", keys: [] },
  { label: "Retail", keys: ["retail", "store", "shop", "showroom"] },
  { label: "Corporate", keys: ["corporate", "office", "hq", "workspace"] },
  { label: "Hospitals", keys: ["hospital", "healthcare", "clinic", "diagnostic"] },
  { label: "Hotels", keys: ["hotel", "hospitality", "resort"] },
  { label: "Restaurants", keys: ["restaurant", "cafe", "food"] },
  { label: "Industrial", keys: ["industrial", "factory", "warehouse", "plant"] },
] as const;

const PORTFOLIO_FALLBACK_IMAGES = [
  "/gallery/led-sign/led-sign-02.svg",
  "/gallery/retail-branding/retail-branding-01.svg",
  "/gallery/office-branding/office-branding-01.svg",
  "/gallery/acp/acp-02.svg",
  "/gallery/3d-letters/3d-letters-02.svg",
  "/gallery/industrial-signage/industrial-signage-01.svg",
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    customerName: "Rajesh Patel",
    company: "Patel Jewellers",
    content:
      "Shreeji Art transformed our showroom frontage. The finish, lighting, and installation quality felt genuinely premium.",
    rating: 5,
    displayOrder: 1,
  },
  {
    id: 2,
    customerName: "Priya Shah",
    company: "Spice Route Restaurant",
    content:
      "The 3D backlit letters changed how our restaurant looks at night. Their team handled every detail with care.",
    rating: 5,
    displayOrder: 2,
  },
  {
    id: 3,
    customerName: "Amit Desai",
    company: "Desai & Associates",
    content:
      "From measurement to installation, everything was precise. Our reception signage now feels like a real brand asset.",
    rating: 5,
    displayOrder: 3,
  },
];

const INDUSTRIES: IconCard[] = [
  { icon: ShoppingBag, title: "Retail & Fashion", description: "Storefronts, fascias, display zones" },
  { icon: Hotel, title: "Hospitality", description: "Hotels, restaurants, cafes, resorts" },
  { icon: HeartPulse, title: "Healthcare", description: "Hospitals, clinics, diagnostics" },
  { icon: BookOpen, title: "Education", description: "Schools, institutes, campuses" },
  { icon: Briefcase, title: "Corporate", description: "HQs, offices, IT parks" },
  { icon: Factory, title: "Industrial", description: "Factories, warehouses, plants" },
];

const WHY_CHOOSE_US: IconCard[] = [
  {
    icon: Gem,
    title: "Premium material discipline",
    description: "We specify acrylic, ACP, steel, LEDs, and finishes for long-term outdoor performance.",
  },
  {
    icon: Factory,
    title: "In-house manufacturing",
    description: "Design, fabrication, assembly, and finishing stay under one accountable workshop process.",
  },
  {
    icon: CircleGauge,
    title: "Measured installation",
    description: "Site survey, structure checks, electrical testing, and clean handover are built into delivery.",
  },
];

const PROCESS_STEPS = [
  {
    label: "01",
    icon: MessageSquare,
    title: "Consult",
    description: "We study your location, visibility needs, brand guidelines, and installation constraints.",
  },
  {
    label: "02",
    icon: Layers3,
    title: "Design",
    description: "Concepts, materials, lighting, scale, and fabrication details are aligned before production.",
  },
  {
    label: "03",
    icon: Wrench,
    title: "Manufacture",
    description: "Your signage is cut, formed, wired, finished, assembled, and checked in our workshop.",
  },
  {
    label: "04",
    icon: BadgeCheck,
    title: "Install",
    description: "Our team installs, tests, cleans the site, and hands over a finished brand asset.",
  },
];

const HERO_TRUST_POINTS = [
  "Premium Quality",
  "Custom Designs",
  "Timely Delivery",
  "Expert Installation",
];

const PREMIUM_TRANSITION =
  "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none";

function firstImage(item: PortfolioItem) {
  return item.images?.find(Boolean);
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

function IconBadge({ icon: Icon }: { icon: ElementType }) {
  return (
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-brand-gold shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${PREMIUM_TRANSITION} group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:border-brand-gold/30 group-hover:bg-brand-gold/10`}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  inverted?: boolean;
}) {
  return (
    <AnimateIn from="bottom" className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
        {eyebrow}
      </p>
      <h2
        className={`font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl ${
          inverted ? "text-white" : "text-brand-navy"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mx-auto mt-5 max-w-2xl text-base leading-8 ${inverted ? "text-white/55" : "text-gray-500"}`}>
          {description}
        </p>
      ) : null}
    </AnimateIn>
  );
}

function getHomepageServices(services: Service[]) {
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]));

  return HOME_SERVICE_SLUGS
    .map((slug) => {
      const liveService =
        servicesBySlug.get(slug) ??
        HOME_SERVICE_API_ALIASES[slug]?.map((alias) => servicesBySlug.get(alias)).find(Boolean);

      return liveService ? { service: liveService, detailSlug: slug } : null;
    })
    .filter(
      (item): item is { service: Service; detailSlug: (typeof HOME_SERVICE_SLUGS)[number] } =>
        Boolean(item)
    );
}

function ServicesSkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sa-xs"
        >
          <Skeleton className="h-56 rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton variant="text" className="w-2/3" />
            <Skeleton variant="text" className="w-full h-3" />
            <Skeleton variant="text" className="w-3/4 h-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function projectSearchText(project: PortfolioItem) {
  return [
    project.title,
    project.description,
    project.clientName ?? "",
    project.service?.name ?? "",
    ...(project.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();
}

function matchesPortfolioFilter(project: PortfolioItem, filter: (typeof PORTFOLIO_FILTERS)[number]) {
  if (filter.label === "All") return true;

  const searchText = projectSearchText(project);
  return filter.keys.some((key) => searchText.includes(key));
}

function projectTimestamp(project: PortfolioItem) {
  const dateFields = project as PortfolioItem & {
    createdAt?: string;
    updatedAt?: string;
  };
  const dateValue = dateFields.createdAt ?? dateFields.updatedAt;
  const parsedDate = dateValue ? Date.parse(dateValue) : Number.NaN;

  if (Number.isFinite(parsedDate)) return parsedDate;
  return project.id;
}

function sortNewestPortfolio(projects: PortfolioItem[]) {
  return [...projects].sort((a, b) => {
    const newestDelta = projectTimestamp(b) - projectTimestamp(a);
    if (newestDelta !== 0) return newestDelta;

    return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
  });
}

function projectCategory(project: PortfolioItem) {
  const searchText = projectSearchText(project);
  const matchedFilter = PORTFOLIO_FILTERS.find(
    (filter) => filter.label !== "All" && filter.keys.some((key) => searchText.includes(key))
  );

  return matchedFilter?.label ?? project.service?.name ?? project.tags?.[0] ?? "Signage";
}

function projectCity(project: PortfolioItem) {
  const locationSource = [
    project.description,
    project.clientName ?? "",
    ...(project.tags ?? []),
  ].join(" ");
  const knownCities = ["Ahmedabad", "Gandhinagar", "Vadodara", "Surat", "Rajkot"];
  const matchedCity = knownCities.find((city) =>
    locationSource.toLowerCase().includes(city.toLowerCase())
  );

  return matchedCity ?? "Gujarat";
}

function PortfolioSkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.05]"
        >
          <Skeleton className="h-72 rounded-none" />
        </div>
      ))}
    </div>
  );
}

export default function HomeClient({
  services,
  servicesStatus = "ready",
  portfolio,
  portfolioStatus = "ready",
  testimonials,
}: HomeClientProps) {
  const homepageServices = getHomepageServices(services);
  const resolvedServicesStatus =
    servicesStatus === "ready" && homepageServices.length === 0 ? "empty" : servicesStatus;
  const [activePortfolioFilter, setActivePortfolioFilter] = useState("All");
  const sortedPortfolio = useMemo(() => sortNewestPortfolio(portfolio), [portfolio]);
  const filteredPortfolio = useMemo(() => {
    const filter =
      PORTFOLIO_FILTERS.find((item) => item.label === activePortfolioFilter) ??
      PORTFOLIO_FILTERS[0];

    return sortedPortfolio.filter((project) => matchesPortfolioFilter(project, filter));
  }, [activePortfolioFilter, sortedPortfolio]);
  const resolvedPortfolioStatus =
    portfolioStatus === "ready" && sortedPortfolio.length === 0 ? "empty" : portfolioStatus;
  const displayTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
        <section className="relative isolate overflow-hidden bg-[#05050c]">
          <Image
            src="/gallery/led-sign/led-sign-02.svg"
            alt="Premium illuminated commercial signage background"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(212,160,23,0.22),transparent_30%),linear-gradient(90deg,rgba(5,5,12,0.98)_0%,rgba(10,10,24,0.86)_46%,rgba(10,10,24,0.68)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/35 via-transparent to-brand-navy/90" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.22) 1px,transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div
            className="absolute left-10 top-24 h-80 w-80 animate-pulse-subtle rounded-full bg-brand-gold/15 blur-[120px] motion-reduce:animate-none"
            aria-hidden="true"
          />

          <div className="container-full relative z-10 flex min-h-[calc(100vh-4rem)] items-center py-24 sm:py-28 lg:py-32">
            <div className="max-w-4xl text-center lg:text-left">
              <AnimateIn from="fade">
                <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-brand-gold/25 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-brand-gold shadow-[0_0_18px_rgba(212,160,23,.95)]" />
                  Premium Signage Solutions
                </div>
              </AnimateIn>

              <AnimateIn from="bottom" delay={80}>
                <h1 className="font-display text-[clamp(3.35rem,8vw,7.25rem)] font-bold leading-[0.9] tracking-[-0.055em] text-white drop-shadow-[0_24px_60px_rgba(0,0,0,0.55)]">
                  <span className="block">We Design.</span>
                  <span className="block">We Manufacture.</span>
                  <span className="block bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold bg-clip-text text-transparent">
                    We Make You Visible.
                  </span>
                </h1>
              </AnimateIn>

              <AnimateIn from="bottom" delay={160}>
                <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/72 sm:text-lg lg:mx-0">
                  From concept to installation, we create high-quality signage that
                  builds your brand and attracts attention.
                </p>
              </AnimateIn>

              <AnimateIn from="bottom" delay={240}>
                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link
                    href="/quote"
                    className={`group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gold px-7 py-4 text-sm font-bold text-white shadow-[0_18px_60px_rgba(212,160,23,.25)] ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:bg-brand-gold-dark hover:shadow-[0_22px_70px_rgba(212,160,23,.34)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-brand-gold`}
                  >
                    Get a Free Quote
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/portfolio"
                    className={`inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white backdrop-blur ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:border-brand-gold/40 hover:bg-white/[0.08] active:translate-y-0 active:scale-[0.99]`}
                  >
                    Explore Our Work
                  </Link>
                </div>
              </AnimateIn>

              <AnimateIn from="bottom" delay={320}>
                <div className="mt-12 flex flex-wrap justify-center gap-3 lg:justify-start">
                  {HERO_TRUST_POINTS.map((point) => (
                    <span
                      key={point}
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-white/78 backdrop-blur"
                    >
                      <BadgeCheck className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                      {point}
                    </span>
                  ))}
                </div>
              </AnimateIn>
            </div>
          </div>
        </section>

        <section id="services" className="relative overflow-hidden bg-[#f8f5ed] py-24 sm:py-28">
          <div
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/30 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-brand-gold/10 blur-[110px]"
            aria-hidden="true"
          />
          <div className="container-wide relative">
            <div className="mb-12 flex flex-col gap-6 lg:mb-16 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <AnimateIn from="bottom">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                    Services We Offer
                  </p>
                  <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-brand-navy sm:text-5xl">
                    High-Quality Signage Solutions
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600">
                    From illuminated storefronts to refined interior branding, our
                    team builds signage with precise materials, premium finishing,
                    and installation-ready detailing.
                  </p>
                </AnimateIn>
              </div>
              <AnimateIn from="bottom" delay={120}>
                <Link
                  href="/services"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-gold/30 bg-brand-navy px-6 py-3 text-sm font-bold text-white shadow-sa-sm ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:border-brand-gold hover:bg-brand-navy-light hover:shadow-sa-md active:translate-y-0`}
                >
                  View All Services
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
              </AnimateIn>
            </div>

            {resolvedServicesStatus === "loading" ? (
              <ServicesSkeletonGrid />
            ) : resolvedServicesStatus === "error" ? (
              <div
                role="alert"
                className="rounded-[1.75rem] border border-red-200 bg-white p-8 text-center shadow-sa-sm"
              >
                <p className="font-display text-2xl font-bold text-brand-navy">
                  Services could not be loaded.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
                  Please refresh the page or visit the full services page to explore
                  Shreeji Art&apos;s signage capabilities.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold-dark"
                >
                  Open Services
                </Link>
              </div>
            ) : resolvedServicesStatus === "empty" ? (
              <div className="rounded-[1.75rem] border border-brand-gold/20 bg-white p-8 text-center shadow-sa-sm">
                <p className="font-display text-2xl font-bold text-brand-navy">
                  Services are being prepared.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500">
                  No homepage services are available right now. You can still view
                  the complete services page for the current offering.
                </p>
                <Link
                  href="/services"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-navy-light"
                >
                  View All Services
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {homepageServices.map(({ service, detailSlug }, index) => {
                  const slug = detailSlug;
                  const image = SERVICE_CARD_IMAGES[slug];
                  const displayName = SERVICE_DISPLAY_NAMES[slug] ?? service.name;

                  return (
                    <AnimateIn key={service.id} from="bottom" delay={index * 65}>
                      <Link
                        href={`/services/${detailSlug}`}
                        className={`group relative block min-h-[24rem] overflow-hidden rounded-[1.75rem] border border-white bg-brand-navy shadow-sa-sm ${PREMIUM_TRANSITION} hover:-translate-y-1.5 hover:border-brand-gold hover:shadow-sa-premium active:translate-y-0`}
                      >
                        <Image
                          src={image}
                          alt={`${displayName} by Shreeji Art`}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-b from-brand-navy/20 via-brand-navy/48 to-brand-navy/95 transition-colors duration-500 group-hover:from-brand-navy/10 group-hover:via-brand-navy/36 group-hover:to-brand-navy"
                          aria-hidden="true"
                        />
                        <div
                          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          aria-hidden="true"
                        />
                        <div className="relative flex min-h-[24rem] flex-col justify-end p-6">
                          <div className="mb-5 h-10 w-10 rounded-full border border-brand-gold/25 bg-brand-gold/10 backdrop-blur transition duration-300 group-hover:bg-brand-gold group-hover:text-brand-navy">
                            <ArrowRight
                              className="m-2.5 h-5 w-5 text-brand-gold transition duration-300 group-hover:translate-x-0.5 group-hover:text-brand-navy motion-reduce:transition-none motion-reduce:transform-none"
                              aria-hidden="true"
                            />
                          </div>
                          <h3 className="font-display text-2xl font-bold leading-tight text-white">
                            {displayName}
                          </h3>
                          <p className="mt-3 line-clamp-2 text-sm leading-7 text-white/62">
                            {service.shortDescription}
                          </p>
                          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-gold">
                            Learn More
                            <ArrowRight
                              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                              aria-hidden="true"
                            />
                          </span>
                        </div>
                      </Link>
                    </AnimateIn>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section id="projects" className="relative overflow-hidden bg-[#090914] py-24 sm:py-28">
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,.14),transparent_34%),linear-gradient(180deg,#090914_0%,#060610_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.32) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.32) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
            }}
            aria-hidden="true"
          />
          <div className="container-wide relative">
            <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <AnimateIn from="bottom">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                    Our Portfolio
                  </p>
                  <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                    Some of Our Recent Works
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">
                    A visual selection of storefront signage, corporate branding,
                    illuminated letters, and manufacturing-led installations.
                  </p>
                </AnimateIn>
              </div>

              <AnimateIn from="bottom" delay={100}>
                <Link
                  href="/portfolio"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gold px-6 py-3 text-sm font-bold text-white shadow-sa-sm ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:bg-brand-gold-light hover:text-brand-navy hover:shadow-sa-gold active:translate-y-0`}
                >
                  View Complete Portfolio
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                    aria-hidden="true"
                  />
                </Link>
              </AnimateIn>
            </div>

            <AnimateIn from="bottom" delay={140}>
              <div
                className="mb-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible sm:pb-0"
                aria-label="Filter recent work by category"
              >
                {PORTFOLIO_FILTERS.map((filter) => {
                  const active = activePortfolioFilter === filter.label;

                  return (
                    <button
                      key={filter.label}
                      type="button"
                      onClick={() => setActivePortfolioFilter(filter.label)}
                      className={cn(
                        "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy",
                        active
                          ? "border-brand-gold bg-brand-gold text-white shadow-sa-gold"
                          : "border-white/12 bg-white/[0.04] text-white/70 hover:border-brand-gold/45 hover:bg-white/[0.08] hover:text-white"
                      )}
                      aria-pressed={active}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </AnimateIn>

            {resolvedPortfolioStatus === "loading" ? (
              <PortfolioSkeletonGrid />
            ) : resolvedPortfolioStatus === "error" ? (
              <div
                role="alert"
                className="rounded-[1.75rem] border border-red-400/20 bg-white/[0.06] p-8 text-center backdrop-blur"
              >
                <p className="font-display text-2xl font-bold text-white">
                  Portfolio could not be loaded.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
                  Please refresh the page or open the full portfolio to view recent
                  signage projects.
                </p>
                <Link
                  href="/portfolio"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold-light hover:text-brand-navy"
                >
                  Open Portfolio
                </Link>
              </div>
            ) : resolvedPortfolioStatus === "empty" ? (
              <div className="rounded-[1.75rem] border border-brand-gold/20 bg-white/[0.06] p-8 text-center backdrop-blur">
                <p className="font-display text-2xl font-bold text-white">
                  Recent work is being curated.
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/55">
                  Portfolio projects are not available on the homepage yet. Visit
                  the complete portfolio page for the latest work.
                </p>
                <Link
                  href="/portfolio"
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand-gold px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-gold-light hover:text-brand-navy"
                >
                  View Complete Portfolio
                </Link>
              </div>
            ) : filteredPortfolio.length === 0 ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur">
                <p className="font-display text-2xl font-bold text-white">
                  No projects in this category yet.
                </p>
                <p className="mt-3 text-sm leading-7 text-white/55">
                  Try All to see every recent portfolio project.
                </p>
              </div>
            ) : (
              <div className="grid auto-rows-[18rem] gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPortfolio.slice(0, 9).map((project, index) => {
                  const projectImage =
                    firstImage(project) ??
                    PORTFOLIO_FALLBACK_IMAGES[index % PORTFOLIO_FALLBACK_IMAGES.length];
                  const isLarge = index === 0 || index === 5;

                  return (
                    <AnimateIn key={project.id} from="bottom" delay={index * 55}>
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className={cn(
                          `group relative block h-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-brand-navy shadow-2xl ${PREMIUM_TRANSITION} hover:-translate-y-1.5 hover:border-brand-gold hover:shadow-sa-premium active:translate-y-0`,
                          isLarge && "lg:row-span-2"
                        )}
                        aria-label={`View project: ${project.title}`}
                      >
                        <Image
                          src={projectImage}
                          alt={`${project.title} signage project`}
                          fill
                          sizes={
                            isLarge
                              ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          }
                          className="object-cover transition duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:transform-none"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 via-brand-navy/20 to-brand-navy/90 transition-colors duration-500 group-hover:from-brand-navy/15 group-hover:via-brand-navy/48 group-hover:to-brand-navy"
                          aria-hidden="true"
                        />
                        <div
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          aria-hidden="true"
                        >
                          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/80 to-transparent" />
                          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-gold/20 blur-3xl" />
                        </div>
                        <div className="relative flex h-full flex-col justify-end p-5 sm:p-6">
                          <div className="translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none motion-reduce:transform-none">
                            <div className="mb-4 flex flex-wrap gap-2">
                              <span className="rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-gold backdrop-blur">
                                {projectCategory(project)}
                              </span>
                              <span className="rounded-full border border-white/12 bg-white/[0.07] px-3 py-1 text-[11px] font-semibold text-white/70 backdrop-blur">
                                {projectCity(project)}
                              </span>
                            </div>
                            <h3 className="font-display text-2xl font-bold leading-tight text-white">
                              {project.title}
                            </h3>
                            <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-gold">
                              View Project
                              <ArrowRight
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                                aria-hidden="true"
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </AnimateIn>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section id="industries" className="bg-gray-50 py-24">
          <div className="container-wide">
            <SectionHeading
              eyebrow="Industries served"
              title="Visibility systems for high-expectation environments."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {INDUSTRIES.map((industry, index) => {
                const Icon = industry.icon;
                return (
                  <AnimateIn key={industry.title} from="bottom" delay={index * 50}>
                    <div className={`group flex items-start gap-4 rounded-[1.5rem] border border-gray-200 bg-white p-5 ${PREMIUM_TRANSITION} hover:-translate-y-1 hover:border-brand-gold/30 hover:shadow-sa-md`}>
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold ${PREMIUM_TRANSITION} group-hover:scale-105 group-hover:bg-brand-gold group-hover:text-white`}>
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-3deg] motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-bold text-brand-navy">{industry.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-500">{industry.description}</p>
                      </div>
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        <section id="why-us" className="bg-white py-24 sm:py-28">
          <div className="container-wide">
            <SectionHeading
              eyebrow="Why choose us"
              title="A signage partner with workshop accountability."
              description="Premium signage is not only a design problem. It is a measurement, material, fabrication, lighting, and installation problem too."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {WHY_CHOOSE_US.map((reason, index) => (
                <AnimateIn key={reason.title} from="bottom" delay={index * 90}>
                  <div className={`group h-full rounded-[1.75rem] border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-7 ${PREMIUM_TRANSITION} hover:-translate-y-1.5 hover:border-brand-gold/30 hover:shadow-sa-lg`}>
                    <IconBadge icon={reason.icon} />
                    <h3 className="mt-8 text-xl font-bold text-brand-navy">{reason.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-gray-500">{reason.description}</p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="relative overflow-hidden bg-[#060610] py-24 sm:py-28">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:56px_56px]" aria-hidden="true" />
          <div className="container-wide relative">
            <SectionHeading
              eyebrow="Manufacturing process"
              title="From site measurement to illuminated handover."
              description="A controlled four-stage process that keeps creative ambition aligned with build quality."
              inverted
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {PROCESS_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <AnimateIn key={step.label} from="bottom" delay={index * 80}>
                    <div className={`group relative h-full rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 backdrop-blur ${PREMIUM_TRANSITION} hover:-translate-y-1.5 hover:border-brand-gold/30 hover:bg-white/[0.065]`}>
                      <span className="font-mono text-xs font-bold tracking-[0.22em] text-brand-gold">{step.label}</span>
                      <div className={`mt-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-brand-gold/10 text-brand-gold ${PREMIUM_TRANSITION} group-hover:scale-105 group-hover:bg-brand-gold group-hover:text-white`}>
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-3deg] motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
                      </div>
                      <h3 className="mt-7 text-lg font-bold text-white">{step.title}</h3>
                      <p className="mt-4 text-sm leading-7 text-white/45">{step.description}</p>
                      {index < PROCESS_STEPS.length - 1 ? (
                        <span className="absolute right-[-0.65rem] top-1/2 hidden h-px w-5 bg-brand-gold/30 lg:block" aria-hidden="true" />
                      ) : null}
                    </div>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-gray-50 py-24 sm:py-28">
          <div className="container-wide">
            <SectionHeading
              eyebrow="Testimonials"
              title="Trusted by teams who care how their brand appears."
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {displayTestimonials.slice(0, 3).map((testimonial, index) => {
                const rating = Math.max(0, Math.min(5, testimonial.rating));
                return (
                  <AnimateIn key={testimonial.id} from="bottom" delay={index * 90}>
                    <figure className={`group flex h-full flex-col justify-between rounded-[1.75rem] border border-gray-200 bg-white p-7 shadow-sa-xs ${PREMIUM_TRANSITION} hover:-translate-y-1.5 hover:border-brand-gold/30 hover:shadow-sa-lg`}>
                      <div>
                        <div className="mb-6 flex gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
                          {Array.from({ length: 5 }).map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`h-4 w-4 ${
                                starIndex < rating ? "fill-brand-gold text-brand-gold" : "fill-gray-200 text-gray-200"
                              }`}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <blockquote className="text-base leading-8 text-gray-600">
                          &ldquo;{testimonial.content}&rdquo;
                        </blockquote>
                      </div>
                      <figcaption className="mt-8 flex items-center gap-3 border-t border-gray-100 pt-6">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold/10 text-sm font-bold text-brand-gold ${PREMIUM_TRANSITION} group-hover:scale-105 group-hover:bg-brand-gold group-hover:text-white`}>
                          {initials(testimonial.customerName)}
                        </span>
                        <span>
                          <span className="block font-bold text-brand-navy">{testimonial.customerName}</span>
                          {testimonial.company ? (
                            <span className="block text-sm text-gray-400">{testimonial.company}</span>
                          ) : null}
                        </span>
                      </figcaption>
                    </figure>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-brand-navy py-24 sm:py-28">
          <div className="absolute -right-24 -top-24 h-96 w-96 animate-pulse-subtle rounded-full bg-brand-gold/10 blur-[110px] motion-reduce:animate-none" aria-hidden="true" />
          <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-white/5 blur-[90px]" aria-hidden="true" />
          <div className="container-narrow relative text-center">
            <AnimateIn from="bottom">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                Start your signage project
              </p>
              <h2 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
                Build a sign your customers remember.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-white/55">
                Get a free consultation, site guidance, and quote for your next signage or branding project.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/quote"
                  className={`group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gold px-7 py-4 text-sm font-bold text-white shadow-[0_18px_60px_rgba(212,160,23,.25)] ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:bg-brand-gold-dark hover:shadow-[0_22px_70px_rgba(212,160,23,.34)] active:translate-y-0 active:scale-[0.99]`}
                >
                  Request a quote
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:border-brand-gold/40 hover:bg-white/[0.08] active:translate-y-0 active:scale-[0.99]`}
                >
                  Talk to the team
                </Link>
              </div>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 text-sm text-white/45 sm:flex-row sm:gap-6">
                <a href={SITE_CONTACT.phoneHref} className="inline-flex items-center gap-2 transition duration-300 hover:-translate-y-0.5 hover:text-brand-gold motion-reduce:transition-none motion-reduce:transform-none">
                  <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  {SITE_CONTACT.phone}
                </a>
                <a href={SITE_CONTACT.emailHref} className="inline-flex items-center gap-2 transition duration-300 hover:-translate-y-0.5 hover:text-brand-gold motion-reduce:transition-none motion-reduce:transform-none">
                  <Mail className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  {SITE_CONTACT.email}
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  {SITE_CONTACT.shortLocation}
                </span>
              </div>
            </AnimateIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
