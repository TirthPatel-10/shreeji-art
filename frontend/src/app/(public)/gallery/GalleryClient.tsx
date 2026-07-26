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
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ImageOff,
  Maximize2,
  RefreshCw,
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
      className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4"
      aria-label="Loading gallery images"
    >
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className={`mb-4 break-inside-avoid overflow-hidden rounded-[1.35rem] bg-white/[0.06] shadow-sa-md ${
            index % 4 === 1
              ? "h-80"
              : index % 4 === 2
                ? "h-64"
                : index % 4 === 3
                  ? "h-[28rem]"
                  : "h-96"
          }`}
        >
          <div className="h-full w-full animate-pulse bg-gradient-to-br from-white/[0.10] via-white/[0.04] to-brand-gold/[0.08]" />
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
      title: "Gallery coming soon",
      body: "Published project images will appear here.",
      icon: Camera,
      action: "Contact us",
    },
    "filter-empty": {
      title: "No images found",
      body: activeCategory
        ? `There are no published images in ${activeCategory} yet.`
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
    <div className="mx-auto flex max-w-xl flex-col items-center rounded-[2rem] border border-white/10 bg-white/[0.06] px-6 py-14 text-center shadow-sa-lg backdrop-blur-xl">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/10 text-brand-gold">
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="font-display text-2xl font-semibold text-white">
        {copy.title}
      </h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-white/65">
        {copy.body}
      </p>
      {type === "empty" ? null : (
        <button
          type="button"
          onClick={type === "error" ? onRetry : onReset}
          className="mt-7 inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-navy shadow-sa-md transition-all duration-200 hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy motion-reduce:transition-none"
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
        className="absolute inset-0 cursor-default bg-black/90 backdrop-blur-xl"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex h-full w-full max-w-7xl flex-col justify-center gap-4 outline-none"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-md">
            {activeIndex + 1} / {total}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close gallery preview"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div className="relative h-full max-h-[78vh] min-h-[320px] w-full overflow-hidden rounded-[1.6rem] bg-brand-navy shadow-2xl sm:rounded-[2rem]">
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
                className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-all hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none sm:flex lg:-left-6"
              >
                <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next gallery image"
                className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-all hover:bg-black/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none sm:flex lg:-right-6"
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
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next gallery image"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
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
      <main className="overflow-hidden bg-brand-deep text-white">
        <section className="relative isolate border-b border-white/10 pt-28">
          <div
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(212,160,23,0.16),transparent_34%),radial-gradient(circle_at_82%_0%,rgba(255,255,255,0.08),transparent_28%),linear-gradient(135deg,#070917_0%,#0B1024_52%,#050610_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:56px_56px]"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16">
            <AnimateIn from="bottom" duration={600}>
              <div className="max-w-3xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold shadow-[0_0_16px_rgba(212,160,23,0.85)]" />
                  Project Gallery
                </span>
                <h1 className="mt-6 font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Our Work
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
                  A clean visual archive of Shreeji Art signage, fabrication,
                  branding, and installation work.
                </p>
              </div>
            </AnimateIn>
          </div>
        </section>

        <section className="sticky top-16 z-30 border-b border-white/10 bg-brand-deep/85 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
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
                      "shrink-0 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep motion-reduce:transition-none",
                      isActive
                        ? "border-brand-gold bg-brand-gold text-brand-navy shadow-[0_14px_32px_rgba(212,160,23,0.20)]"
                        : "border-white/10 bg-white/[0.06] text-white/72 hover:border-brand-gold/45 hover:bg-white/[0.10] hover:text-white",
                    ].join(" ")}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
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
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
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
                    aria-label={`Open gallery image ${index + 1}`}
                    className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-[1.35rem] bg-white/[0.04] text-left shadow-[0_18px_60px_rgba(0,0,0,0.22)] outline-none ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.34)] hover:ring-brand-gold/45 focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    <span
                      className={[
                        "relative block overflow-hidden",
                        index % 7 === 1
                          ? "aspect-[3/4]"
                          : index % 7 === 3
                            ? "aspect-[5/6]"
                            : index % 7 === 5
                              ? "aspect-[16/10]"
                              : "aspect-[4/3]",
                      ].join(" ")}
                    >
                      <GalleryImage
                        src={item.image}
                        alt={galleryAlt(item, index)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        priority={index < 4}
                        className="transition-transform duration-700 ease-smooth group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:transform-none"
                      />
                      <span
                        className="absolute inset-0 bg-brand-deep/0 transition-colors duration-300 group-hover:bg-brand-deep/24 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                      <span className="absolute right-3 top-3 flex h-10 w-10 translate-y-1 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white opacity-0 shadow-sa-sm backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transform-none motion-reduce:transition-none">
                        <Maximize2 className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </span>
                  </button>
                </AnimateIn>
              ))}
            </div>
          )}
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
