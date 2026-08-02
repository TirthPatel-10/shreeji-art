"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import {
  ArrowRight,
  Shield, Settings, Lightbulb, Layers, CheckCircle2, Users,
  MessageSquare, MapPin, Palette, Package, Search, Truck,
  Building2, Zap, Square, Type, Sparkles, Briefcase,
  ShoppingBag, Wrench, Paintbrush, Coffee, Activity,
  BookOpen, Home, ShoppingCart, Factory, Star,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SIGN_TYPES = [
  { icon: Lightbulb, label: "LED Signs",    bg: "bg-brand-gold/10", color: "text-brand-gold" },
  { icon: Square,    label: "Acrylic",      bg: "bg-white/[0.04]",   color: "text-brand-gold" },
  { icon: Type,      label: "3D Letters",   bg: "bg-brand-gold/10", color: "text-brand-gold" },
  { icon: Building2, label: "ACP Signage",  bg: "bg-white/[0.04]",   color: "text-brand-gold" },
  { icon: Shield,    label: "SS Signs",     bg: "bg-brand-gold/10", color: "text-brand-gold" },
  { icon: Sparkles,  label: "Glow Signs",   bg: "bg-white/[0.04]",   color: "text-brand-gold" },
];

const VALUES = [
  {
    icon: Shield,
    title: "Quality",
    desc: "Every sign leaves our workshop to a finish standard we are proud to put our name on — no shortcuts, no compromises.",
  },
  {
    icon: Settings,
    title: "Precision",
    desc: "From CNC cutting to electrical wiring, tight tolerances and careful craftsmanship define everything we make.",
  },
  {
    icon: Lightbulb,
    title: "Creativity",
    desc: "We bring design thinking to every brief — balancing brand identity, visual impact, and practical fabrication.",
  },
  {
    icon: Layers,
    title: "Durability",
    desc: "We specify materials built for Gujarat's climate — weather-resistant, UV-stable, and long-lasting.",
  },
  {
    icon: CheckCircle2,
    title: "Reliability",
    desc: "We commit to timelines and honour them. Our clients trust us with their brand because we earn it repeatedly.",
  },
  {
    icon: Users,
    title: "Client Commitment",
    desc: "We treat each project as a partnership — open communication, regular updates, and clear accountability.",
  },
];

const DIFFERENTIATORS = [
  {
    title: "In-house design and planning",
    desc: "Our design team works alongside fabrication from day one — no hand-off gaps, no lost-in-translation briefs.",
  },
  {
    title: "Material guidance you can trust",
    desc: "We recommend substrates and finishes based on your environment and longevity requirements — not upselling margins.",
  },
  {
    title: "Custom fabrication, entirely in-house",
    desc: "CNC cutting, metal bending, LED assembly, and all finishing — handled under one roof in Ahmedabad.",
  },
  {
    title: "Modern manufacturing methods",
    desc: "We invest in equipment that produces tighter tolerances, cleaner edges, and better long-term results.",
  },
  {
    title: "Professional finishing standards",
    desc: "Powder coating, vinyl application, acrylic polishing, and chemical etching are done with the same care as fabrication.",
  },
  {
    title: "LED and electrical expertise",
    desc: "Our electrical team designs, wires, and commissions lighting systems correctly — safe, energy-efficient, and long-lived.",
  },
  {
    title: "Full on-site installation",
    desc: "Our installation team handles structural mounting, electrical connections, testing, and site clean-up on handover.",
  },
  {
    title: "End-to-end project coordination",
    desc: "One point of contact manages your project from site survey to sign-off — no fragmented suppliers, no confusion.",
  },
];

const PROCESS = [
  { step: "01", icon: MessageSquare, title: "Consultation",          desc: "We begin with a conversation to understand your brand, location, timeline, and budget requirements." },
  { step: "02", icon: MapPin,        title: "Site Survey",           desc: "We visit your site to measure dimensions, assess mounting surfaces, and check electrical access at no charge." },
  { step: "03", icon: Palette,       title: "Design & Approval",     desc: "Our studio produces layouts and 3D renders for your review. We refine until you are fully satisfied before production begins." },
  { step: "04", icon: Package,       title: "Material Selection",    desc: "We recommend the right substrates, finishes, and lighting components for your specific environment and longevity needs." },
  { step: "05", icon: Settings,      title: "Fabrication",           desc: "Your sign is built in our Ahmedabad workshop with precision cutting, careful assembly, and quality finishing at every stage." },
  { step: "06", icon: Search,        title: "Quality Inspection",    desc: "Every sign is checked against specification before leaving our workshop — dimensions, finish, and electrical function." },
  { step: "07", icon: Truck,         title: "Delivery & Installation", desc: "We deliver, mount, wire, and test your sign on site — leaving the location clean and the sign fully operational." },
  { step: "08", icon: CheckCircle2,  title: "Final Handover",        desc: "We walk you through the installation, confirm everything is working, and provide any maintenance guidance needed." },
];

const INDUSTRIES = [
  { icon: ShoppingBag,  label: "Retail"                  },
  { icon: Coffee,       label: "Restaurants & Cafés"     },
  { icon: Building2,    label: "Corporate Offices"        },
  { icon: Activity,     label: "Hospitals & Clinics"     },
  { icon: BookOpen,     label: "Schools & Colleges"      },
  { icon: Sparkles,     label: "Hotels & Hospitality"    },
  { icon: Home,         label: "Real Estate"             },
  { icon: Factory,      label: "Manufacturing"           },
  { icon: ShoppingCart, label: "Shopping Centres"        },
  { icon: Wrench,       label: "Industrial Facilities"   },
];

const CAPABILITIES = [
  { icon: Building2,   title: "Indoor Signage",         desc: "Reception walls, wayfinding, office branding, retail interiors." },
  { icon: Zap,         title: "Outdoor Signage",         desc: "Fascia boards, hoardings, pylon signs, and building facades." },
  { icon: Lightbulb,   title: "Illuminated Signage",     desc: "LED signs, backlit flex boards, halo-lit 3D letters." },
  { icon: Square,      title: "Acrylic & Metal",         desc: "Precision-cut and fabricated from acrylic, aluminium, and stainless steel." },
  { icon: Layers,      title: "ACP Structures",          desc: "Lightweight, weather-resistant ACP panels for large-format applications." },
  { icon: MapPin,      title: "Wayfinding Systems",      desc: "Directory boards, floor maps, directional arrows, zone demarcation." },
  { icon: Briefcase,   title: "Office Branding",         desc: "3D logos, branded walls, conference graphics, motivational murals." },
  { icon: ShoppingBag, title: "Retail Branding",         desc: "Storefront fascias, window graphics, in-store POS and zone signage." },
  { icon: Paintbrush,  title: "Custom Finishing",        desc: "Powder coat, vinyl, chemical etch, or chrome — any RAL colour or texture." },
];

const TRUST_PILLARS = [
  {
    icon: Layers,
    title: "Durable Materials",
    desc: "We source substrates rated for UV exposure, humidity, and the temperature extremes common across Gujarat. Signs built to last years, not months.",
  },
  {
    icon: Settings,
    title: "Careful Fabrication",
    desc: "Every joint, edge, and finish is held to a consistent standard across all our projects — regardless of size or budget.",
  },
  {
    icon: CheckCircle2,
    title: "Reliable Performance",
    desc: "Our electrical components carry standard warranties. Our structural work is built to hold. We stand behind everything we make.",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AboutClient() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0B0B14] overflow-hidden pt-20 pb-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0B14] via-brand-navy to-[#0B0B14]" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.15) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-brand-gold/6 blur-[120px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-brand-gold/4 blur-[80px] pointer-events-none" aria-hidden="true" />

        <div className="container-wide relative z-10 py-24 sm:py-28 lg:py-32">
          <AnimateIn from="bottom" className="text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
              <span className="text-gray-600" aria-hidden="true">/</span>
              <span className="text-gray-400">About</span>
            </nav>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/25 bg-brand-gold/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse-subtle" />
              About Shreeji Art
            </div>

            {/* H1 */}
            <h1 className="font-display font-bold text-white leading-[1.04] tracking-tight text-[clamp(2.5rem,5vw,4rem)] mb-6">
              Crafting Signs That{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#D4A017 0%,#F0C040 50%,#D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Build Stronger Brands
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-400 text-base sm:text-lg leading-8 max-w-2xl mx-auto mb-10">
              Shreeji Art designs, fabricates, and installs premium indoor and
              outdoor signage for commercial, retail, corporate, and industrial
              clients across Gujarat — entirely in-house, from concept to
              completion.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-6 py-3 text-sm font-semibold text-white hover:bg-brand-gold-dark transition-all duration-200 active:scale-[0.98]"
              >
                Request a Quote
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/8 hover:border-brand-gold/40 transition-all duration-200 active:scale-[0.98]"
              >
                Explore Our Work
              </Link>
            </div>

            {/* Service type pills */}
            <div
              className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto border-t border-white/8 pt-10"
              role="list"
              aria-label="Our sign categories"
            >
              {[
                "LED Signs", "Acrylic Signs", "3D Letters", "ACP Signage",
                "SS Signs", "Office Branding", "Retail Branding", "Wayfinding",
              ].map((label) => (
                <span
                  key={label}
                  role="listitem"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-gray-400"
                >
                  {label}
                </span>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── COMPANY STORY ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F8F6F2] py-24 sm:py-28 lg:py-32">
        <div
          className="absolute inset-0 opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(11,11,20,0.35) 1px,transparent 1px),linear-gradient(90deg,rgba(11,11,20,0.35) 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="container-wide relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Text */}
          <AnimateIn from="left">
            <p className="text-caption text-brand-gold mb-3">Who We Are</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2.25rem,4vw,3.4rem)] leading-[1.04] mb-7">
              A Signage Company Built on Craft and Accountability
            </h2>
            <div className="space-y-5 text-gray-600 text-base sm:text-lg leading-8">
              <p>
                Shreeji Art is a premium signage manufacturing and branding company
                based in Ahmedabad, Gujarat. We specialise in designing, fabricating,
                and installing custom indoor and outdoor signage for commercial,
                retail, corporate, and industrial clients across Gujarat.
              </p>
              <p>
                Every sign we make is built entirely in-house — from the initial
                concept and material selection through to fabrication, finishing, and
                on-site installation. This end-to-end ownership helps us maintain
                consistent quality at every stage, respond quickly to changes, and
                deliver projects on time.
              </p>
              <p>
                We work with businesses of all sizes: a single retail shop fascia, a
                multi-site corporate rollout, or a complete industrial safety signage
                system. Our Ahmedabad workshop is equipped for LED electrical work,
                precision metalwork, CNC cutting, vinyl printing, and every type of
                sign finishing — everything your project requires under one roof.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors"
              >
                See all services
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </AnimateIn>

          {/* Visual panel */}
          <AnimateIn from="right" delay={120}>
            <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#0B0B14] via-brand-navy to-[#0B0B14] p-8 border border-white/10 shadow-[0_32px_90px_-56px_rgba(11,11,20,0.75)]">
              {/* Dot texture */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                aria-hidden="true"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.8) 1px,transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              />
              {/* Gold accent orb */}
              <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-brand-gold/10 blur-2xl" aria-hidden="true" />

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 mb-4 relative z-10">
                What we make
              </p>

              <div className="grid grid-cols-2 gap-3 relative z-10" role="list" aria-label="Sign categories">
                {SIGN_TYPES.map(({ icon: Icon, label, bg, color }) => (
                  <div
                    key={label}
                    role="listitem"
                    className="flex items-center gap-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5 transition-all duration-[250ms] hover:-translate-y-1 hover:bg-white/[0.07] hover:border-brand-gold/20 motion-reduce:transition-none motion-reduce:transform-none"
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg}`}>
                      <Icon className={`h-4 w-4 ${color}`} aria-hidden="true" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-white/[0.06] pt-4 flex items-center gap-2 relative z-10">
                <Star className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
                <p className="text-[11px] text-gray-500">
                  And more — office branding, retail, ACP, wayfinding, industrial
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F2EEE6] py-24 sm:py-28 lg:py-32">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-brand-gold/8 blur-[110px]" aria-hidden="true" />
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-12">
            <p className="text-caption text-brand-gold mb-3">Purpose & Direction</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2.25rem,4vw,3.35rem)] leading-[1.05]">
              Mission &amp; Vision
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Mission */}
            <AnimateIn from="left" delay={60}>
              <div className="h-full rounded-[2rem] bg-[#F8F6F2] border border-brand-gold/20 p-8 shadow-[0_24px_70px_-54px_rgba(11,11,20,0.45)] transition-all duration-[250ms] hover:-translate-y-1 hover:border-brand-gold/35 motion-reduce:transition-none motion-reduce:transform-none md:translate-y-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-gold/25 mb-6">
                  <Star className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-brand-navy text-2xl mb-4">Our Mission</h3>
                <p className="text-gray-600 text-base leading-8">
                  To deliver premium-quality signage solutions that combine
                  creativity, durability, and precision craftsmanship — helping
                  businesses create a strong, lasting visual presence.
                </p>
              </div>
            </AnimateIn>

            {/* Vision */}
            <AnimateIn from="right" delay={60}>
              <div className="h-full rounded-[2rem] bg-[#0B0B14] border border-white/10 p-8 shadow-[0_28px_80px_-54px_rgba(11,11,20,0.7)] transition-all duration-[250ms] hover:-translate-y-1 hover:border-brand-gold/25 motion-reduce:transition-none motion-reduce:transform-none">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-gold/25 mb-6">
                  <Lightbulb className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-white text-2xl mb-4">Our Vision</h3>
                <p className="text-gray-300/80 text-base leading-8">
                  To build long-term trust as a signage solution provider by
                  delivering dependable quality, modern design,
                  and outstanding customer service on every project.
                </p>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ──────────────────────────────────────────────────── */}
      <section className="bg-[#F8F6F2] py-24 sm:py-28 lg:py-32">
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-14">
            <p className="text-caption text-brand-gold mb-3">What Drives Us</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2.25rem,4vw,3.35rem)] leading-[1.05] mb-5">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-8">
              These principles guide every project decision — from material
              selection to how we communicate with clients.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((val, i) => {
              const Icon = val.icon;
              return (
                <AnimateIn key={val.title} from="bottom" delay={i * 60}>
                  <div className="flex h-full flex-col gap-4 rounded-[1.75rem] border border-brand-navy/10 bg-[#F2EEE6]/65 p-8 transition-all duration-[250ms] hover:-translate-y-1 hover:border-brand-gold/35 hover:bg-white motion-reduce:transition-none motion-reduce:transform-none">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-gold/25">
                      <Icon className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-navy text-lg mb-2">{val.title}</h3>
                      <p className="text-sm sm:text-[15px] text-gray-600 leading-7">{val.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT MAKES US DIFFERENT ───────────────────────────────────────── */}
      <section className="py-24 sm:py-28 lg:py-32 bg-[#0B0B14] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14] via-brand-navy/35 to-[#0B0B14]" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(135deg,rgba(217,165,20,0.22) 1px,transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
        <div className="absolute top-0 right-1/3 h-64 w-64 rounded-full bg-brand-gold/5 blur-[100px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-brand-gold/4 blur-[80px] pointer-events-none" aria-hidden="true" />

        <div className="container-wide relative z-10">
          <AnimateIn from="bottom" className="text-center mb-14">
            <p className="text-caption text-brand-gold mb-3">Why Shreeji Art</p>
            <h2 className="font-display font-bold text-white text-[clamp(2.25rem,4vw,3.45rem)] leading-[1.05] mb-5">
              What Makes Us Different
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-8">
              We are not a broker or a print shop. We are a manufacturing company
              with in-house design, fabrication, and installation — under one roof.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {DIFFERENTIATORS.map((item, i) => (
              <AnimateIn key={item.title} from="bottom" delay={Math.floor(i / 2) * 60}>
                <div className="group flex h-full gap-4 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-brand-gold/25 hover:bg-white/[0.06] motion-reduce:transition-none motion-reduce:transform-none">
                  <CheckCircle2
                    className="h-5 w-5 shrink-0 text-brand-gold/85 mt-0.5 transition-colors duration-[250ms] group-hover:text-brand-gold motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="font-semibold text-white text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-7">{item.desc}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PROCESS ──────────────────────────────────────────────────── */}
      <section className="bg-[#F2EEE6] py-24 sm:py-28 lg:py-32">
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-14">
            <p className="text-caption text-brand-gold mb-3">How We Work</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2.25rem,4vw,3.35rem)] leading-[1.05] mb-5">
              Our 8-Step Process
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-8">
              Every project, regardless of size, follows the same rigorous process —
              no shortcuts, no surprises at any stage.
            </p>
          </AnimateIn>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
            {PROCESS.map((step, i) => {
              const Icon = step.icon;
              return (
                <AnimateIn key={step.step} from="bottom" delay={i * 50}>
                  <div className="relative flex h-full flex-col gap-4 rounded-[1.6rem] border border-brand-navy/10 bg-[#F8F6F2] p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-brand-gold/35 motion-reduce:transition-none motion-reduce:transform-none">
                    {/* Step badge */}
                    <div className="absolute -top-3.5 left-6 font-mono text-xs font-bold text-brand-gold bg-[#F2EEE6] border border-brand-gold/30 rounded-full px-2.5 py-0.5">
                      {step.step}
                    </div>
                    <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-gold/25">
                      <Icon className="h-[1.125rem] w-[1.125rem] text-brand-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-navy text-base mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-7">{step.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES SERVED ─────────────────────────────────────────────── */}
      <section className="bg-[#F8F6F2] py-24 sm:py-28 lg:py-32">
        <div className="container-wide">
          <AnimateIn from="bottom" className="text-center mb-12">
            <p className="text-caption text-brand-gold mb-3">Industries We Serve</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.05]">
              Signage for Every Sector
            </h2>
          </AnimateIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-x-4 gap-y-6 max-w-5xl mx-auto">
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <AnimateIn key={ind.label} from="bottom" delay={i * 40}>
                  <div className="group flex cursor-default flex-col items-center gap-3 rounded-[1.5rem] border border-brand-navy/10 bg-transparent p-5 text-center transition-all duration-[250ms] hover:-translate-y-1 hover:border-brand-gold/35 hover:bg-white/45 motion-reduce:transition-none motion-reduce:transform-none">
                    <Icon
                      className="h-6 w-6 text-brand-gold/75 group-hover:text-brand-gold transition-colors duration-[250ms]"
                      aria-hidden="true"
                    />
                    <p className="text-xs font-semibold text-gray-600 group-hover:text-brand-navy transition-colors duration-[250ms] leading-tight">
                      {ind.label}
                    </p>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES OVERVIEW ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#F2EEE6] py-24 sm:py-28 lg:py-32">
        <div
          className="absolute inset-0 opacity-[0.035]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px,rgba(11,11,20,0.55) 1px,transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="container-wide relative z-10">
          <AnimateIn from="bottom" className="text-center mb-12">
            <p className="text-caption text-brand-gold mb-3">What We Deliver</p>
            <h2 className="font-display font-bold text-brand-navy text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.05] mb-4">
              Our Capabilities
            </h2>
            <p className="text-gray-600 text-base max-w-xl mx-auto leading-8">
              A compact overview of what we build and install.{" "}
              <Link
                href="/services"
                className="text-brand-gold hover:text-brand-gold-dark underline underline-offset-2 transition-colors"
              >
                See full service details
              </Link>
              .
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CAPABILITIES.map((cap, i) => {
              const Icon = cap.icon;
              return (
                <AnimateIn key={cap.title} from="bottom" delay={i * 50}>
                  <div className="group flex h-full items-start gap-5 rounded-[1.75rem] border border-brand-navy/10 bg-[#F8F6F2] p-6 transition-all duration-[250ms] hover:-translate-y-1 hover:border-brand-gold/35 hover:bg-white motion-reduce:transition-none motion-reduce:transform-none">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/25">
                      <Icon className="h-[1.125rem] w-[1.125rem] text-brand-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-brand-navy text-base mb-2">{cap.title}</h3>
                      <p className="text-sm text-gray-600 leading-7">{cap.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CRAFTSMANSHIP & TRUST ─────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-28 lg:py-32 bg-[#0B0B14] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B14] via-brand-navy/45 to-[#0B0B14]" aria-hidden="true" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand-gold/5 blur-[140px] pointer-events-none" aria-hidden="true" />

        <div className="container-wide relative z-10">
          <AnimateIn from="bottom" className="text-center mb-14">
            <p className="text-caption text-brand-gold mb-3">Built to Last</p>
            <h2 className="font-display font-bold text-white text-[clamp(2.25rem,4vw,3.45rem)] leading-[1.05] mb-5">
              Signs Crafted for the Long Term
            </h2>
            <p className="text-gray-400 text-base sm:text-lg leading-8 max-w-2xl mx-auto">
              Our commitment does not end at installation. We use durable
              materials, precise fabrication methods, and proper electrical
              work so that every sign continues to represent your brand well —
              months and years after handover.
            </p>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {TRUST_PILLARS.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <AnimateIn key={pillar.title} from="bottom" delay={i * 80}>
                  <div className="flex h-full flex-col gap-5 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-8 text-center transition-all duration-[250ms] hover:-translate-y-1 hover:border-brand-gold/25 hover:bg-white/[0.06] motion-reduce:transition-none motion-reduce:transform-none">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-gold/25">
                      <Icon className="h-5 w-5 text-brand-gold" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-3">{pillar.title}</h3>
                      <p className="text-sm sm:text-[15px] text-gray-400 leading-7">{pillar.desc}</p>
                    </div>
                  </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-24 sm:py-28 lg:py-32 bg-[#0B0B14] overflow-hidden">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-gold/10 blur-[80px]" aria-hidden="true" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-brand-gold/8 blur-[60px]" aria-hidden="true" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.2) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="container-narrow relative z-10 text-center">
          <AnimateIn from="bottom">
            <p className="text-caption text-brand-gold mb-4">Start Your Project</p>
            <h2 className="font-display font-bold text-white text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.05] mb-5">
              Let&apos;s Build a Sign That{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#D4A017 0%,#F0C040 50%,#D4A017 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Represents Your Brand
              </span>
            </h2>
            <p className="text-gray-400 text-base leading-8 mb-10 max-w-xl mx-auto">
              Tell us about your project. We will visit your site, design something
              that works for your space, and give you a clear quote with practical timelines.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 text-sm font-semibold text-white shadow-sa-gold hover:bg-brand-gold-dark transition-all duration-200 active:scale-[0.98]"
              >
                Request a Quote
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/8 hover:border-brand-gold/40 transition-all duration-200 active:scale-[0.98]"
              >
                View Portfolio
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/8 hover:border-brand-gold/40 transition-all duration-200 active:scale-[0.98]"
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
