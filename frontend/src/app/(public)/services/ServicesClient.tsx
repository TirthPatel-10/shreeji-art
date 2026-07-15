"use client";

import type { ElementType } from "react";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import type { Service } from "@/types";
import {
  Lightbulb, Square, Type, Building2, Shield, Sparkles, Briefcase,
  ShoppingBag, Wrench,
  ChevronDown, ArrowRight, CheckCircle2,
  MessageSquare, Palette, Cog, Users,
} from "lucide-react";

// ─── Static service data (used when API returns nothing) ──────────────────────

interface SvcSection {
  id: string;
  apiSlug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  applications: string;
  gradient: string;
  accentFrom: string;
  accentTo: string;
  iconBg: string;
  iconColor: string;
  icon: ElementType;
}

const PREMIUM_TRANSITION =
  "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:transform-none";

const SECTIONS: SvcSection[] = [
  {
    id: "led-signs", apiSlug: "led-signs",
    name: "LED Signs",
    tagline: "Your brand, brilliantly lit.",
    description:
      "State-of-the-art LED signage that combines energy efficiency with striking visual impact. Engineered for Gujarat's climate — from monsoon humidity to 45°C summer heat.",
    features: [
      "50,000+ hour LED lifespan",
      "IP65 weatherproof enclosures",
      "Remote dimming & scheduling",
      "60–70% less energy vs neon",
      "Custom colour temperatures (2700K–6500K)",
    ],
    applications: "Retail storefronts, hotels, showrooms, petrol stations, corporate buildings",
    gradient:    "from-[#18120a] via-[#241a06] to-[#18120a]",
    accentFrom:  "from-amber-400",
    accentTo:    "to-yellow-300",
    iconBg:      "bg-amber-400/10",
    iconColor:   "text-amber-400",
    icon: Lightbulb,
  },
  {
    id: "acrylic-signs", apiSlug: "acrylic-signs",
    name: "Acrylic Signs",
    tagline: "Crystal clarity, refined craftsmanship.",
    description:
      "Precision-cut acrylic signage offers a polished, high-end aesthetic ideal for premium brands. We work with cast and extruded acrylic in any thickness, finish, or colour.",
    features: [
      "CNC and laser precision cutting",
      "4mm–20mm thickness options",
      "Frosted, mirror, and gloss finishes",
      "UV-stable inks (no yellowing over time)",
      "Edge-polished or flame-finished",
    ],
    applications: "Office receptions, retail interiors, hospitality, healthcare corridors",
    gradient:   "from-[#080e1c] via-[#0a1228] to-[#080e1c]",
    accentFrom: "from-sky-400",
    accentTo:   "to-blue-300",
    iconBg:     "bg-sky-400/10",
    iconColor:  "text-sky-400",
    icon: Square,
  },
  {
    id: "3d-letters", apiSlug: "3d-letter-signs",
    name: "3D Letter Signs",
    tagline: "Depth, drama, and undeniable presence.",
    description:
      "Dimensional lettering that adds tangible depth to your brand. Available in metal, acrylic, and foam — front-lit, back-lit, or halo-lit for a premium after-dark effect.",
    features: [
      "Front-lit, halo-lit, and solid options",
      "Stainless, acrylic, and foam substrates",
      "Individual letter or full wordmark",
      "Flush or stand-off mounting",
      "Powder-coated to any RAL colour",
    ],
    applications: "Building facades, reception walls, retail fascias, event backdrops",
    gradient:   "from-[#100a1a] via-[#180e28] to-[#100a1a]",
    accentFrom: "from-violet-400",
    accentTo:   "to-purple-300",
    iconBg:     "bg-violet-400/10",
    iconColor:  "text-violet-400",
    icon: Type,
  },
  {
    id: "acp-signage", apiSlug: "acp-signage",
    name: "ACP Signage",
    tagline: "The backbone of large-format outdoor advertising.",
    description:
      "Aluminium Composite Panels deliver flatness, weather resistance, and crisp print quality. Ideal for hoardings, pylons, and facades that need to look perfect at scale.",
    features: [
      "3mm and 4mm PVDF-coated panels",
      "UV digital print or vinyl finish",
      "Lightweight yet rigid (3 kg/m²)",
      "Zero-maintenance powder coat",
      "CNC-routed to any custom shape",
    ],
    applications: "Outdoor hoardings, building facades, pylon signs, highway boards",
    gradient:   "from-[#0c1018] via-[#101828] to-[#0c1018]",
    accentFrom: "from-cyan-400",
    accentTo:   "to-teal-300",
    iconBg:     "bg-cyan-400/10",
    iconColor:  "text-cyan-400",
    icon: Building2,
  },
  {
    id: "ss-signs", apiSlug: "stainless-steel-signage",
    name: "Stainless Steel Signs",
    tagline: "Built to endure. Designed to impress.",
    description:
      "Brushed and mirror-polished stainless steel signage for brands that demand permanence and prestige. Corrosion-resistant, zero-maintenance, and unmistakably premium.",
    features: [
      "304 and 316L marine-grade steel",
      "Brushed, mirror, or satin finishes",
      "Laser-cut to 0.1mm tolerance",
      "Powder-coat or chemical-etch options",
      "Virtually lifetime structural durability",
    ],
    applications: "Banks, law firms, luxury retail, hospital entrances, hotels",
    gradient:   "from-[#0c1014] via-[#10181e] to-[#0c1014]",
    accentFrom: "from-zinc-300",
    accentTo:   "to-slate-200",
    iconBg:     "bg-zinc-300/10",
    iconColor:  "text-zinc-300",
    icon: Shield,
  },
  {
    id: "glow-signs", apiSlug: "glow-sign-boards",
    name: "Glow Sign Boards",
    tagline: "Seen by day. Impossible to miss at night.",
    description:
      "Back-lit flex and vinyl sign boards that deliver 360° visibility at an accessible price point. A cost-effective solution for high-traffic locations where 24-hour brand presence matters.",
    features: [
      "Sunboard or aluminium frame options",
      "Premium flex-face printing (1440 dpi)",
      "Internal LED tube or strip lighting",
      "Moisture-sealed wiring and junction boxes",
      "Standard and custom frame sizes",
    ],
    applications: "Shops, pharmacies, restaurants, clinics, service outlets",
    gradient:   "from-[#120a1c] via-[#1a0d2e] to-[#120a1c]",
    accentFrom: "from-fuchsia-400",
    accentTo:   "to-pink-300",
    iconBg:     "bg-fuchsia-400/10",
    iconColor:  "text-fuchsia-400",
    icon: Sparkles,
  },
  {
    id: "office-branding", apiSlug: "office-branding",
    name: "Office Branding",
    tagline: "Your brand lives where your people work.",
    description:
      "Complete workplace identity — reception feature walls, conference room graphics, wayfinding systems, and environmental murals. We transform blank offices into branded experiences.",
    features: [
      "Brand guidelines implementation",
      "3D logo panels for reception walls",
      "Conference room and cabin graphics",
      "Wayfinding and directory systems",
      "Motivational wall wraps and murals",
    ],
    applications: "Startups, MNCs, co-working spaces, government offices, law firms",
    gradient:   "from-[#080c18] via-[#0c1228] to-[#080c18]",
    accentFrom: "from-blue-400",
    accentTo:   "to-indigo-300",
    iconBg:     "bg-blue-400/10",
    iconColor:  "text-blue-400",
    icon: Briefcase,
  },
  {
    id: "retail-branding", apiSlug: "retail-branding",
    name: "Retail Branding",
    tagline: "Win customers before they walk in.",
    description:
      "End-to-end in-store and exterior branding that creates a seamless retail experience. We understand shopper psychology and translate it into signage that drives dwell time and conversions.",
    features: [
      "Fascia boards and canopy signage",
      "Window graphics and frosting",
      "Point-of-sale display materials",
      "Category and product zone markers",
      "Promotional hoardings and standees",
    ],
    applications: "Fashion retail, supermarkets, jewellery, electronics, furniture stores",
    gradient:   "from-[#1a0c08] via-[#2a1208] to-[#1a0c08]",
    accentFrom: "from-orange-400",
    accentTo:   "to-amber-300",
    iconBg:     "bg-orange-400/10",
    iconColor:  "text-orange-400",
    icon: ShoppingBag,
  },
  {
    id: "industrial-signage", apiSlug: "industrial-signage",
    name: "Industrial Signage",
    tagline: "Safety, compliance, and clarity at scale.",
    description:
      "Heavy-duty signage systems for manufacturing plants, warehouses, and industrial estates. Compliant with IS/ISO safety standards and built to resist harsh environments.",
    features: [
      "OSHA/IS 9457-compliant safety panels",
      "Retro-reflective and photoluminescent options",
      "Chemical and temperature-resistant coatings",
      "Floor marking tapes and zone demarcation",
      "Multi-language and pictogram boards",
    ],
    applications: "Factories, GIDC estates, warehouses, chemical plants, construction sites",
    gradient:   "from-[#120c06] via-[#1e1008] to-[#120c06]",
    accentFrom: "from-orange-500",
    accentTo:   "to-red-400",
    iconBg:     "bg-orange-500/10",
    iconColor:  "text-orange-500",
    icon: Wrench,
  },
];

const QUICK_NAV = [
  { id: "led-signs",          label: "LED Signs"   },
  { id: "acrylic-signs",      label: "Acrylic"     },
  { id: "3d-letters",         label: "3D Letters"  },
  { id: "acp-signage",        label: "ACP"         },
  { id: "ss-signs",           label: "SS Signs"    },
  { id: "glow-signs",         label: "Glow Signs"  },
  { id: "office-branding",    label: "Office"      },
  { id: "retail-branding",    label: "Retail"      },
  { id: "industrial-signage", label: "Industrial"  },
  { id: "process",            label: "Process"     },
  { id: "faq",                label: "FAQ"         },
];

const PROCESS_STEPS = [
  { step: "01", icon: MessageSquare, title: "Free Site Survey",   desc: "We visit your location to measure dimensions, assess mounting surfaces, check electrical access, and note any local authority constraints — at no charge." },
  { step: "02", icon: Palette,       title: "Concept Design",     desc: "Our studio produces 2D layouts and, where needed, 3D photorealistic renders so you can visualise the finished sign before we begin." },
  { step: "03", icon: CheckCircle2,  title: "Client Approval",    desc: "You review, give feedback, and sign off on the final design, materials, timeline, and budget — no surprises, no hidden costs." },
  { step: "04", icon: Cog,           title: "Manufacturing",      desc: "Precision in-house fabrication in our Ahmedabad workshop. Every component is quality-checked against specification before it leaves." },
  { step: "05", icon: Users,         title: "Installation",       desc: "Our certified installation team handles mounting, wiring, testing, and commissioning — and leaves your site spotless on handover." },
];

const FAQ_ITEMS = [
  {
    q: "How long does a typical project take?",
    a: "Most projects complete within 7–12 working days from design approval. Complex multi-location rollouts may take 15–21 days. We provide a firm timeline during the initial consultation.",
  },
  {
    q: "Do you offer free site surveys?",
    a: "Yes — we visit your location before any design work begins to measure dimensions, assess mounting surfaces, check electrical access, and identify any local authority requirements. There's no charge for this.",
  },
  {
    q: "What warranty do you provide?",
    a: "All LED electrical components carry a 2-year warranty. Structural and fabrication work is warranted for 1 year. We also offer Annual Maintenance Contracts (AMC) for long-term peace of mind.",
  },
  {
    q: "Can you handle multi-location rollouts?",
    a: "Absolutely. We batch-produce to ensure consistency and co-ordinate multiple installation teams across sites simultaneously. Our largest rollout covered 18 locations across Gujarat.",
  },
  {
    q: "Do you assist with local authority permissions?",
    a: "Yes — for outdoor hoardings and large facade signage in Ahmedabad, we guide you through AUDA and AMC approvals. We've handled hundreds of permit applications and know the process well.",
  },
  {
    q: "Can you fabricate from my own design files?",
    a: "Yes. Send us production-ready files (AI, CDR, PDF) and we'll proceed directly to fabrication after a brief manufacturability review — usually completed same-day.",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

interface ServicesClientProps {
  services: Service[];
}

export default function ServicesClient({ services }: ServicesClientProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function apiFor(slug: string): Service | undefined {
    return services.find((s) => s.slug === slug);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#080814] pb-16 pt-20 sm:pb-18">
        <div className="absolute inset-0 bg-gradient-to-br from-[#080814] via-brand-navy to-[#14142e]" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute right-1/4 top-0 h-80 w-80 animate-pulse-subtle rounded-full bg-brand-gold/6 blur-[120px] motion-reduce:animate-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-brand-gold/4 blur-[80px]" aria-hidden="true" />

        <div className="container-wide relative z-10 py-16 sm:py-20">
          <AnimateIn from="bottom" className="text-center">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center justify-center gap-2 text-xs text-gray-500" aria-label="Breadcrumb">
              <Link href="/" className="rounded-sm transition-colors hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold">
                Home
              </Link>
              <span className="text-gray-600" aria-hidden="true">/</span>
              <span className="text-gray-400">Services</span>
            </nav>

            {/* Eyebrow */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-gold/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold">
              <span className="h-1.5 w-1.5 animate-pulse-subtle rounded-full bg-brand-gold motion-reduce:animate-none" aria-hidden="true" />
              Premium Signage Manufacturing
            </div>

            {/* H1 */}
            <h1 className="mb-5 font-display text-[clamp(2.2rem,5vw,3.8rem)] font-bold leading-tight tracking-tight text-white">
              Every Sign We Make Is{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#D4A017 0%,#F0C040 50%,#D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Built to Last
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-10 max-w-2xl text-[15px] leading-relaxed text-gray-400">
              From a single shop fascia to a full campus rollout — we design,
              fabricate, and install premium signage across Gujarat.
              Explore our complete service range below.
            </p>

            {/* Quick-nav pills */}
            <nav
              className="-mx-4 flex max-w-3xl gap-2 overflow-x-auto px-4 pb-2 sm:mx-auto sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0"
              aria-label="Service sections"
            >
              {QUICK_NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className={`shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium text-gray-400 ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:border-brand-gold/40 hover:bg-brand-gold/8 hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold`}
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </AnimateIn>
        </div>
      </section>

      {/* ── SERVICE SECTIONS ──────────────────────────────────────────────── */}
      {SECTIONS.map((svc, i) => {
        const api  = apiFor(svc.apiSlug);
        const flip = i % 2 === 1;
        const Icon = svc.icon;

        return (
          <section
            key={svc.id}
            id={svc.id}
            className={`scroll-mt-20 py-16 sm:py-20 lg:py-24 ${i % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
            aria-labelledby={`${svc.id}-title`}
          >
            <div className="container-wide grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">

              {/* Visual panel */}
              <AnimateIn
                from={flip ? "right" : "left"}
                className={flip ? "lg:order-2" : undefined}
              >
                <div
                  className={`group relative h-56 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${svc.gradient} shadow-sa-lg sm:h-80 ${PREMIUM_TRANSITION} hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(10,10,25,0.22)]`}
                >
                  {/* Dot-grid texture */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  {/* Top-right accent orb */}
                  <div
                    className={`absolute -right-8 -top-8 h-48 w-48 rounded-full bg-gradient-to-br ${svc.accentFrom} ${svc.accentTo} opacity-15 blur-2xl transition duration-700 group-hover:scale-110 group-hover:opacity-25 motion-reduce:transition-none motion-reduce:transform-none`}
                    aria-hidden="true"
                  />
                  {/* Bottom-left accent orb */}
                  <div
                    className={`absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-gradient-to-br ${svc.accentFrom} ${svc.accentTo} opacity-10 blur-xl transition duration-700 group-hover:opacity-20 motion-reduce:transition-none`}
                    aria-hidden="true"
                  />
                  {/* Centre icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 ${svc.iconBg} backdrop-blur-sm sm:h-28 sm:w-28 ${PREMIUM_TRANSITION} group-hover:scale-105 group-hover:border-white/20`}
                    >
                      <Icon className={`h-12 w-12 ${svc.iconColor} sm:h-14 sm:w-14`} aria-hidden="true" />
                    </div>
                  </div>
                  {/* Bottom label */}
                  <div className="absolute bottom-4 inset-x-0 flex justify-center">
                    <span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/30 backdrop-blur">
                      {svc.name}
                    </span>
                  </div>
                </div>
              </AnimateIn>

              {/* Text panel */}
              <AnimateIn
                from={flip ? "left" : "right"}
                delay={120}
                className={flip ? "lg:order-1" : undefined}
              >
                <p className="mb-2 text-caption text-brand-gold">{svc.name}</p>
                <h2 id={`${svc.id}-title`} className="mb-2 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-tight text-brand-navy">
                  {api?.name ?? svc.name}
                </h2>
                <p className="mb-4 text-[13px] font-medium italic text-brand-gold/70">{svc.tagline}</p>
                <p className="mb-6 text-[15px] leading-relaxed text-gray-500">
                  {api?.description || svc.description}
                </p>

                {/* Features */}
                <ul className="mb-6 space-y-2.5">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Applications tag */}
                <p className="mb-7 rounded-2xl border border-gray-200 bg-white/70 p-4 text-xs leading-6 text-gray-500 shadow-sa-xs">
                  <span className="font-semibold text-gray-500 mr-1">Best for:</span>
                  {svc.applications}
                </p>

                {/* CTAs */}
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href={`/quote?service=${encodeURIComponent(api?.name ?? svc.name)}`}
                    className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(212,160,23,.18)] ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:bg-brand-gold-dark hover:shadow-[0_18px_48px_rgba(212,160,23,.28)] active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold`}
                  >
                    Get a Quote
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`/services/${svc.apiSlug}`}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:border-brand-gold/30 hover:text-brand-gold active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold`}
                  >
                    Full Details
                  </Link>
                </div>
              </AnimateIn>
            </div>
          </section>
        );
      })}

      {/* ── INSTALLATION PROCESS ──────────────────────────────────────────── */}
      <section id="process" className="relative scroll-mt-20 overflow-hidden bg-[#080814] py-20 sm:py-24" aria-labelledby="process-title">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080814] via-brand-navy/50 to-[#080814]" aria-hidden="true" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold/5 blur-[140px]" aria-hidden="true" />

        <div className="container-wide relative z-10">
          <AnimateIn from="bottom" className="mb-14 text-center sm:mb-16">
            <p className="mb-3 text-caption text-brand-gold">How We Work</p>
            <h2 id="process-title" className="mb-4 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight text-white">
              Our 5-Step Process
            </h2>
            <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-gray-400">
              Every project, regardless of size, follows the same rigorous
              process — no shortcuts, no surprises.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimateIn key={step.step} delay={i * 80} from="bottom">
                  <div className={`group relative flex h-full flex-col gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-6 ${PREMIUM_TRANSITION} hover:-translate-y-1 hover:border-brand-gold/25 hover:bg-white/[0.06]`}>
                    {/* Step badge */}
                    <div className="absolute -top-3.5 left-5 rounded-full border border-brand-gold/30 bg-[#080814] px-2.5 py-0.5 font-mono text-xs font-bold text-brand-gold">
                      {step.step}
                    </div>
                    <div className={`mt-1.5 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold ${PREMIUM_TRANSITION} group-hover:scale-105 group-hover:bg-brand-gold group-hover:text-white`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-white">{step.title}</h3>
                      <p className="text-xs leading-relaxed text-gray-400">{step.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="scroll-mt-20 bg-white py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="container-wide">
          <AnimateIn from="bottom" className="mb-12 text-center sm:mb-14">
            <p className="mb-3 text-caption text-brand-gold">Questions &amp; Answers</p>
            <h2 id="faq-title" className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold leading-tight text-brand-navy">
              Frequently Asked
            </h2>
          </AnimateIn>

          <div className="mx-auto max-w-3xl divide-y divide-gray-100 rounded-[1.5rem] border border-gray-100 bg-white px-4 shadow-sa-xs sm:px-6">
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = openFaq === i;
              const buttonId = `services-faq-${i}-button`;
              const panelId = `services-faq-${i}-panel`;
              return (
                <AnimateIn key={i} from="bottom" delay={i * 40}>
                  <div>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-4 rounded-xl py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
                    >
                      <span className="text-sm font-semibold text-gray-900 leading-snug pr-2 group-hover:text-brand-gold transition-colors">
                        {item.q}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-brand-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className={`overflow-hidden transition-all duration-300 ease-smooth ${
                        isOpen ? "max-h-56 opacity-100 pb-5" : "max-h-0 opacity-0"
                      } motion-reduce:transition-none`}
                    >
                      <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-navy py-20 sm:py-24" aria-labelledby="services-cta-title">
        <div className="absolute -right-24 -top-24 h-80 w-80 animate-pulse-subtle rounded-full bg-brand-gold/10 blur-[80px] motion-reduce:animate-none" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-gold/8 blur-[60px]" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container-narrow relative z-10 text-center">
          <AnimateIn from="bottom">
            <p className="mb-4 text-caption text-brand-gold">Ready to Start?</p>
            <h2 id="services-cta-title" className="mb-5 font-display text-[clamp(1.8rem,4vw,3rem)] font-bold leading-tight text-white">
              Let&apos;s Build Your Sign{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#D4A017 0%,#F0C040 50%,#D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                The Right Way
              </span>
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-[15px] leading-relaxed text-gray-400">
              Tell us about your project and we&apos;ll come back with a free
              site survey, concept design, and detailed quote — within 24 hours.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/quote"
                className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 text-sm font-semibold text-white shadow-sa-gold ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:bg-brand-gold-dark active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold`}
              >
                Request Free Quote
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white ${PREMIUM_TRANSITION} hover:-translate-y-0.5 hover:border-brand-gold/40 hover:bg-white/8 active:translate-y-0 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold`}
              >
                Contact Us
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
