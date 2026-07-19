"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { AnimateIn } from "@/components/ui/animate-in";
import { GALLERY_CATEGORIES, GALLERY_FALLBACK_IMAGE } from "@/data/gallery";
import type { DisplayGalleryItem } from "@/data/gallery";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  items: DisplayGalleryItem[];
}

// ─── GalleryImage ─────────────────────────────────────────────────────────────

function GalleryImage({
  src,
  alt,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || GALLERY_FALLBACK_IMAGE);
    setErrored(false);
  }, [src]);

  if (errored) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1c1c2e] to-[#2a2a3e]">
        <svg
          aria-hidden="true"
          viewBox="0 0 64 64"
          className="w-12 h-12 text-[#4b5563]"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <rect x="8" y="16" width="48" height="36" rx="4" />
          <circle cx="32" cy="34" r="10" />
          <circle cx="32" cy="34" r="6" />
          <rect x="22" y="10" width="20" height="8" rx="4" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes ?? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
      className="object-cover motion-reduce:transition-none motion-reduce:transform-none"
      unoptimized={currentSrc.endsWith(".svg")}
      priority={priority}
      onError={() => {
        if (currentSrc !== GALLERY_FALLBACK_IMAGE) {
          setCurrentSrc(GALLERY_FALLBACK_IMAGE);
          return;
        }
        setErrored(true);
      }}
    />
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  items: DisplayGalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ items, activeIndex, onClose, onNavigate }: LightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const item = items[activeIndex];
  const total = items.length;

  const prev = useCallback(
    () => onNavigate((activeIndex - 1 + total) % total),
    [activeIndex, total, onNavigate]
  );
  const next = useCallback(
    () => onNavigate((activeIndex + 1) % total),
    [activeIndex, total, onNavigate]
  );

  // Focus close button on open
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab") {
        const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-lightbox-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/92 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Content panel */}
      <div ref={panelRef} className="relative z-10 w-full max-w-4xl flex flex-col items-center">
        {/* Close */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* Image container */}
        <div className="relative w-full aspect-[4/3] max-h-[65vh] rounded-xl overflow-hidden bg-[#1c1c2e] shadow-2xl">
          <GalleryImage
            src={item.image}
            alt={item.alt ?? item.title}
            sizes="(max-width: 768px) 95vw, 900px"
            priority={activeIndex === 0}
          />

          {/* Prev button */}
          {total > 1 && (
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M15 18 9 12l6-6"/>
              </svg>
            </button>
          )}

          {/* Next button */}
          {total > 1 && (
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M9 18 15 12 9 6"/>
              </svg>
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="mt-4 text-center px-4">
          <p id="gallery-lightbox-title" className="text-white font-semibold text-base">{item.title}</p>
          {item.description && (
            <p className="text-gray-400 text-sm mt-1 max-w-xl">{item.description}</p>
          )}
          <p className="text-brand-gold text-xs font-medium mt-1.5 uppercase tracking-widest">
            {item.category}
          </p>
        </div>

        {/* Dot indicators */}
        {total > 1 && (
          <div className="flex gap-1.5 mt-4" role="group" aria-label="Image navigation">
            {items.map((navItem, i) => (
              <button
                key={navItem.id}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === activeIndex ? "true" : undefined}
                onClick={() => onNavigate(i)}
                className={`h-6 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none ${
                  i === activeIndex
                    ? "bg-brand-gold w-8"
                    : "bg-white/30 hover:bg-white/50 w-6"
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {total > 1 && (
          <p className="text-gray-500 text-xs mt-2">
            {activeIndex + 1} / {total}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Hero Stats ───────────────────────────────────────────────────────────────

const HERO_STATS = [
  { value: "12", label: "Signage Categories" },
  { value: "24", label: "Sample Previews" },
  { value: "API", label: "Live Gallery Ready" },
];

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({
  category,
  onReset,
}: {
  category: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-sa-surface flex items-center justify-center mb-4">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="w-7 h-7 text-sa-faint"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M3 9h18M9 21V9"/>
        </svg>
      </div>
      <h3 className="text-sa-text font-semibold text-lg mb-1">
        No items in &ldquo;{category}&rdquo;
      </h3>
      <p className="text-sa-muted text-sm mb-6 max-w-xs">
        {category
          ? "This category has no gallery items yet. Browse all categories or check back soon."
          : "No gallery items found."}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="px-5 py-2 rounded-full bg-brand-gold text-white text-sm font-medium hover:bg-brand-gold/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      >
        View All
      </button>
    </div>
  );
}

// ─── GalleryClient ────────────────────────────────────────────────────────────

export default function GalleryClient({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Close lightbox when category changes
  useEffect(() => {
    setLightboxIndex(null);
  }, [activeCategory]);

  // Visible categories derived from actual items (preserving defined order)
  const visibleCategories = useMemo(() => {
    const present = new Set(items.map((i) => i.category));
    return GALLERY_CATEGORIES.filter(
      (c) => c.value === "" || present.has(c.value)
    );
  }, [items]);

  const filteredItems = useMemo(
    () =>
      activeCategory
        ? items.filter((i) => i.category === activeCategory)
        : items,
    [items, activeCategory]
  );

  const openLightbox = useCallback((index: number) => {
    lastFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    window.requestAnimationFrame(() => {
      lastFocusedElementRef.current?.focus();
      lastFocusedElementRef.current = null;
    });
  }, []);

  const navigateLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  return (
    <>
      <Navbar />
      <main>
      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-navy py-24 md:py-32">
        {/* Background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brand-gold/4 blur-3xl" />
          {/* Dot grid */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="g-dots" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#D4A017" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#g-dots)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimateIn from="bottom" duration={600}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse-subtle" />
              Our Work
            </span>
          </AnimateIn>

          <AnimateIn from="bottom" delay={80} duration={650}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Signage that{" "}
              <span className="text-brand-gold">Speaks</span> for You
            </h1>
          </AnimateIn>

          <AnimateIn from="bottom" delay={160} duration={650}>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              Browse our project gallery - 12 categories of premium signage
              crafted for businesses across Gujarat.
            </p>
          </AnimateIn>

          {/* Stats */}
          <AnimateIn from="bottom" delay={240} duration={650}>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {HERO_STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl font-display font-bold text-brand-gold">
                    {s.value}
                  </p>
                  <p className="text-gray-400 text-sm mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ── Category Filters ─────────────────────────────────────────────────── */}
      <section className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sa-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          {/* Horizontally scrollable on mobile, wrapping on desktop */}
          <div className="overflow-x-auto pb-1 -mb-1 scrollbar-none">
            <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap md:justify-center">
              {visibleCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  aria-pressed={activeCategory === cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={[
                    "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1 motion-reduce:transition-none",
                    activeCategory === cat.value
                      ? "bg-brand-gold text-white shadow-sa-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800",
                  ].join(" ")}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Gallery Grid ──────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        {items.length === 0 ? (
          // No items at all
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-sa-surface flex items-center justify-center mb-6">
              <svg
                aria-hidden="true"
                viewBox="0 0 64 64"
                className="w-10 h-10 text-sa-faint"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <rect x="8" y="16" width="48" height="36" rx="4" />
                <circle cx="32" cy="34" r="10" />
                <circle cx="32" cy="34" r="6" />
                <rect x="22" y="10" width="20" height="8" rx="4" />
              </svg>
            </div>
            <h2 className="text-sa-text font-display font-bold text-2xl mb-2">
              Gallery Coming Soon
            </h2>
            <p className="text-sa-muted text-base max-w-sm">
              We are uploading our project photos. Check back soon or contact us
              to see our work.
            </p>
            <Link
              href="/contact"
              className="mt-6 px-6 py-2.5 rounded-full bg-brand-gold text-white text-sm font-semibold hover:bg-brand-gold/90 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            category={activeCategory}
            onReset={() => setActiveCategory("")}
          />
        ) : (
          <>
            {/* Results count */}
            <p className="text-sa-muted text-sm mb-6">
              Showing{" "}
              <span className="text-sa-text font-medium">
                {filteredItems.length}
              </span>{" "}
              {filteredItems.length === 1 ? "item" : "items"}
              {activeCategory ? (
                <>
                  {" "}in{" "}
                  <span className="text-brand-gold font-medium">
                    {activeCategory}
                  </span>
                </>
              ) : null}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {filteredItems.map((item, i) => (
                <AnimateIn
                  key={item.id}
                  from="scale"
                  delay={Math.min(i * 40, 320)}
                  duration={500}
                >
                  <button
                    type="button"
                    onClick={() => openLightbox(i)}
                    aria-label={`View ${item.title}`}
                    className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-sa-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 shadow-sa-sm hover:shadow-sa-md transition-shadow duration-300 motion-reduce:transition-none"
                  >
                    {/* Image */}
                    <GalleryImage
                      src={item.image}
                      alt={item.alt ?? item.title}
                      priority={i < 8}
                    />

                    {/* Hover overlay */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none"
                    />

                    {/* Caption on hover */}
                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-smooth motion-reduce:transition-none motion-reduce:transform-none"
                    >
                      <p className="text-white text-xs font-semibold leading-tight truncate">
                        {item.title}
                      </p>
                      <p className="text-brand-gold text-[10px] mt-0.5 uppercase tracking-wider truncate">
                        {item.category}
                      </p>
                    </div>

                    {/* Sample badge */}
                    {item.placeholder && (
                      <div
                        aria-hidden="true"
                        className="absolute top-2 right-2 bg-brand-navy/70 backdrop-blur-sm border border-brand-gold/30 text-brand-gold text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      >
                        Sample
                      </div>
                    )}

                    {/* Zoom icon on hover */}
                    <div
                      aria-hidden="true"
                      className="absolute top-2 left-2 w-7 h-7 rounded-full bg-white/0 group-hover:bg-white/20 flex items-center justify-center transition-colors duration-200 motion-reduce:transition-none"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 motion-reduce:transition-none"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                      </svg>
                    </div>
                  </button>
                </AnimateIn>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────────────── */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}

      {/* ── CTA / Footer area ─────────────────────────────────────────────────── */}
      <section className="bg-sa-surface border-t border-sa-border py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimateIn from="bottom" duration={600}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-sa-text mb-4">
              Like What You See?
            </h2>
          </AnimateIn>
          <AnimateIn from="bottom" delay={80} duration={600}>
            <p className="text-sa-muted text-lg mb-8 max-w-xl mx-auto">
              Get in touch for a consultation and quote. We bring the same
              quality craftsmanship to every project - no matter the size.
            </p>
          </AnimateIn>
          <AnimateIn from="bottom" delay={160} duration={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 active:scale-[0.98] transition-all duration-200 shadow-sa-md hover:shadow-sa-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none"
              >
                Request a Quote
                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-sa-border-strong text-sa-text font-semibold hover:bg-sa-raised transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                View Services
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-sa-border-strong text-sa-text font-semibold hover:bg-sa-raised transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                View Portfolio
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-sa-border-strong text-sa-text font-semibold hover:bg-sa-raised transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Contact Us
              </Link>
            </div>
          </AnimateIn>

          {/* Trust signals */}
          <AnimateIn from="bottom" delay={240} duration={600}>
            <div className="flex flex-wrap justify-center gap-6 mt-12 text-sa-muted text-sm">
              {[
                "Site Survey Planning",
                "Timeline Coordination",
                "Installation Support",
                "Gujarat Project Coverage",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    className="w-4 h-4 text-brand-gold flex-shrink-0"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </AnimateIn>
        </div>
      </section>
    </main>
    </>
  );
}
