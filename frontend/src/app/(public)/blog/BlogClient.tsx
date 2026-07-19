"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AnimateIn } from "@/components/ui/animate-in";
import { ArrowRight, ChevronDown, Calendar, Clock } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MockPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readTime: string;
  accentFrom: string;
  accentTo: string;
  accentText: string;
  badgeBg: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const POSTS: MockPost[] = [
  {
    id: 1,
    slug: "choosing-right-signage-for-your-business",
    title: "Choosing the Right Signage for Your Business",
    excerpt:
      "Not all signs are created equal. Learn how to match your sign type to your business goals, location, and budget — from LED to acrylic to stainless steel.",
    category: "Branding",
    publishedAt: "2024-03-15",
    readTime: "5 min read",
    accentFrom: "from-amber-400/10",
    accentTo: "to-amber-600/5",
    accentText: "text-amber-400",
    badgeBg: "bg-amber-400/15 text-amber-300 border border-amber-400/25",
  },
  {
    id: 2,
    slug: "acrylic-vs-stainless-steel-signs",
    title: "Acrylic vs Stainless Steel Signs: A Practical Comparison",
    excerpt:
      "Two premium materials, two very different results. We break down durability, cost, aesthetics, and the ideal application for each type of sign.",
    category: "Acrylic",
    publishedAt: "2024-02-28",
    readTime: "4 min read",
    accentFrom: "from-sky-400/10",
    accentTo: "to-blue-600/5",
    accentText: "text-sky-400",
    badgeBg: "bg-sky-400/15 text-sky-300 border border-sky-400/25",
  },
  {
    id: 3,
    slug: "benefits-of-led-sign-boards",
    title: "5 Key Benefits of LED Sign Boards for Modern Businesses",
    excerpt:
      "LED signage is transforming how businesses attract customers. Discover why it's the smartest storefront investment you can make right now.",
    category: "LED",
    publishedAt: "2024-02-10",
    readTime: "6 min read",
    accentFrom: "from-yellow-400/10",
    accentTo: "to-amber-500/5",
    accentText: "text-yellow-400",
    badgeBg: "bg-yellow-400/15 text-yellow-300 border border-yellow-400/25",
  },
  {
    id: 4,
    slug: "office-branding-ideas-that-inspire",
    title: "Office Branding Ideas That Inspire Your Team",
    excerpt:
      "Your office is your brand's home. Explore signage and interior branding solutions that create a motivating, professional workspace your team will love.",
    category: "Office",
    publishedAt: "2024-01-22",
    readTime: "4 min read",
    accentFrom: "from-violet-400/10",
    accentTo: "to-purple-600/5",
    accentText: "text-violet-400",
    badgeBg: "bg-violet-400/15 text-violet-300 border border-violet-400/25",
  },
  {
    id: 5,
    slug: "retail-signage-trends-2024",
    title: "Retail Signage Trends Shaping 2024",
    excerpt:
      "From 3D channel letters to backlit graphics and digital displays — explore the signage trends that top retailers are adopting this year.",
    category: "Retail",
    publishedAt: "2024-01-08",
    readTime: "5 min read",
    accentFrom: "from-emerald-400/10",
    accentTo: "to-green-600/5",
    accentText: "text-emerald-400",
    badgeBg: "bg-emerald-400/15 text-emerald-300 border border-emerald-400/25",
  },
  {
    id: 6,
    slug: "outdoor-sign-maintenance-tips-gujarat",
    title: "Outdoor Sign Maintenance Tips for Gujarat's Climate",
    excerpt:
      "Monsoons, 45°C heat, and dust — Gujarat's climate is tough on outdoor signs. Here's how to keep yours looking pristine and performing well year-round.",
    category: "Installation",
    publishedAt: "2023-12-20",
    readTime: "3 min read",
    accentFrom: "from-cyan-400/10",
    accentTo: "to-teal-600/5",
    accentText: "text-cyan-400",
    badgeBg: "bg-cyan-400/15 text-cyan-300 border border-cyan-400/25",
  },
];

const CATEGORIES = [
  "All",
  "Branding",
  "LED",
  "Acrylic",
  "Stainless Steel",
  "Office",
  "Retail",
  "Installation",
];

const INITIAL_COUNT = 3;
const PAGE_SIZE = 3;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Blog Card ────────────────────────────────────────────────────────────────

function BlogCard({ post }: { post: MockPost }) {
  return (
    <article className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sa-sm hover:shadow-sa-md hover:border-brand-gold/30 transition-all duration-300 motion-reduce:transition-none">
      {/* Image placeholder */}
      <div className="relative aspect-[16/9] bg-brand-navy overflow-hidden flex-shrink-0">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${post.accentFrom} ${post.accentTo}`}
          aria-hidden="true"
        />
        {/* Subtle dot grid */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-[0.06]"
        >
          <defs>
            <pattern
              id={`blog-dots-${post.id}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#blog-dots-${post.id})`} />
        </svg>
        {/* Centered icon + label */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center gap-2.5"
        >
          <svg
            viewBox="0 0 48 48"
            className={`w-10 h-10 ${post.accentText} opacity-30`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path d="M10 8h28a2 2 0 0 1 2 2v28a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" />
            <path d="M16 20h16M16 28h10" />
            <circle cx="16" cy="14" r="2" fill="currentColor" />
          </svg>
          <span
            className={`text-[10px] font-semibold tracking-widest uppercase ${post.accentText} opacity-40`}
          >
            {post.category}
          </span>
        </div>
        {/* Category badge */}
        <span
          className={`absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm ${post.badgeBg}`}
        >
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 md:p-6">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {formatDate(post.publishedAt)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {post.readTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-gray-900 mb-2.5 leading-snug line-clamp-2 group-hover:text-brand-navy transition-colors duration-200">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5 flex-1">
          {post.excerpt}
        </p>

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold group/link hover:gap-3 transition-all duration-200 motion-reduce:transition-none focus:outline-none focus-visible:underline"
          aria-label={`Read more about ${post.title}`}
        >
          Read More
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}

// ─── BlogClient ───────────────────────────────────────────────────────────────

export default function BlogClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filtered = useMemo(
    () =>
      activeCategory === "All"
        ? POSTS
        : POSTS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const allShown = !hasMore && filtered.length > INITIAL_COUNT;

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    setVisibleCount(INITIAL_COUNT);
  }

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-brand-navy py-24 md:py-32">
        {/* Background decorations */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-brand-gold/4 blur-3xl" />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="blog-hero-dots"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="1" cy="1" r="1" fill="#D4A017" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blog-hero-dots)" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimateIn from="bottom" duration={600}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium tracking-wide mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse-subtle" />
              Resources
            </span>
          </AnimateIn>

          <AnimateIn from="bottom" delay={80} duration={650}>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Blog &amp;{" "}
              <span className="text-brand-gold">Insights</span>
            </h1>
          </AnimateIn>

          <AnimateIn from="bottom" delay={160} duration={650}>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Learn about signage, branding, fabrication, installation, and
              design trends.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* ── Category Filters ─────────────────────────────────────────────────── */}
      <section className="sticky top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sa-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="overflow-x-auto pb-1 -mb-1 scrollbar-none">
            <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap md:justify-center">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={activeCategory === cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={[
                    "px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-1 motion-reduce:transition-none",
                    activeCategory === cat
                      ? "bg-brand-gold text-white shadow-sa-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800",
                  ].join(" ")}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Blog Grid ────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-12 md:py-16">
        {/* Results count */}
        <p className="text-gray-500 text-sm mb-8">
          Showing{" "}
          <span className="text-gray-800 font-medium">{visible.length}</span>
          {" "}of{" "}
          <span className="text-gray-800 font-medium">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "article" : "articles"}
          {activeCategory !== "All" && (
            <>
              {" "}in{" "}
              <span className="text-brand-gold font-medium">
                {activeCategory}
              </span>
            </>
          )}
        </p>

        {filtered.length === 0 ? (
          /* Empty state for categories with no posts */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="w-7 h-7 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="13" y2="17" />
              </svg>
            </div>
            <h3 className="text-gray-800 font-semibold text-lg mb-1">
              No articles in &ldquo;{activeCategory}&rdquo;
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs">
              No blog posts yet in this category. Browse all articles or check
              back soon.
            </p>
            <button
              type="button"
              onClick={() => handleCategoryChange("All")}
              className="px-5 py-2.5 rounded-full bg-brand-gold text-white text-sm font-semibold hover:bg-brand-gold/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              View All Articles
            </button>
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {visible.map((post, i) => (
                <AnimateIn
                  key={post.id}
                  from="bottom"
                  delay={Math.min(i * 80, 240)}
                  duration={500}
                >
                  <BlogCard post={post} />
                </AnimateIn>
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-gray-200 text-gray-600 text-sm font-semibold hover:border-brand-gold hover:text-brand-gold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
                >
                  Load More Articles
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}

            {/* End of results */}
            {allShown && (
              <p className="text-center text-gray-400 text-sm mt-10">
                You&rsquo;ve reached the end &mdash;{" "}
                {filtered.length === 1
                  ? "1 article"
                  : `${filtered.length} articles`}{" "}
                shown.
              </p>
            )}
          </>
        )}
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center">
          <AnimateIn from="bottom" duration={600}>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Elevate Your Brand?
            </h2>
          </AnimateIn>
          <AnimateIn from="bottom" delay={80} duration={600}>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Talk to our signage experts and get a free consultation for your
              next project — no obligation.
            </p>
          </AnimateIn>
          <AnimateIn from="bottom" delay={160} duration={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-brand-gold text-white font-semibold hover:bg-brand-gold/90 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-brand-gold/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none"
              >
                Request a Quote
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:border-white/40 hover:bg-white/5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                Contact Us
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      <Footer />
    </>
  );
}
