import type { ElementType } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  CircleGauge,
  Factory,
  Gem,
  HeartPulse,
  Hotel,
  Layers3,
  Lightbulb,
  Mail,
  MapPin,
  MessageSquare,
  Navigation,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Type,
  Wrench,
} from "lucide-react";

import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { AnimateIn } from "@/components/ui/animate-in";
import type { PortfolioItem, Service, Testimonial } from "@/types";

interface HomeClientProps {
  services: Service[];
  portfolio: PortfolioItem[];
  testimonials: Testimonial[];
}

interface IconCard {
  icon: ElementType;
  title: string;
  description: string;
}

const SERVICE_ICONS: Record<string, ElementType> = {
  "led-signs": Lightbulb,
  "acrylic-signs": Layers3,
  "3d-letter-signs": Type,
  "acp-signage": Building2,
  "stainless-steel-signage": ShieldCheck,
  "glow-sign-boards": Sparkles,
  "office-branding": Briefcase,
  "wayfinding-signs": Navigation,
  "retail-branding": Store,
  "industrial-signage": Factory,
};

const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    name: "LED Signs",
    slug: "led-signs",
    shortDescription: "Energy-efficient illuminated signs engineered for storefront visibility.",
    description: "",
    displayOrder: 1,
  },
  {
    id: 2,
    name: "Acrylic Signs",
    slug: "acrylic-signs",
    shortDescription: "Precision-cut acrylic letters with polished premium finishes.",
    description: "",
    displayOrder: 2,
  },
  {
    id: 3,
    name: "3D Letter Signs",
    slug: "3d-letter-signs",
    shortDescription: "Dimensional brand lettering in metal, acrylic, and backlit formats.",
    description: "",
    displayOrder: 3,
  },
  {
    id: 4,
    name: "ACP Signage",
    slug: "acp-signage",
    shortDescription: "Durable aluminium composite panels for facades and hoardings.",
    description: "",
    displayOrder: 4,
  },
  {
    id: 5,
    name: "Stainless Steel Signage",
    slug: "stainless-steel-signage",
    shortDescription: "Brushed and mirror steel signage for high-trust environments.",
    description: "",
    displayOrder: 5,
  },
  {
    id: 6,
    name: "Glow Sign Boards",
    slug: "glow-sign-boards",
    shortDescription: "Cost-effective illuminated boards built for day-and-night recall.",
    description: "",
    displayOrder: 6,
  },
  {
    id: 7,
    name: "Office Branding",
    slug: "office-branding",
    shortDescription: "Reception walls, cabin graphics, and interior brand systems.",
    description: "",
    displayOrder: 7,
  },
  {
    id: 8,
    name: "Wayfinding Systems",
    slug: "wayfinding-signs",
    shortDescription: "Clear navigation systems for hospitals, offices, campuses, and malls.",
    description: "",
    displayOrder: 8,
  },
];

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  {
    id: 1,
    title: "Luxury Hotel Facade",
    slug: "luxury-hotel-facade",
    clientName: "The Grand Residency",
    description: "Illuminated facade signage and a premium entrance identity for a five-star property.",
    tags: ["LED Signs", "Facade", "Hospitality"],
    images: [],
    isFeatured: true,
  },
  {
    id: 2,
    title: "Retail Chain Rollout",
    slug: "retail-chain-rollout",
    clientName: "Westside Retail",
    description: "Standardized storefront signage, ACP panels, and dimensional letters across Gujarat.",
    tags: ["Retail", "ACP", "3D Letters"],
    images: [],
    isFeatured: true,
  },
  {
    id: 3,
    title: "Corporate HQ Branding",
    slug: "corporate-hq-branding",
    clientName: "TechSpace Gujarat",
    description: "Reception branding, wayfinding, wall graphics, and premium workspace identity.",
    tags: ["Office Branding", "Wayfinding"],
    images: [],
    isFeatured: true,
  },
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

const HERO_STATS = [
  { value: "500+", label: "projects fabricated" },
  { value: "10+", label: "years in signage" },
  { value: "200+", label: "brands served" },
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

export default function HomeClient({ services, portfolio, testimonials }: HomeClientProps) {
  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;
  const displayPortfolio = portfolio.length > 0 ? portfolio : DEFAULT_PORTFOLIO;
  const displayTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <main>
        <section className="relative isolate overflow-hidden bg-[#05050c]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,160,23,0.16),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(80,92,160,0.14),transparent_28%),linear-gradient(135deg,#05050c_0%,#121225_52%,#07070f_100%)]" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.22) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.22) 1px,transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />
          <div
            className="absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 animate-pulse-subtle rounded-full bg-brand-gold/10 blur-[120px] motion-reduce:animate-none"
            aria-hidden="true"
          />

          <div className="container-full relative z-10 grid min-h-[calc(100vh-72px)] items-center gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <div className="text-center lg:text-left">
              <AnimateIn from="fade">
                <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold backdrop-blur">
                  <span className="h-2 w-2 rounded-full bg-brand-gold shadow-[0_0_18px_rgba(212,160,23,.95)]" />
                  Premium signage company
                </div>
              </AnimateIn>

              <AnimateIn from="bottom" delay={80}>
                <h1 className="font-display text-[clamp(3rem,8vw,6.8rem)] font-bold leading-[0.94] tracking-[-0.055em] text-white">
                  Signs built with
                  <span className="block bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold bg-clip-text text-transparent">
                    manufacturing precision.
                  </span>
                </h1>
              </AnimateIn>

              <AnimateIn from="bottom" delay={160}>
                <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-white/60 sm:text-lg lg:mx-0">
                  Shreeji Art designs, manufactures, and installs LED signs, acrylic letters,
                  ACP facades, 3D lettering, office branding, and wayfinding systems for
                  Ahmedabad&apos;s most ambitious brands.
                </p>
              </AnimateIn>

              <AnimateIn from="bottom" delay={240}>
                <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Link
                    href="/quote"
                    className={`group inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-gold px-7 py-4 text-sm font-bold text-white shadow-[0_18px_60px_rgba(212,160,23,.25)] ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:bg-brand-gold-dark hover:shadow-[0_22px_70px_rgba(212,160,23,.34)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-brand-gold`}
                  >
                    Get a free quote
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/portfolio"
                    className={`inline-flex items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white backdrop-blur ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:border-brand-gold/40 hover:bg-white/[0.08] active:translate-y-0 active:scale-[0.99]`}
                  >
                    View featured work
                  </Link>
                </div>
              </AnimateIn>

              <AnimateIn from="bottom" delay={320}>
                <div className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 text-left">
                  {HERO_STATS.map((stat) => (
                    <div key={stat.label} className="bg-white/[0.045] p-4 sm:p-5">
                      <p className="font-display text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/40">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </AnimateIn>
            </div>

            <AnimateIn from="right" delay={220} className="relative">
              <div className="relative mx-auto max-w-xl">
                <div className="absolute -inset-8 rounded-[3rem] bg-brand-gold/10 blur-3xl" aria-hidden="true" />
                <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/[0.055] p-4 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-[1.5rem] border border-white/10 bg-[#070711] p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-brand-gold">Workshop board</p>
                        <p className="mt-1 text-sm text-white/45">Live production snapshot</p>
                      </div>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Active
                      </span>
                    </div>
                    <div className="space-y-3">
                      {["LED channel letters", "ACP facade panels", "Reception logo wall"].map((job, index) => (
                        <div
                          key={job}
                          className={`group rounded-2xl border border-white/8 bg-white/[0.04] p-4 ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:border-brand-gold/30 hover:bg-white/[0.07]`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="font-semibold text-white">{job}</p>
                              <p className="mt-1 text-xs text-white/40">
                                {index === 0 ? "CNC routing" : index === 1 ? "Powder coat finish" : "Final assembly"}
                              </p>
                            </div>
                            <Factory className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                          </div>
                          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-brand-gold to-brand-gold-light transition-[width,filter] duration-700 ease-out group-hover:brightness-110 motion-reduce:transition-none"
                              style={{ width: `${78 - index * 18}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>

          <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/35 sm:flex" aria-hidden="true">
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">Scroll</span>
            <ChevronDown className="h-4 w-4 animate-bounce-sm motion-reduce:animate-none" />
          </div>
        </section>

        <section id="services" className="bg-white py-24 sm:py-28">
          <div className="container-wide">
            <SectionHeading
              eyebrow="Services preview"
              title="Engineered signage for every brand surface."
              description="Reusable signage systems, high-visibility facades, refined interiors, and dependable manufacturing from one Ahmedabad workshop."
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {displayServices.slice(0, 8).map((service, index) => {
                const Icon = SERVICE_ICONS[service.slug] ?? Sparkles;
                return (
                  <AnimateIn key={service.id} from="bottom" delay={index * 55}>
                    <Link
                      href={`/services/${service.slug}`}
                      className={`group flex h-full flex-col rounded-[1.5rem] border border-gray-200 bg-white p-5 shadow-sa-xs ${PREMIUM_TRANSITION} hover:-translate-y-1.5 hover:border-brand-gold/30 hover:shadow-sa-lg active:translate-y-0`}
                    >
                      <span className={`mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold/10 text-brand-gold ${PREMIUM_TRANSITION} group-hover:scale-105 group-hover:bg-brand-gold group-hover:text-white`}>
                        <Icon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-[-3deg] motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
                      </span>
                      <h3 className="text-base font-bold text-brand-navy transition-colors group-hover:text-brand-gold">
                        {service.name}
                      </h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-gray-500">
                        {service.shortDescription}
                      </p>
                    </Link>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>

        <section id="projects" className="relative overflow-hidden bg-[#090914] py-24 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,160,23,.13),transparent_34%)]" aria-hidden="true" />
          <div className="container-wide relative">
            <SectionHeading
              eyebrow="Featured projects"
              title="Built for brands that need to be seen."
              description="Selected work across facades, retail rollouts, corporate interiors, and high-recall illuminated signage."
              inverted
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {displayPortfolio.slice(0, 3).map((project, index) => {
                const projectImage = firstImage(project);

                return (
                  <AnimateIn key={project.id} from="bottom" delay={index * 90}>
                    <article
                      className={`group relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] p-6 shadow-2xl ${PREMIUM_TRANSITION} hover:-translate-y-1.5 hover:border-brand-gold/30 hover:shadow-[0_30px_90px_rgba(0,0,0,0.35)]`}
                    >
                      {projectImage ? (
                        <Image
                          src={projectImage}
                          alt={`${project.title} signage project for ${project.clientName}`}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover opacity-45 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-55 motion-reduce:transition-none motion-reduce:transform-none"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#090914]/35 via-[#090914]/70 to-[#090914]" aria-hidden="true" />
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" aria-hidden="true" />
                      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-gold/10 blur-3xl transition duration-500 group-hover:bg-brand-gold/20 motion-reduce:transition-none" aria-hidden="true" />
                      <div className="relative flex h-full flex-col justify-between">
                        <div className="flex flex-wrap gap-2">
                          {(project.tags?.length ? project.tags : ["Signage", "Manufacturing"]).slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold text-white/60 backdrop-blur-sm transition duration-300 group-hover:border-white/15 group-hover:bg-white/[0.08] motion-reduce:transition-none"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="pt-24">
                          <p className="mb-2 text-sm font-medium text-brand-gold">{project.clientName}</p>
                          <h3 className="font-display text-3xl font-bold leading-tight text-white">{project.title}</h3>
                          <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/48">{project.description}</p>
                        </div>
                      </div>
                    </article>
                  </AnimateIn>
                );
              })}
            </div>
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
                <a href="tel:+919999999999" className="inline-flex items-center gap-2 transition duration-300 hover:-translate-y-0.5 hover:text-brand-gold motion-reduce:transition-none motion-reduce:transform-none">
                  <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  +91 99999 99999
                </a>
                <a href="mailto:info@shreejiart.in" className="inline-flex items-center gap-2 transition duration-300 hover:-translate-y-0.5 hover:text-brand-gold motion-reduce:transition-none motion-reduce:transform-none">
                  <Mail className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  info@shreejiart.in
                </a>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                  Ahmedabad, Gujarat
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
