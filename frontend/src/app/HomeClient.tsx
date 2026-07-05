"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import type { Service, PortfolioItem, Testimonial } from "@/types";
import {
  Lightbulb, Square, Type, Building2, Layers, Sparkles, Briefcase, Navigation,
  ShoppingBag, Hotel, HeartPulse, BookOpen, Building, Home as HomeIcon,
  MessageSquare, Palette, Cog, CheckCircle2,
  ArrowRight, Star, Phone, Mail, MapPin,
  Trophy, Clock, Users, Zap, ChevronDown,
} from "lucide-react";

// ─── Fallback data ─────────────────────────────────────────────────────────────

const SERVICE_ICONS: Record<string, React.ElementType> = {
  "led-signs":              Lightbulb,
  "acrylic-signs":          Square,
  "3d-letter-signs":        Type,
  "acp-signage":            Building2,
  "stainless-steel-signage":Layers,
  "glow-sign-boards":       Sparkles,
  "office-branding":        Briefcase,
  "wayfinding-signs":       Navigation,
};

const DEFAULT_SERVICES = [
  { id: 1, name: "LED Signs",           slug: "led-signs",               shortDescription: "Energy-efficient, vibrant illuminated signage",       description: "", displayOrder: 1, icon: undefined },
  { id: 2, name: "Acrylic Signs",       slug: "acrylic-signs",           shortDescription: "Crystal-clear precision-cut acrylic letters",          description: "", displayOrder: 2, icon: undefined },
  { id: 3, name: "3D Letter Signs",     slug: "3d-letter-signs",         shortDescription: "Bold dimensional lettering that commands attention",   description: "", displayOrder: 3, icon: undefined },
  { id: 4, name: "ACP Signage",         slug: "acp-signage",             shortDescription: "Durable aluminium composite panel solutions",           description: "", displayOrder: 4, icon: undefined },
  { id: 5, name: "SS Signage",          slug: "stainless-steel-signage", shortDescription: "Premium brushed stainless steel fabrication",          description: "", displayOrder: 5, icon: undefined },
  { id: 6, name: "Glow Sign Boards",    slug: "glow-sign-boards",        shortDescription: "24/7 illuminated brand presence",                      description: "", displayOrder: 6, icon: undefined },
  { id: 7, name: "Office Branding",     slug: "office-branding",         shortDescription: "Complete workplace identity from lobby to boardroom",   description: "", displayOrder: 7, icon: undefined },
  { id: 8, name: "Wayfinding Systems",  slug: "wayfinding-signs",        shortDescription: "Intuitive directional and navigation signage",          description: "", displayOrder: 8, icon: undefined },
] satisfies Service[];

const DEFAULT_PORTFOLIO = [
  {
    id: 1, title: "Luxury Hotel Facade",  clientName: "The Grand Residency",
    description: "End-to-end LED facade signage and entrance feature wall for a 5-star property.",
    tags: ["LED Signs", "Facade", "Luxury"], isFeatured: true, slug: "", images: [],
    gradient: "from-brand-navy via-[#252545] to-brand-navy", accent: "from-brand-gold to-brand-gold-light",
  },
  {
    id: 2, title: "Retail Chain Rollout", clientName: "Westside Retail",
    description: "Standardised storefront and in-store signage across 15 locations in Gujarat.",
    tags: ["ACP Signage", "3D Letters", "Retail"], isFeatured: true, slug: "", images: [],
    gradient: "from-[#0f1f10] via-[#162416] to-[#0f1f10]", accent: "from-green-400 to-emerald-500",
  },
  {
    id: 3, title: "Corporate HQ Branding", clientName: "TechSpace Gujarat",
    description: "Full office identity — reception wall, conference rooms, directional systems.",
    tags: ["Office Branding", "Wayfinding", "3D Letters"], isFeatured: true, slug: "", images: [],
    gradient: "from-[#0f1020] via-[#181830] to-[#0f1020]", accent: "from-blue-400 to-indigo-500",
  },
];

const DEFAULT_TESTIMONIALS = [
  { id: 1, customerName: "Rajesh Patel",  company: "Patel Jewellers",      rating: 5, displayOrder: 1,
    content: "Shreeji Art transformed our showroom completely. The LED signage they installed is stunning — every customer comments on it. Professional, on-time, and absolutely premium quality." },
  { id: 2, customerName: "Priya Shah",    company: "Spice Route Restaurant", rating: 5, displayOrder: 2,
    content: "We needed something special for our restaurant facade. The 3D backlit lettering they created is absolutely beautiful at night. Exceeded all expectations." },
  { id: 3, customerName: "Amit Desai",    company: "Desai & Associates",    rating: 5, displayOrder: 3,
    content: "Our entire office branding was handled by Shreeji Art. From the reception signage to conference room walls — every detail was executed with precision. Highly recommended." },
];

const INDUSTRIES = [
  { icon: ShoppingBag, name: "Retail & Fashion",    desc: "Storefronts, fascias, in-store displays" },
  { icon: Hotel,       name: "Hospitality",          desc: "Hotels, resorts, restaurants & cafes" },
  { icon: HeartPulse,  name: "Healthcare",           desc: "Hospitals, clinics, diagnostic centres" },
  { icon: BookOpen,    name: "Education",            desc: "Schools, colleges, coaching institutes" },
  { icon: Building,    name: "Corporate",            desc: "Office parks, IT campuses, HQs" },
  { icon: HomeIcon,    name: "Real Estate",          desc: "Projects, townships, showrooms" },
];

const WHY_STATS = [
  { value: "500+", label: "Projects Completed", icon: Trophy },
  { value: "10+",  label: "Years of Excellence", icon: Clock  },
  { value: "200+", label: "Happy Clients",        icon: Users  },
  { value: "5",   label: "Day Avg. Delivery",    icon: Zap    },
];

const WHY_REASONS = [
  {
    icon: Palette,
    title: "In-House Design Studio",
    desc: "Our designers collaborate directly with you — no middlemen, no miscommunication. From concept to vector artwork, everything is handled under one roof.",
  },
  {
    icon: Layers,
    title: "Full Vertical Integration",
    desc: "We design, fabricate, and install. Owning every step means tighter quality control, faster timelines, and one point of accountability.",
  },
  {
    icon: CheckCircle2,
    title: "On-Site Measurement & Warranty",
    desc: "Every project starts with a free site survey. We guarantee structural integrity and LED longevity with a comprehensive post-installation warranty.",
  },
];

const PROCESS_STEPS = [
  { step: "01", icon: MessageSquare, title: "Free Consultation",   desc: "We visit your site, understand your brand, and assess requirements — completely free." },
  { step: "02", icon: Palette,       title: "Design & Approval",   desc: "Our studio creates multiple design concepts. You review, refine, and approve." },
  { step: "03", icon: Cog,           title: "Manufacturing",        desc: "Your sign is precision-fabricated in our Ahmedabad workshop with premium materials." },
  { step: "04", icon: CheckCircle2,  title: "Installation",         desc: "Our certified team installs, tests, and hands over — with a clean site guarantee." },
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface HomeClientProps {
  services:     Service[];
  portfolio:    PortfolioItem[];
  testimonials: Testimonial[];
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function HomeClient({ services, portfolio, testimonials }: HomeClientProps) {
  const displayServices     = services.length     > 0 ? services     : DEFAULT_SERVICES;
  const displayPortfolio    = portfolio.length    > 0 ? portfolio    : DEFAULT_PORTFOLIO;
  const displayTestimonials = testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── 1. HERO ────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#080814]">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#080814] via-brand-navy to-[#12122a]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Gold atmospheric glow */}
        <div className="absolute top-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-brand-gold/8 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none" />
        <div className="absolute top-3/4 right-1/6 h-[200px] w-[200px] rounded-full bg-blue-600/5 blur-[80px] pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 container-full py-24 sm:py-32 flex flex-col items-center text-center">
          {/* Eyebrow */}
          <AnimateIn delay={0} from="fade">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-gold/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-brand-gold mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse-subtle" />
              Ahmedabad&apos;s Premier Signage Partner
            </div>
          </AnimateIn>

          {/* H1 */}
          <AnimateIn delay={80} from="bottom">
            <h1 className="font-display font-bold text-white leading-[1.08] tracking-tight text-[clamp(2.5rem,7vw,5.5rem)] mb-6 max-w-4xl">
              Crafting Signs That{" "}
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg,#D4A017 0%,#F0C040 40%,#D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Define Brands
              </span>
            </h1>
          </AnimateIn>

          {/* Subtitle */}
          <AnimateIn delay={160} from="bottom">
            <p className="text-[clamp(1rem,2.5vw,1.2rem)] text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
              From LED signs and acrylic letters to full office branding —
              Shreeji Art manufactures and installs premium signage across
              Ahmedabad and Gujarat.
            </p>
          </AnimateIn>

          {/* CTAs */}
          <AnimateIn delay={240} from="bottom">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 text-sm font-semibold text-white shadow-sa-gold transition-all duration-200 hover:bg-brand-gold-dark hover:shadow-lg active:scale-[0.98]"
              >
                Get Free Quote
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/8 hover:border-brand-gold/40 active:scale-[0.98]"
              >
                View Our Work
              </Link>
            </div>
          </AnimateIn>

          {/* Stats strip */}
          <AnimateIn delay={350} from="bottom" className="w-full max-w-3xl mx-auto mt-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/8 bg-white/8">
              {WHY_STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex flex-col items-center gap-1.5 bg-white/[0.04] px-4 py-5 hover:bg-white/[0.07] transition-colors"
                  >
                    <Icon className="h-4 w-4 text-brand-gold mb-0.5" />
                    <span className="font-display font-bold text-2xl text-white">{s.value}</span>
                    <span className="text-[11px] text-gray-400 text-center leading-tight">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </AnimateIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-500 animate-bounce-sm">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </section>

      {/* ── 2. SERVICES PREVIEW ───────────────────────────────────────────── */}
      <section className="py-24 bg-white" id="services">
        <div className="container-wide">
          {/* Header */}
          <AnimateIn from="bottom" className="text-center mb-16">
            <p className="text-caption text-brand-gold mb-3">What We Craft</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2rem,4vw,3rem)] leading-tight mb-4">
              Premium Signage Solutions
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-relaxed">
              Every sign we make is engineered to endure, designed to impress,
              and crafted to convert attention into business.
            </p>
          </AnimateIn>

          {/* Services grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayServices.slice(0, 8).map((svc, i) => {
              const Icon = SERVICE_ICONS[svc.slug] ?? Sparkles;
              return (
                <AnimateIn key={svc.id} delay={i * 60} from="bottom">
                  <Link
                    href={`/services/${svc.slug}`}
                    className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sa-xs transition-all duration-200 hover:shadow-sa-md hover:border-brand-gold/20 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/8 text-brand-gold transition-colors duration-200 group-hover:bg-brand-gold group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-brand-gold transition-colors">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {svc.shortDescription}
                      </p>
                    </div>
                  </Link>
                </AnimateIn>
              );
            })}
          </div>

          {/* Footer link */}
          <AnimateIn from="fade" delay={200} className="text-center mt-10">
            <Link
              href="/services"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors"
            >
              Explore all services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* ── 3. PORTFOLIO PREVIEW ──────────────────────────────────────────── */}
      <section className="py-24 bg-brand-navy relative overflow-hidden" id="portfolio">
        {/* Subtle background texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-brand-gold/5 blur-[100px]" />

        <div className="container-wide relative z-10">
          {/* Header */}
          <AnimateIn from="bottom" className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="text-caption text-brand-gold mb-3">Our Work</p>
                <h2 className="font-display font-bold text-white text-[clamp(2rem,4vw,3rem)] leading-tight">
                  Featured Projects
                </h2>
              </div>
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-brand-gold transition-colors self-start sm:self-auto pb-1 border-b border-transparent hover:border-brand-gold/40"
              >
                View all projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimateIn>

          {/* Portfolio grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayPortfolio.map((item, i) => {
              const fallback = DEFAULT_PORTFOLIO[i] ?? DEFAULT_PORTFOLIO[0];
              const gradient = fallback.gradient;
              const accent   = fallback.accent;
              const tags     = item.tags?.length ? item.tags : fallback.tags;

              return (
                <AnimateIn key={item.id} delay={i * 100} from="bottom">
                  <div className="group relative rounded-2xl overflow-hidden cursor-pointer h-72 border border-white/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-sa-xl">
                    {/* Gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                    {/* Decorative shape */}
                    <div
                      className={`absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-gradient-to-br ${accent} opacity-15 blur-2xl group-hover:opacity-25 transition-opacity duration-500`}
                    />
                    <div
                      className={`absolute top-6 right-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-10`}
                    />
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/15 bg-white/8 px-2.5 py-0.5 text-[10px] font-medium text-white/80 backdrop-blur-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {/* Info */}
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{item.clientName}</p>
                        <h3 className="font-display font-bold text-white text-xl leading-snug mb-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. INDUSTRIES ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50" id="industries">
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-12">
            <p className="text-caption text-brand-gold mb-3">Who We Serve</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(1.8rem,3.5vw,2.5rem)] leading-tight">
              Industries We Work With
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <AnimateIn key={ind.name} delay={i * 60} from="bottom">
                  <div className="group flex flex-col items-center text-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-6 transition-all duration-200 hover:border-brand-gold/30 hover:shadow-sa-md hover:-translate-y-0.5 cursor-default">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/8 text-brand-gold transition-colors duration-200 group-hover:bg-brand-gold group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{ind.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{ind.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. WHY CHOOSE US ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white" id="why-us">
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-16">
            <p className="text-caption text-brand-gold mb-3">Why Shreeji Art</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2rem,4vw,3rem)] leading-tight mb-4">
              The Ahmedabad Standard
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto text-[15px] leading-relaxed">
              We&apos;ve been setting the benchmark for premium signage in Gujarat
              since 2013. Here&apos;s what makes us different.
            </p>
          </AnimateIn>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {WHY_STATS.map((s, i) => {
              const Icon = s.icon;
              return (
                <AnimateIn key={s.label} delay={i * 80} from="bottom">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-7 text-center">
                    <Icon className="h-5 w-5 text-brand-gold mx-auto mb-3" />
                    <p className="font-display font-bold text-4xl text-brand-navy mb-1">{s.value}</p>
                    <p className="text-sm text-gray-500">{s.label}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>

          {/* Reasons row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHY_REASONS.map((r, i) => {
              const Icon = r.icon;
              return (
                <AnimateIn key={r.title} delay={i * 100} from="bottom">
                  <div className="rounded-2xl border border-gray-100 p-7 group hover:border-brand-gold/20 hover:shadow-sa-md transition-all duration-200">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/8 text-brand-gold mb-5 group-hover:bg-brand-gold group-hover:text-white transition-colors duration-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base mb-2">{r.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. OUR PROCESS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#080814] relative overflow-hidden" id="process">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080814] via-brand-navy/60 to-[#080814]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-brand-gold/5 blur-[150px]" />

        <div className="container-wide relative z-10">
          <AnimateIn from="bottom" className="text-center mb-16">
            <p className="text-caption text-brand-gold mb-3">How We Work</p>
            <h2 className="font-display font-bold text-white text-[clamp(2rem,4vw,3rem)] leading-tight">
              Our Process
            </h2>
          </AnimateIn>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimateIn key={step.step} delay={i * 100} from="bottom">
                  <div className="relative flex flex-col gap-5 rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-200">
                    {/* Step number */}
                    <div
                      className="absolute -top-4 left-6 font-mono text-xs font-bold text-brand-gold bg-[#080814] border border-brand-gold/30 rounded-full px-2.5 py-0.5"
                    >
                      {step.step}
                    </div>
                    {/* Icon */}
                    <div className="mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    {/* Text */}
                    <div>
                      <h3 className="font-semibold text-white text-sm mb-2">{step.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
                    </div>
                    {/* Connector line (not last) */}
                    {i < PROCESS_STEPS.length - 1 && (
                      <div className="absolute top-8 -right-3 hidden lg:block h-px w-6 bg-gradient-to-r from-brand-gold/30 to-transparent" />
                    )}
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. TESTIMONIALS ───────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50" id="testimonials">
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-14">
            <p className="text-caption text-brand-gold mb-3">Client Stories</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2rem,4vw,3rem)] leading-tight mb-4">
              What Our Clients Say
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTestimonials.map((t, i) => (
              <AnimateIn key={t.id} delay={i * 100} from="bottom">
                <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-7 shadow-sa-xs h-full hover:shadow-sa-md hover:border-brand-gold/20 transition-all duration-200">
                  {/* Stars */}
                  <div>
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className={`h-4 w-4 ${si < t.rating ? "fill-brand-gold text-brand-gold" : "text-gray-200"}`}
                        />
                      ))}
                    </div>
                    {/* Quote mark */}
                    <div className="font-display text-5xl leading-none text-brand-gold/20 mb-2">&ldquo;</div>
                    <p className="text-sm text-gray-600 leading-relaxed">{t.content}</p>
                  </div>
                  {/* Author */}
                  <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold font-semibold text-sm shrink-0">
                      {t.customerName.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.customerName}</p>
                      {t.company && <p className="text-xs text-gray-400">{t.company}</p>}
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA ────────────────────────────────────────────────────────── */}
      <section className="relative py-28 bg-brand-navy overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-gold/10 blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-gold/8 blur-[60px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container-narrow relative z-10 text-center">
          <AnimateIn from="bottom">
            <p className="text-caption text-brand-gold mb-4">Ready to Begin?</p>
            <h2 className="font-display font-bold text-white text-[clamp(2rem,5vw,3.5rem)] leading-tight mb-5">
              Let&apos;s Build Something<br />
              <span
                style={{
                  background: "linear-gradient(135deg,#D4A017 0%,#F0C040 50%,#D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Remarkable Together
              </span>
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-lg mx-auto">
              Get a free consultation and detailed quote within 24 hours.
              No obligation, no pushy sales — just expert advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 text-sm font-semibold text-white shadow-sa-gold transition-all duration-200 hover:bg-brand-gold-dark active:scale-[0.98]"
              >
                Get Free Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/8 hover:border-brand-gold/40 active:scale-[0.98]"
              >
                Contact Us
              </Link>
            </div>
            {/* Trust row */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-brand-gold" /> +91 99999 99999
              </span>
              <span className="h-px w-4 bg-gray-700" />
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-brand-gold" /> info@shreejiart.in
              </span>
              <span className="h-px w-4 bg-gray-700" />
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-brand-gold" /> Ahmedabad, Gujarat
              </span>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── 9. FOOTER ─────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
