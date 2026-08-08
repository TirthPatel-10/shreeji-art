import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type InteractiveServiceCardAccent = "gold" | "blue" | "purple" | "green" | "orange";

export interface InteractiveServiceCardProps {
  title: string;
  slug: string;
  category: string;
  description: string;
  imageSrc: string;
  altText: string;
  features?: string[];
  accent?: InteractiveServiceCardAccent;
  featured?: boolean;
  reversed?: boolean;
  className?: string;
}

const accentStyles: Record<
  InteractiveServiceCardAccent,
  {
    border: string;
    glow: string;
    label: string;
    panel: string;
    ring: string;
  }
> = {
  gold: {
    border: "hover:border-brand-gold/28",
    glow: "bg-[radial-gradient(circle_at_center,rgba(217,165,20,0.18),transparent_68%)]",
    label: "text-brand-gold/90",
    panel: "from-brand-gold/16 via-white/7 to-transparent",
    ring: "border-brand-gold/18",
  },
  blue: {
    border: "hover:border-brand-gold/28",
    glow: "bg-[radial-gradient(circle_at_center,rgba(125,168,214,0.13),transparent_68%)]",
    label: "text-brand-gold/90",
    panel: "from-sky-300/14 via-white/7 to-transparent",
    ring: "border-sky-200/14",
  },
  purple: {
    border: "hover:border-brand-gold/28",
    glow: "bg-[radial-gradient(circle_at_center,rgba(157,124,216,0.12),transparent_68%)]",
    label: "text-brand-gold/90",
    panel: "from-violet-300/12 via-white/7 to-transparent",
    ring: "border-violet-200/12",
  },
  green: {
    border: "hover:border-brand-gold/28",
    glow: "bg-[radial-gradient(circle_at_center,rgba(77,157,123,0.12),transparent_68%)]",
    label: "text-brand-gold/90",
    panel: "from-emerald-300/12 via-white/7 to-transparent",
    ring: "border-emerald-200/12",
  },
  orange: {
    border: "hover:border-brand-gold/28",
    glow: "bg-[radial-gradient(circle_at_center,rgba(191,122,43,0.12),transparent_68%)]",
    label: "text-brand-gold/90",
    panel: "from-amber-300/12 via-white/7 to-transparent",
    ring: "border-amber-200/12",
  },
};

export function InteractiveServiceCard({
  title,
  slug,
  category,
  description,
  imageSrc,
  altText,
  features = [],
  accent = "gold",
  featured = false,
  reversed = false,
  className,
}: InteractiveServiceCardProps) {
  const styles = accentStyles[accent];
  const visibleFeatures = features.slice(0, 3);

  return (
    <article
      className={cn(
        "group relative grid h-full overflow-hidden rounded-[1.35rem] border border-white/[0.06] bg-[linear-gradient(135deg,#17192C_0%,#121426_48%,#0D0F1D_100%)] shadow-[0_18px_44px_rgba(18,20,38,0.14)] transition-all duration-[450ms] ease-out hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(18,20,38,0.18)] focus-within:border-brand-gold/45 motion-reduce:transform-none lg:min-h-[320px]",
        reversed
          ? "lg:grid-cols-[minmax(292px,1fr)_minmax(0,1.22fr)]"
          : "lg:grid-cols-[minmax(0,1.22fr)_minmax(292px,1fr)]",
        styles.border,
        featured && "border-brand-gold/24 shadow-[0_20px_50px_rgba(18,20,38,0.16)]",
        reversed && "bg-[linear-gradient(135deg,#15182B_0%,#181B31_52%,#101222_100%)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(217,165,20,0.12),transparent_34%),linear-gradient(90deg,rgba(255,255,255,0.045),transparent_38%)]"
        aria-hidden="true"
      />

      <div className={cn("relative z-10 flex min-w-0 flex-col p-7 sm:p-8 lg:p-11", reversed && "lg:order-2")}>
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={cn(
              "text-[0.68rem] font-semibold uppercase tracking-[0.28em]",
              styles.label
            )}
          >
            {category}
          </span>
          {featured ? (
            <span className="rounded-full border border-brand-gold/25 bg-brand-gold/10 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-gold">
              Featured Service
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 max-w-2xl font-display text-[clamp(2rem,3vw,2.5rem)] font-bold leading-[1.02] tracking-normal text-[#F8F6F1]">
          {title}
        </h3>

        <p className="mt-[22px] line-clamp-3 max-w-[90%] text-base leading-[1.7] text-[rgba(255,255,255,0.78)] sm:text-[17px]">
          {description}
        </p>

        {visibleFeatures.length > 0 ? (
          <ul className="mt-7 grid gap-x-6 gap-y-4 text-sm text-[rgba(255,255,255,0.82)] sm:grid-cols-3">
            {visibleFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold/95"
                  aria-hidden="true"
                />
                <span className="leading-6">{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-col gap-3 pt-7 sm:flex-row">
          <Link
            href={`/services/${slug}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/35 bg-white/8 px-5 py-3 text-sm font-semibold text-[#F8F6F1] transition-all duration-[250ms] ease-out hover:border-white/50 hover:bg-white/12 hover:text-brand-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            aria-label={`Learn more about ${title}`}
          >
            Learn More
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={`/quote?service=${encodeURIComponent(title)}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-navy shadow-sa-gold transition-all duration-[250ms] ease-out hover:-translate-y-0.5 hover:bg-brand-gold-light hover:shadow-[0_16px_34px_rgba(217,165,20,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold motion-reduce:transform-none"
            aria-label={`Request a quote for ${title}`}
          >
            Request a Quote
          </Link>
        </div>
      </div>

      <Link
        href={`/services/${slug}`}
        className={cn(
          "relative isolate m-5 mt-0 block min-h-[205px] overflow-hidden rounded-[1.05rem] bg-[#0B0B14] outline-none transition-transform duration-[450ms] ease-out focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy lg:m-7 lg:min-h-0",
          reversed ? "lg:order-1 lg:mr-0" : "lg:ml-0"
        )}
        aria-label={`View ${title} service details`}
      >
        <div
          className={cn(
            "absolute inset-0 opacity-74 transition-opacity duration-[450ms] group-hover:opacity-90",
            styles.glow
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-68",
            styles.panel
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "absolute left-[15%] top-[22%] h-[52%] w-[64%] rounded-[1rem] border bg-white/[0.024] shadow-[0_10px_24px_rgba(0,0,0,0.13)] transition-transform duration-[450ms] ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none",
            styles.ring
          )}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[21%] right-[14%] h-[52%] w-[64%] rounded-[1rem] border border-white/8 bg-brand-navy/32 shadow-[0_10px_24px_rgba(0,0,0,0.13)] transition-transform duration-[450ms] ease-out group-hover:-translate-x-0.5 group-hover:translate-y-0.5 motion-reduce:transform-none"
          aria-hidden="true"
        />
        <div className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-brand-gold/90 backdrop-blur-sm transition-all duration-[250ms] group-hover:border-brand-gold/30 group-hover:bg-brand-gold/10 group-hover:text-brand-gold">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="relative z-10 flex h-full min-h-[205px] items-center justify-center p-5 lg:min-h-full">
          <div className="relative aspect-[4/3] w-full max-w-[306px] overflow-hidden rounded-[0.9rem] bg-white/[0.04] shadow-[0_13px_32px_rgba(0,0,0,0.17)] transition-transform duration-[500ms] ease-out group-hover:scale-[1.01] lg:group-hover:[transform:perspective(900px)_scale(1.015)] motion-reduce:transform-none">
            <Image
              src={imageSrc}
              alt={altText}
              fill
              sizes="(min-width: 1280px) 31vw, (min-width: 768px) 42vw, 92vw"
              className="object-contain p-3 opacity-95 transition-transform duration-[600ms] ease-out group-hover:scale-[1.02] motion-reduce:transform-none"
              unoptimized={imageSrc.endsWith(".svg")}
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
