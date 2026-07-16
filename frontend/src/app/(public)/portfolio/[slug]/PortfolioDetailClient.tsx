"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import type { PortfolioItem } from "@/types";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Star, Tag,
  User2, Building2, ChevronLeft, ChevronRight,
  Lightbulb, Square, Type, Shield,
  Sparkles, Briefcase, ShoppingBag, Wrench,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const CARD_GRADIENTS = [
  "from-[#18120a] via-[#241a06] to-[#18120a]",
  "from-[#080e1c] via-[#0a1228] to-[#080e1c]",
  "from-[#100a1a] via-[#180e28] to-[#100a1a]",
  "from-[#0c1018] via-[#101828] to-[#0c1018]",
  "from-[#0c1014] via-[#10181e] to-[#0c1014]",
  "from-[#120a1c] via-[#1a0d2e] to-[#120a1c]",
  "from-[#080c18] via-[#0c1228] to-[#080c18]",
  "from-[#1a0c08] via-[#2a1208] to-[#1a0c08]",
];

const SERVICE_ICONS = [
  Lightbulb, Square, Type, Building2, Shield,
  Sparkles, Briefcase, ShoppingBag, Wrench,
];

function GradientHero({ item }: { item: PortfolioItem }) {
  const Icon = SERVICE_ICONS[item.id % SERVICE_ICONS.length];
  const grad = CARD_GRADIENTS[item.id % CARD_GRADIENTS.length];
  return (
    <div
      className={`w-full h-full bg-gradient-to-br ${grad} flex items-center justify-center`}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px,rgba(255,255,255,0.7) 1px,transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <Icon className="h-20 w-20 text-white/20" aria-hidden />
    </div>
  );
}

// Image with error fallback
function DetailImage({
  src, alt, fill = false, item, priority = false,
}: {
  src: string; alt: string; fill?: boolean; item: PortfolioItem; priority?: boolean;
}) {
  const [err, setErr] = useState(false);
  if (err) return <GradientHero item={item} />;
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 80vw"
        onError={() => setErr(true)}
        priority={priority}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={450}
      className="object-cover w-full h-full"
      onError={() => setErr(true)}
    />
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

function ImageGallery({ item }: { item: PortfolioItem }) {
  const images = (item.images ?? []).filter(Boolean);
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden h-64 sm:h-96 bg-gray-100">
        <GradientHero item={item} />
      </div>
    );
  }

  function prev() {
    setActive((a) => (a - 1 + images.length) % images.length);
  }
  function next() {
    setActive((a) => (a + 1) % images.length);
  }

  return (
    <div>
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden h-64 sm:h-96 bg-gray-100 mb-3">
        <DetailImage src={images[active]} alt={`${item.title} — image ${active + 1}`} fill item={item} priority={active === 0} />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={[
                    "h-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
                    i === active ? "w-5 bg-brand-gold" : "w-1.5 bg-white/40",
                  ].join(" ")}
                  aria-label={`Go to image ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={[
                "relative shrink-0 h-16 w-24 rounded-lg overflow-hidden border-2 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
                i === active ? "border-brand-gold" : "border-transparent opacity-60 hover:opacity-100",
              ].join(" ")}
              aria-label={`Thumbnail ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
            >
              <DetailImage src={src} alt={`Thumbnail ${i + 1}`} fill item={item} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Related card ────────────────────────────────────────────────────────────

function RelatedCard({ item, index }: { item: PortfolioItem; index: number }) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const firstImage = item.images?.find(Boolean);
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];

  return (
    <Link
      href={`/portfolio/${item.slug}`}
      className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-brand-gold/30 shadow-sm hover:shadow-sa-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
      aria-label={`Related project: ${item.title}`}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <Icon className="h-10 w-10 text-white/20" aria-hidden />
          </div>
        )}
        <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-xs font-semibold flex items-center gap-1.5">
            View Project <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>
      <div className="bg-white p-3.5">
        <h3 className="font-semibold text-sm text-brand-navy group-hover:text-brand-gold transition-colors line-clamp-1 mb-0.5">
          {item.title}
        </h3>
        {item.clientName && (
          <p className="text-xs text-gray-400">{item.clientName}</p>
        )}
      </div>
    </Link>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

interface PortfolioDetailClientProps {
  item: PortfolioItem;
  related: PortfolioItem[];
}

export default function PortfolioDetailClient({
  item, related,
}: PortfolioDetailClientProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero strip */}
      <div className="bg-[#080814] pt-16 pb-6">
        <div className="container-wide">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/portfolio" className="hover:text-brand-gold transition-colors">Portfolio</Link>
            <span>/</span>
            <span className="text-gray-400 line-clamp-1 max-w-[200px]">{item.title}</span>
          </nav>

          {/* Back link */}
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-brand-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
            Back to Portfolio
          </Link>

          {/* Title block */}
          <AnimateIn from="bottom">
            <div className="flex flex-wrap items-start gap-3 mb-2">
              <h1 className="font-display font-bold text-white text-[clamp(1.8rem,4vw,3rem)] leading-tight">
                {item.title}
              </h1>
              {item.isFeatured && (
                <span className="flex items-center gap-1 bg-brand-gold text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest self-start mt-2">
                  <Star className="h-3 w-3" aria-hidden="true" /> Featured
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {item.clientName && (
                <span className="flex items-center gap-1.5">
                  <User2 className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
                  {item.clientName}
                </span>
              )}
              {item.service?.name && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
                  {item.service.name}
                </span>
              )}
              {item.tags && item.tags.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
                  {item.tags.join(", ")}
                </span>
              )}
            </div>
          </AnimateIn>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 py-12 bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Left: gallery + description */}
            <div className="lg:col-span-2 space-y-8">
              <AnimateIn from="bottom">
                <ImageGallery item={item} />
              </AnimateIn>

              {item.description && (
                <AnimateIn from="bottom" delay={100}>
                  <div>
                    <h2 className="font-display font-bold text-brand-navy text-xl mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-brand-gold shrink-0" aria-hidden="true" />
                      Project Overview
                    </h2>
                    <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                </AnimateIn>
              )}

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <AnimateIn from="bottom" delay={140}>
                  <div>
                    <h3 className="font-semibold text-brand-navy text-sm mb-3 uppercase tracking-wider">
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-brand-gold border border-brand-gold/25 rounded-full px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </AnimateIn>
              )}
            </div>

            {/* Right: project details sidebar */}
            <AnimateIn from="right" delay={120}>
              <div className="space-y-5">
                {/* Project info card */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <h2 className="font-semibold text-brand-navy text-sm uppercase tracking-wider mb-4">
                    Project Details
                  </h2>
                  <dl className="space-y-3 text-sm">
                    {item.clientName && (
                      <div>
                        <dt className="text-gray-400 text-xs mb-0.5">Client</dt>
                        <dd className="font-medium text-gray-800">{item.clientName}</dd>
                      </div>
                    )}
                    {item.service?.name && (
                      <div>
                        <dt className="text-gray-400 text-xs mb-0.5">Service Type</dt>
                        <dd className="font-medium text-gray-800">{item.service.name}</dd>
                      </div>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div>
                        <dt className="text-gray-400 text-xs mb-0.5">Categories</dt>
                        <dd className="font-medium text-gray-800">{item.tags.join(", ")}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* CTA card */}
                <div className="rounded-2xl border border-brand-gold/20 bg-brand-gold/5 p-5">
                  <h3 className="font-semibold text-brand-navy text-sm mb-2">
                    Like what you see?
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    Get a free site survey and design concept for your project.
                    We respond within 24 hours.
                  </p>
                  <Link
                    href={`/quote?inspiration=${encodeURIComponent(item.title)}`}
                    className="group flex items-center justify-center gap-2 w-full rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-gold-dark transition-all duration-200 active:scale-[0.98]"
                  >
                    Request a Quote
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
                  </Link>
                </div>

                {/* Image count indicator */}
                {item.images && item.images.length > 0 && (
                  <p className="text-xs text-gray-400 text-center">
                    {item.images.length} image{item.images.length !== 1 ? "s" : ""} in this project
                  </p>
                )}
              </div>
            </AnimateIn>
          </div>
        </div>
      </main>

      {/* Related Projects */}
      {related.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="container-wide">
            <AnimateIn from="bottom" className="flex items-center justify-between mb-8">
              <div>
                <p className="text-caption text-brand-gold mb-1">More Work</p>
                <h2 className="font-display font-bold text-brand-navy text-2xl">Related Projects</h2>
              </div>
              <Link
                href="/portfolio"
                className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-brand-gold transition-colors"
              >
                View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </AnimateIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel, i) => (
                <AnimateIn key={rel.id} from="bottom" delay={i * 80}>
                  <RelatedCard item={rel} index={i} />
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <div className="absolute -top-16 -right-16 h-60 w-60 rounded-full bg-brand-gold/10 blur-[70px]" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-gold/8 blur-[50px]" />
        <div className="container-narrow relative z-10 text-center">
          <AnimateIn from="bottom">
            <h2 className="font-display font-bold text-white text-[clamp(1.6rem,3.5vw,2.6rem)] leading-tight mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
              Our team is ready to design and build signage that makes your
              brand impossible to ignore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-gold px-7 py-3.5 text-sm font-semibold text-white hover:bg-brand-gold-dark transition-all duration-200 active:scale-[0.98]"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none" aria-hidden="true" />
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
