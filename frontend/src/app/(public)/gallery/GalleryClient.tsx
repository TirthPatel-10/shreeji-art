"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  Grid3X3,
  ImageOff,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import { GALLERY_FALLBACK_IMAGE } from "@/data/gallery";
import type { DisplayGalleryItem } from "@/data/gallery";

export type GalleryStatus = "loading" | "ready" | "empty" | "error";

interface Props {
  items: DisplayGalleryItem[];
  status: GalleryStatus;
}

const GALLERY_STATS = [
  { value: "150+", label: "Projects", icon: Camera },
  { value: "12+", label: "Categories", icon: Grid3X3 },
  { value: "8+", label: "Years", icon: BadgeCheck },
];

interface GalleryImageProps {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

function GalleryImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
}: GalleryImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || GALLERY_FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src || GALLERY_FALLBACK_IMAGE);
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-navy to-brand-deep">
        <ImageOff className="h-10 w-10 text-white/35" aria-hidden="true" />
      </div>
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      unoptimized={currentSrc.endsWith(".svg")}
      onError={() => {
        if (currentSrc !== GALLERY_FALLBACK_IMAGE) {
          setCurrentSrc(GALLERY_FALLBACK_IMAGE);
          return;
        }

        setHasError(true);
      }}
    />
  );
}

function galleryAlt(item: DisplayGalleryItem, index?: number) {
  return item.alt || item.title || `Shreeji Art gallery image${index !== undefined ? ` ${index + 1}` : ""}`;
}

function GallerySkeletonGrid() {
  return (
    <div
      className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4"
      aria-label="Loading gallery images"
    >
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className={`mb-5 break-inside-avoid overflow-hidden rounded-none bg-white shadow-sa-xs ${
            index % 6 === 1
              ? "h-80"
              : index % 6 === 2
                ? "h-72"
                : index % 6 === 3
                  ? "h-[28rem]"
                  : index % 6 === 5
                    ? "h-64"
                    : "h-96"
          }`}
        >
          <div className="h-full w-full animate-pulse bg-gradient-to-br from-[#F8F6F2] via-[#F2EEE6] to-brand-gold/10" />
        </div>
      ))}
    </div>
  );
}

function GalleryState({
  type,
  activeCategory,
  onReset,
  onRetry,
}: {
  type: "empty" | "filter-empty" | "error";
  activeCategory?: string;
  onReset?: () => void;
  onRetry?: () => void;
}) {
  const copy = {
    empty: {
      title: "Gallery is being curated",
      body: "Published signage photography will appear here as completed work is prepared for display.",
      icon: Camera,
      action: "Contact us",
    },
    "filter-empty": {
      title: "No images in this category yet",
      body: activeCategory
        ? `Published ${activeCategory} images will appear here once they are ready.`
        : "Try another gallery filter.",
      icon: ImageOff,
      action: "View all images",
    },
    error: {
      title: "Gallery could not load",
      body: "The gallery API did not respond. Retry the request or check the server connection.",
      icon: RefreshCw,
      action: "Retry",
    },
  }[type];

  const Icon = copy.icon;

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-brand-navy/10 bg-white px-6 py-14 text-center shadow-[0_24px_70px_rgba(18,20,38,0.08)]">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="font-display text-2xl font-semibold text-brand-navy">
        {copy.title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-gray-600">
        {copy.body}
      </p>
      {type === "empty" ? null : (
        <button
          type="button"
          onClick={type === "error" ? onRetry : onReset}
          className="mt-7 inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-navy shadow-sa-gold transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transform-none motion-reduce:transition-none"
        >
          {copy.action}
        </button>
      )}
    </div>
  );
}

function Lightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: {
  items: DisplayGalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const item = items[activeIndex];
  const total = items.length;

  const previous = useCallback(() => {
    onNavigate((activeIndex - 1 + total) % total);
  }, [activeIndex, onNavigate, total]);

  const next = useCallback(() => {
    onNavigate((activeIndex + 1) % total);
  }, [activeIndex, onNavigate, total]);

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || total < 2) return;

    const delta = event.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(delta) < 48) return;
    if (delta > 0) previous();
    else next();
  };

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [next, onClose, previous]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery image preview"
      className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-5 sm:px-5"
    >
      <button
        type="button"
        aria-label="Close gallery preview"
        className="absolute inset-0 cursor-default bg-[#050610]/92 backdrop-blur-xl"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex h-full w-full max-w-7xl flex-col justify-center gap-4 outline-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/72 backdrop-blur-md">
            {activeIndex + 1} / {total}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close gallery preview"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-[250ms] hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div className="relative h-full max-h-[78vh] min-h-[320px] w-full overflow-hidden rounded-none bg-brand-navy shadow-2xl">
            <GalleryImage
              src={item.image}
              alt={galleryAlt(item, activeIndex)}
              sizes="100vw"
              priority
              className="object-contain"
            />
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={previous}
                aria-label="Previous gallery image"
                className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-all duration-[250ms] hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none sm:flex lg:-left-6"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next gallery image"
                className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-all duration-[250ms] hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none sm:flex lg:-right-6"
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          ) : null}
        </div>

        {total > 1 ? (
          <div className="flex items-center justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous gallery image"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-[250ms] hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next gallery image"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-[250ms] hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function GalleryClient({ items, status }: Props) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const visibleCategories = useMemo(() => {
    const liveCategories = Array.from(
      new Set(items.map((item) => item.category).filter(Boolean))
    )
      .sort((a, b) => a.localeCompare(b))
      .map((category) => ({ label: category, value: category }));

    return [{ label: "All", value: "" }, ...liveCategories];
  }, [items]);

  const filteredItems = useMemo(
    () =>
      activeCategory
        ? items.filter((item) => item.category === activeCategory)
        : items,
    [activeCategory, items]
  );

  useEffect(() => {
    setLightboxIndex(null);
  }, [activeCategory]);

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

  const onGridKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(index);
    }
  };

  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-[#F8F6F2] text-brand-navy">
        <section className="relative isolate border-b border-white/10 pt-28">
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_20%,rgba(217,165,20,0.14),transparent_34%),radial-gradient(circle_at_82%_0%,rgba(255,255,255,0.07),transparent_30%),linear-gradient(135deg,#070917_0%,#0B1024_52%,#050610_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-10 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:64px_64px]"
            aria-hidden="true"
          />
          <div
            className="absolute right-[-6rem] top-12 -z-10 h-72 w-72 rotate-12 rounded-[2rem] border border-brand-gold/40 opacity-[0.045] sm:h-96 sm:w-96"
            aria-hidden="true"
          />
          <div
            className="absolute right-[14%] top-[38%] -z-10 h-px w-72 bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent opacity-[0.04]"
            aria-hidden="true"
          />
          <div
            className="absolute bottom-10 left-[8%] -z-10 h-24 w-72 rounded-full border border-white/40 opacity-[0.03]"
            aria-hidden="true"
          />
          <div
            className="absolute left-[6%] top-[38%] -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.10),transparent_70%)] blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-[-5%] top-1/2 -z-10 hidden h-[78%] w-[48%] -translate-y-1/2 opacity-[0.12] mix-blend-luminosity [mask-image:radial-gradient(ellipse_at_center,black_0%,black_42%,transparent_78%)] lg:block"
            aria-hidden="true"
          >
            {[
              {
                src: "/gallery/led-sign/led-sign-01.svg",
                className: "absolute right-[8%] top-[2%] h-[42%] w-[54%]",
              },
              {
                src: "/gallery/acrylic/acrylic-01.svg",
                className: "absolute left-[4%] top-[20%] h-[38%] w-[46%]",
              },
              {
                src: "/gallery/custom-fabrication/custom-fabrication-01.svg",
                className: "absolute bottom-[8%] right-[2%] h-[46%] w-[58%]",
              },
              {
                src: "/gallery/installation/installation-01.svg",
                className: "absolute bottom-[3%] left-[16%] h-[32%] w-[40%]",
              },
            ].map((image) => (
              <div key={image.src} className={image.className}>
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="32vw"
                  className="object-cover grayscale contrast-125 brightness-110"
                  unoptimized
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(11,11,20,0.20)_48%,#0B0B14_82%)]" />
            <div className="absolute inset-0 bg-brand-gold/10 mix-blend-soft-light" />
          </div>

          <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pt-14 lg:px-8 lg:pb-20 lg:pt-14">
            <div className="max-w-[46rem] lg:max-w-[58%]">
              <AnimateIn from="bottom" duration={560}>
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_16px_rgba(212,160,23,0.85)]" />
                  Project Gallery
                </span>
                <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Our Work
                </h1>
              </AnimateIn>
              <AnimateIn from="bottom" delay={90} duration={560}>
                <p className="mt-7 max-w-[620px] text-lg leading-[1.8] text-white/80">
                  A clean visual archive of Shreeji Art signage, fabrication,
                  branding, and installation work.
                </p>
              </AnimateIn>
              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
                {GALLERY_STATS.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <AnimateIn key={stat.label} from="bottom" delay={160 + index * 70} duration={520}>
                      <div
                        className="group relative h-full overflow-hidden rounded-[18px] border border-brand-gold/20 bg-white/[0.05] p-4 shadow-[0_12px_34px_rgba(0,0,0,0.10)] backdrop-blur-md transition-all duration-[250ms] ease-out hover:-translate-y-1 hover:border-brand-gold/[0.32] hover:bg-white/[0.065] hover:shadow-[0_18px_46px_rgba(0,0,0,0.18)] motion-reduce:transform-none"
                      >
                        {index > 0 ? (
                          <div className="absolute left-0 top-4 hidden h-12 w-px bg-white/10 sm:block" aria-hidden="true" />
                        ) : null}
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/[0.12] text-brand-gold shadow-[0_0_20px_rgba(217,165,20,0.14)] transition-all duration-[250ms] group-hover:border-brand-gold/45 group-hover:brightness-110">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <p className="font-display text-3xl font-semibold leading-none text-brand-gold">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/[0.88]">
                          {stat.label}
                        </p>
                      </div>
                    </AnimateIn>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-16 z-30 border-b border-brand-navy/10 bg-[#F8F6F2]/90 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div
              className="flex gap-3 overflow-x-auto pb-1 scrollbar-none"
              aria-label="Gallery categories"
            >
              {visibleCategories.map((category) => {
                const isActive = activeCategory === category.value;

                return (
                  <button
                    key={category.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(category.value)}
                    className={[
                      "relative shrink-0 rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-[250ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F6F2] motion-reduce:transition-none",
                      isActive
                        ? "border-brand-gold bg-brand-gold text-brand-navy shadow-[0_14px_32px_rgba(217,165,20,0.18)]"
                        : "border-brand-navy/15 bg-brand-navy/[0.035] text-brand-navy/70 hover:border-brand-gold/45 hover:bg-white hover:text-brand-navy",
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-[90rem] px-4 py-14 sm:px-6 sm:py-[4.5rem] lg:px-8 lg:py-20">
          <div
            className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent"
            aria-hidden="true"
          />
          {status === "loading" ? (
            <GallerySkeletonGrid />
          ) : status === "error" ? (
            <GalleryState type="error" onRetry={() => router.refresh()} />
          ) : items.length === 0 ? (
            <GalleryState type="empty" />
          ) : filteredItems.length === 0 ? (
            <GalleryState
              type="filter-empty"
              activeCategory={activeCategory}
              onReset={() => setActiveCategory("")}
            />
          ) : (
            <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
              {filteredItems.map((item, index) => (
                <AnimateIn
                  key={item.id}
                  from="bottom"
                  delay={Math.min(index * 28, 220)}
                  duration={500}
                >
                  <button
                    type="button"
                    onClick={() => openLightbox(index)}
                    onKeyDown={(event) => onGridKeyDown(event, index)}
                    aria-label={`Open ${item.title || "gallery image"} preview`}
                    className="group mb-6 block w-full break-inside-avoid overflow-hidden rounded-none bg-transparent text-left shadow-[0_14px_38px_rgba(18,20,38,0.08)] outline-none transition-all duration-[350ms] ease-out hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(18,20,38,0.14)] focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-4 focus-visible:ring-offset-[#F8F6F2] motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <span
                      className={[
                        "relative block overflow-hidden rounded-none",
                        index % 6 === 0
                          ? "aspect-[4/5]"
                          : index % 6 === 2
                            ? "aspect-[16/11]"
                            : index % 6 === 4
                              ? "aspect-[5/6]"
                              : "aspect-[4/3]",
                      ].join(" ")}
                    >
                      <GalleryImage
                        src={item.image}
                        alt={galleryAlt(item, index)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        priority={index < 4}
                        className="transition-transform duration-[350ms] ease-smooth group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none"
                      />
                    </span>
                  </button>
                </AnimateIn>
              ))}
            </div>
          )}
        </section>

        <section className="bg-[#F2EEE6] px-4 py-24 sm:py-28 lg:py-32">
          <AnimateIn from="bottom">
            <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#121426_0%,#181B31_58%,#0B0B14_100%)] px-6 py-16 text-center text-white shadow-sa-premium sm:px-10 sm:py-20">
              <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-gold/15 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <div className="mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-brand-gold">
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-caption text-brand-gold">Inspired by Our Work?</p>
                <h2 className="mx-auto mt-4 max-w-3xl font-display text-[clamp(2.5rem,4.6vw,3.8rem)] font-semibold leading-[1.04] tracking-tight">
                  Let&apos;s build signage that represents your brand.
                </h2>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/quote"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand-gold px-8 py-3.5 text-sm font-semibold text-brand-navy shadow-sa-gold transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-brand-gold-light hover:shadow-[0_18px_44px_rgba(217,165,20,0.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold motion-reduce:transform-none"
                  >
                    Request a Quote
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 bg-white/[0.08] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-[250ms] hover:-translate-y-0.5 hover:border-brand-gold/55 hover:bg-white/[0.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold motion-reduce:transform-none"
                  >
                    View Services
                  </Link>
                </div>
              </div>
            </div>
          </AnimateIn>
        </section>
      </main>

      {lightboxIndex !== null ? (
        <Lightbox
          items={filteredItems}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      ) : null}

      <Footer />
    </>
  );
}
