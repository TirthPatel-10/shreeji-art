"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  ImageOff,
  MapPin,
  Maximize2,
  RefreshCw,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import { GALLERY_CATEGORIES, GALLERY_FALLBACK_IMAGE } from "@/data/gallery";
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

function GallerySkeletonGrid() {
  return (
    <div
      className="columns-1 gap-5 sm:columns-2 lg:columns-3"
      aria-label="Loading gallery items"
    >
      {Array.from({ length: 9 }, (_, index) => (
        <div
          key={index}
          className={`mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] ${
            index % 3 === 1 ? "h-80" : index % 3 === 2 ? "h-64" : "h-96"
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
      body: "Project photos will appear here once they are published from the gallery manager.",
      icon: Camera,
      action: "Contact us",
    },
    "filter-empty": {
      title: `No work found${activeCategory ? ` in ${activeCategory}` : ""}`,
      body: "Try another category or view the complete gallery.",
      icon: ImageOff,
      action: "View all work",
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
      {type === "empty" ? (
        <Link
          href="/contact"
          className="mt-7 inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-navy shadow-sa-md transition-all duration-200 hover:bg-brand-gold-light focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy motion-reduce:transition-none"
        >
          {copy.action}
        </Link>
      ) : (
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

function getItemMeta(item: DisplayGalleryItem) {
  return [item.category, item.location].filter(Boolean).join(" • ");
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
  const panelRef = useRef<HTMLDivElement>(null);
  const item = items[activeIndex];
  const total = items.length;

  const previous = useCallback(() => {
    onNavigate((activeIndex - 1 + total) % total);
  }, [activeIndex, onNavigate, total]);

  const next = useCallback(() => {
    onNavigate((activeIndex + 1) % total);
  }, [activeIndex, onNavigate, total]);

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
      aria-labelledby="gallery-lightbox-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6"
    >
      <button
        type="button"
        aria-label="Close gallery preview"
        className="absolute inset-0 cursor-default bg-black/85 backdrop-blur-xl"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className="relative z-10 grid w-full max-w-6xl gap-4 outline-none"
      >
        <div className="flex items-center justify-between gap-3 text-white">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
              {item.category}
            </p>
            <h2
              id="gallery-lightbox-title"
              className="mt-1 font-display text-2xl font-semibold"
            >
              {item.title}
            </h2>
          </div>
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

        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-brand-navy shadow-2xl">
          <div className="relative h-[68vh] min-h-[340px] w-full">
            <GalleryImage
              src={item.image}
              alt={item.alt ?? item.title}
              sizes="(max-width: 768px) 95vw, 1100px"
              priority
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-white sm:p-7">
            {item.location ? (
              <p className="mb-2 inline-flex items-center gap-2 text-sm text-white/75">
                <MapPin className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                {item.location}
              </p>
            ) : null}
            {item.description ? (
              <p className="max-w-3xl text-sm leading-6 text-white/70">
                {item.description}
              </p>
            ) : null}
          </div>
        </div>

        {total > 1 ? (
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous gallery image"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <p className="text-sm text-white/55">
              {activeIndex + 1} / {total}
            </p>
            <button
              type="button"
              onClick={next}
              aria-label="Next gallery image"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold motion-reduce:transition-none"
            >
              Next
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
    const present = new Set(items.map((item) => item.category));
    const preserved = GALLERY_CATEGORIES.filter(
      (category) => category.value === "" || present.has(category.value)
    );
    const knownValues = new Set<string>(
      GALLERY_CATEGORIES.map((category) => category.value)
    );
    const liveOnlyCategories = Array.from(present)
      .filter((category) => category && !knownValues.has(category))
      .map((category) => ({ label: category, value: category }));

    if (items.length === 0) {
      return GALLERY_CATEGORIES;
    }

    return [...preserved, ...liveOnlyCategories];
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
            className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_18%,rgba(212,160,23,0.18),transparent_34%),radial-gradient(circle_at_82%_0%,rgba(255,255,255,0.09),transparent_28%),linear-gradient(135deg,#070917_0%,#0B1024_52%,#050610_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.55)_1px,transparent_1px)] [background-size:56px_56px]"
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
                  A curated look at signage projects shaped for storefronts,
                  offices, hospitals, hotels, restaurants, factories, and
                  commercial spaces.
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

        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {status === "loading" ? (
            <GallerySkeletonGrid />
          ) : status === "error" ? (
            <GalleryState
              type="error"
              onRetry={() => router.refresh()}
            />
          ) : items.length === 0 ? (
            <GalleryState type="empty" />
          ) : filteredItems.length === 0 ? (
            <GalleryState
              type="filter-empty"
              activeCategory={activeCategory}
              onReset={() => setActiveCategory("")}
            />
          ) : (
            <>
              <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                    {activeCategory || "All projects"}
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    Showing {filteredItems.length}{" "}
                    {filteredItems.length === 1 ? "image" : "images"}
                  </p>
                </div>
                <p className="max-w-md text-sm leading-6 text-white/50">
                  Select any image to open a larger preview. Use Escape or the
                  close button to return to the gallery.
                </p>
              </div>

              <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
                {filteredItems.map((item, index) => (
                  <AnimateIn
                    key={item.id}
                    from="bottom"
                    delay={Math.min(index * 35, 260)}
                    duration={520}
                  >
                    <button
                      type="button"
                      onClick={() => openLightbox(index)}
                      onKeyDown={(event) => onGridKeyDown(event, index)}
                      aria-label={`Open ${item.title} gallery image`}
                      className="group mb-5 block w-full break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.06] text-left shadow-sa-md outline-none transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/55 hover:bg-white/[0.09] hover:shadow-sa-xl focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      <span className="relative block aspect-[4/3] overflow-hidden">
                        <GalleryImage
                          src={item.image}
                          alt={item.alt ?? item.title}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 3}
                          className="transition-transform duration-700 ease-smooth group-hover:scale-105 motion-reduce:transition-none motion-reduce:transform-none"
                        />
                        <span
                          className="absolute inset-0 bg-gradient-to-t from-brand-deep/90 via-brand-deep/15 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95 motion-reduce:transition-none"
                          aria-hidden="true"
                        />
                        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 focus-visible:opacity-100 motion-reduce:transition-none">
                          <Maximize2 className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="absolute bottom-4 left-4 right-4">
                          <span className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-gold">
                            {item.category}
                          </span>
                        </span>
                      </span>

                      <span className="block p-5">
                        <span className="block font-display text-xl font-semibold leading-snug text-white">
                          {item.title}
                        </span>
                        {getItemMeta(item) ? (
                          <span className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/55">
                            {item.location ? (
                              <MapPin
                                className="h-4 w-4 text-brand-gold"
                                aria-hidden="true"
                              />
                            ) : null}
                            {getItemMeta(item)}
                          </span>
                        ) : null}
                      </span>
                    </button>
                  </AnimateIn>
                ))}
              </div>
            </>
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
