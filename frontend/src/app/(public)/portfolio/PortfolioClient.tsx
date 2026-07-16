"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import type { PortfolioItem } from "@/types";
import {
  ArrowRight, Lightbulb, Square, Type, Building2, Shield,
  Sparkles, Briefcase, ShoppingBag, Wrench, CheckCircle2,
  MessageSquare, Palette, Package, Settings, Zap,
  Paintbrush, Truck, Users, Coffee, Activity, BookOpen,
  Home, ShoppingCart, Star, ImageIcon, Search,
} from "lucide-react";

// ─── Categories ──────────────────────────────────────────────────────────────

interface Category {
  id: string;
  label: string;
  keys: string[];
}

const CATEGORIES: Category[] = [
  { id: "all",        label: "All Projects",    keys: [] },
  { id: "led",        label: "LED Signs",        keys: ["led", "light"] },
  { id: "acrylic",    label: "Acrylic Signs",    keys: ["acrylic"] },
  { id: "3d",         label: "3D Letters",       keys: ["3d", "letter", "dimensional"] },
  { id: "acp",        label: "ACP Signage",      keys: ["acp", "aluminium"] },
  { id: "steel",      label: "SS Signs",         keys: ["steel", "stainless", "ss"] },
  { id: "retail",     label: "Retail Branding",  keys: ["retail", "shop", "store"] },
  { id: "office",     label: "Office Branding",  keys: ["office", "corporate"] },
  { id: "glow",       label: "Glow Signs",       keys: ["glow", "backlit"] },
  { id: "industrial", label: "Industrial",       keys: ["industrial", "factory", "warehouse"] },
];

function matchesCategory(item: PortfolioItem, cat: Category): boolean {
  if (cat.id === "all") return true;
  const searchIn = [
    ...(item.tags ?? []),
    item.service?.name ?? "",
    item.title,
    item.description,
  ].join(" ").toLowerCase();
  return cat.keys.some((k) => searchIn.includes(k));
}

// ─── Visual helpers ──────────────────────────────────────────────────────────

const CARD_GRADIENTS = [
  "from-[#18120a] via-[#241a06] to-[#18120a]",
  "from-[#080e1c] via-[#0a1228] to-[#080e1c]",
  "from-[#100a1a] via-[#180e28] to-[#100a1a]",
  "from-[#0c1018] via-[#101828] to-[#0c1018]",
  "from-[#0c1014] via-[#10181e] to-[#0c1014]",
  "from-[#120a1c] via-[#1a0d2e] to-[#120a1c]",
  "from-[#080c18] via-[#0c1228] to-[#080c18]",
  "from-[#1a0c08] via-[#2a1208] to-[#1a0c08]",
  "from-[#12100a] via-[#1e180a] to-[#12100a]",
];

const SERVICE_ICONS = [
  Lightbulb, Square, Type, Building2, Shield,
  Sparkles, Briefcase, ShoppingBag, Wrench,
];

function cardIcon(index: number) {
  return SERVICE_ICONS[index % SERVICE_ICONS.length];
}

// ─── Capabilities ────────────────────────────────────────────────────────────

const CAPABILITIES = [
  { icon: MessageSquare, title: "Consultation",     desc: "Free site survey and needs assessment before any design work." },
  { icon: Palette,       title: "Concept Design",    desc: "2D layouts and 3D photo-realistic renders for your approval." },
  { icon: Package,       title: "Material Selection", desc: "Curated substrates matched to your environment and budget." },
  { icon: Settings,      title: "Custom Fabrication", desc: "Precision in-house manufacturing at our Ahmedabad workshop." },
  { icon: Zap,           title: "LED & Electrical",  desc: "Full wiring, drivers, controllers, and commissioning." },
  { icon: Paintbrush,    title: "Finishing",          desc: "Powder coat, vinyl, paint, or chemical etch — any RAL colour." },
  { icon: Truck,         title: "Delivery",           desc: "Careful protective packaging and on-time delivery to site." },
  { icon: Wrench,        title: "Installation",       desc: "Certified team handles mounting, wiring, testing, and handover." },
];

// ─── Industries ──────────────────────────────────────────────────────────────

const INDUSTRIES = [
  { icon: ShoppingBag,  label: "Retail" },
  { icon: Coffee,       label: "Restaurants & Cafés" },
  { icon: Building2,    label: "Corporate Offices" },
  { icon: Activity,     label: "Hospitals & Clinics" },
  { icon: BookOpen,     label: "Schools & Colleges" },
  { icon: Wrench,       label: "Manufacturing" },
  { icon: Home,         label: "Real Estate" },
  { icon: Sparkles,     label: "Hotels & Hospitality" },
  { icon: ShoppingCart, label: "Shopping Centres" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function PortfolioCardImage({
  src, alt, gradient, iconIndex,
}: {
  src?: string; alt: string; gradient: string; iconIndex: number;
}) {
  const [error, setError] = useState(false);
  const Icon = cardIcon(iconIndex);

  if (!src || error) {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}
        aria-hidden
      >
        <div className="h-1 w-1" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.7) 1px,transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <Icon className="h-12 w-12 text-white/20" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      onError={() => setError(true)}
    />
  );
}

function PortfolioCard({ item, index }: { item: PortfolioItem; index: number }) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const firstImage = item.images?.[0];

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-gold/30 shadow-sm hover:shadow-sa-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      tabIndex={0}
      aria-label={`View portfolio project: ${item.title}`}
    >
      {/* Image area */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <PortfolioCardImage
          src={firstImage}
          alt={item.title}
          gradient={gradient}
          iconIndex={index}
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex gap-1.5">
          {item.isFeatured && (
            <span className="flex items-center gap-1 bg-brand-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
              <Star className="h-2.5 w-2.5" />
              Featured
            </span>
          )}
          {item.service?.name && (
            <span className="bg-brand-navy/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
              {item.service.name}
            </span>
          )}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-navy/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <span className="inline-flex items-center gap-2 text-white text-sm font-semibold">
            View Project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="bg-white p-4">
        <h3 className="font-semibold text-[15px] text-brand-navy leading-tight line-clamp-1 group-hover:text-brand-gold transition-colors duration-200 mb-1">
          {item.title}
        </h3>
        {item.clientName && (
          <p className="text-xs text-gray-400 mb-2">{item.clientName}</p>
        )}
        {item.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-brand-gold/70 border border-brand-gold/20 rounded-full px-1.5 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface PortfolioClientProps {
  items: PortfolioItem[];
}

export default function PortfolioClient({ items }: PortfolioClientProps) {
  const [activeCategory, setActiveCategory] = useState("all");

  const featured = useMemo(() => items.filter((i) => i.isFeatured), [items]);

  const filtered = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCategory);
    if (!cat) return items;
    return items.filter((i) => matchesCategory(i, cat));
  }, [items, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#080814] overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#080814] via-brand-navy to-[#14142e]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-brand-gold/6 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-brand-gold/4 blur-[80px] pointer-events-none" />

        <div className="container-wide relative z-10 py-20 sm:py-24">
          <AnimateIn from="bottom" className="text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6">
              <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400">Portfolio</span>
            </div>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-gold/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse-subtle" />
              Our Work
            </div>

            {/* H1 */}
            <h1 className="font-display font-bold text-white leading-tight tracking-tight text-[clamp(2.2rem,5vw,3.8rem)] mb-5">
              Signage That{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#D4A017 0%,#F0C040 50%,#D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Transforms Businesses
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-[15px] leading-relaxed max-w-2xl mx-auto mb-10">
              Every project you see below was designed, fabricated, and installed
              by our team in Ahmedabad. Explore our work across industries and
              sign types.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-sm font-semibold text-white hover:bg-brand-gold-dark transition-all duration-200 active:scale-[0.98]"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/8 hover:border-brand-gold/40 transition-all duration-200 active:scale-[0.98]"
              >
                Explore Services
              </Link>
            </div>

            {/* Stats — only shown if there are real items */}
            {items.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 mt-12 pt-12 border-t border-white/8">
                <div className="text-center">
                  <p className="font-display font-bold text-3xl text-brand-gold">{items.length}+</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Projects Shown</p>
                </div>
                {featured.length > 0 && (
                  <div className="text-center">
                    <p className="font-display font-bold text-3xl text-brand-gold">{featured.length}</p>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Featured</p>
                  </div>
                )}
                <div className="text-center">
                  <p className="font-display font-bold text-3xl text-brand-gold">9+</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Sign Categories</p>
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-3xl text-brand-gold">Gujarat</p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Coverage</p>
                </div>
              </div>
            )}
          </AnimateIn>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ─────────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-20 bg-[#080814] border-t border-white/5">
          <div className="container-wide">
            <AnimateIn from="bottom" className="mb-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-caption text-brand-gold mb-1.5">Highlighted Work</p>
                  <h2 className="font-display font-bold text-white text-2xl sm:text-3xl">
                    Featured Projects
                  </h2>
                </div>
                <Link
                  href="#all-projects"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-gold transition-colors"
                >
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((item, i) => {
                const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];
                const firstImage = item.images?.[0];
                return (
                  <AnimateIn key={item.id} from="bottom" delay={i * 100}>
                    <Link
                      href={`/portfolio/${item.slug}`}
                      className="group block rounded-2xl overflow-hidden border border-white/8 hover:border-brand-gold/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                      aria-label={`Featured project: ${item.title}`}
                    >
                      <div className="relative h-52 overflow-hidden">
                        <PortfolioCardImage
                          src={firstImage}
                          alt={item.title}
                          gradient={gradient}
                          iconIndex={i}
                        />
                        <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <span className="inline-flex items-center gap-2 text-white text-sm font-semibold">
                            View Project <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                        <div className="absolute top-3 left-3 z-10">
                          <span className="flex items-center gap-1 bg-brand-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">
                            <Star className="h-2.5 w-2.5" /> Featured
                          </span>
                        </div>
                      </div>
                      <div className="bg-white/[0.04] p-4 border-t border-white/5">
                        <h3 className="font-semibold text-[15px] text-white group-hover:text-brand-gold transition-colors mb-1 line-clamp-1">
                          {item.title}
                        </h3>
                        {item.clientName && (
                          <p className="text-xs text-gray-500 mb-2">{item.clientName}</p>
                        )}
                        {item.description && (
                          <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  </AnimateIn>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORY FILTERS + FULL GRID ─────────────────────────────────── */}
      <section id="all-projects" className="scroll-mt-20 py-20 bg-white">
        <div className="container-wide">
          <AnimateIn from="bottom" className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-caption text-brand-gold mb-1.5">
                  {activeCategory === "all" ? "Complete Portfolio" : CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </p>
                <h2 className="font-display font-bold text-brand-navy text-2xl sm:text-3xl">
                  {filtered.length} Project{filtered.length !== 1 ? "s" : ""}
                </h2>
              </div>
            </div>

            {/* Filter pills */}
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter projects by category"
            >
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={[
                      "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
                      isActive
                        ? "bg-brand-gold text-white shadow-sa-gold"
                        : "border border-gray-200 text-gray-500 hover:border-brand-gold/40 hover:text-brand-gold bg-white",
                    ].join(" ")}
                    aria-pressed={isActive}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </AnimateIn>

          {/* Grid */}
          {filtered.length === 0 ? (
            <AnimateIn from="bottom" className="py-20 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">No projects found</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  We have not yet tagged projects in this category. Try{" "}
                  <button
                    onClick={() => setActiveCategory("all")}
                    className="text-brand-gold underline underline-offset-2 hover:no-underline"
                  >
                    All Projects
                  </button>{" "}
                  to see our complete portfolio.
                </p>
              </div>
            </AnimateIn>
          ) : items.length === 0 ? (
            <AnimateIn from="bottom" className="py-24 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100">
                  <ImageIcon className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Portfolio Coming Soon</h3>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                  We are currently uploading our project showcase. Check back soon or
                  contact us to discuss your signage requirements.
                </p>
                <Link
                  href="/contact"
                  className="mt-2 inline-flex items-center gap-2 rounded-xl bg-brand-gold px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-gold-dark transition-colors"
                >
                  Contact Us <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </AnimateIn>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <AnimateIn key={item.id} from="bottom" delay={Math.min(i % 3, 2) * 80}>
                  <PortfolioCard item={item} index={i} />
                </AnimateIn>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CAPABILITIES ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-14">
            <p className="text-caption text-brand-gold mb-3">End-to-End Service</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(1.8rem,4vw,2.8rem)] leading-tight mb-4">
              Our Project Capabilities
            </h2>
            <p className="text-gray-500 text-[15px] max-w-xl mx-auto leading-relaxed">
              From the first phone call to the final sign-off — we manage every
              stage in-house, so you deal with one team from start to finish.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <AnimateIn key={cap.title} from="bottom" delay={i * 60}>
                  <div className="flex flex-col gap-3 rounded-2xl bg-white border border-gray-100 p-5 hover:border-brand-gold/30 hover:shadow-sa-sm transition-all duration-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/8">
                      <Icon className="h-5 w-5 text-brand-gold" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-navy text-sm mb-1">{cap.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{cap.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES SERVED ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-14">
            <p className="text-caption text-brand-gold mb-3">Industries We Serve</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(1.8rem,4vw,2.8rem)] leading-tight">
              Signage Across Every Sector
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <AnimateIn key={ind.label} from="bottom" delay={i * 50}>
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 p-4 hover:border-brand-gold/30 hover:bg-brand-gold/4 transition-all duration-200 group cursor-default text-center">
                    <Icon className="h-6 w-6 text-gray-400 group-hover:text-brand-gold transition-colors" />
                    <p className="text-[11px] font-medium text-gray-500 group-hover:text-brand-gold transition-colors leading-tight">
                      {ind.label}
                    </p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative py-24 bg-brand-navy overflow-hidden">
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
            <p className="text-caption text-brand-gold mb-4">Start Your Project</p>
            <h2 className="font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-tight mb-4">
              Planning Your Next{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#D4A017 0%,#F0C040 50%,#D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Signage Project?
              </span>
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-10 max-w-lg mx-auto">
              Tell us what you need. We will visit your site, design something
              remarkable, and give you a detailed quote — within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 text-sm font-semibold text-white shadow-sa-gold hover:bg-brand-gold-dark transition-all duration-200 active:scale-[0.98]"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/8 hover:border-brand-gold/40 transition-all duration-200 active:scale-[0.98]"
              >
                Contact Shreeji Art
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
