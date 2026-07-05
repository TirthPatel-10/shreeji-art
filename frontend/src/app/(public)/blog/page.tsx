import type { Metadata } from "next";
import Link from "next/link";
import { publicApi } from "@/lib/api";
import type { BlogPost } from "@/types";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read Shreeji Art's blog — signage tips, industry news, and branding insights.",
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  try {
    const res = await publicApi.getBlogs();
    posts = (res.data as BlogPost[]) ?? [];
  } catch { /* render empty */ }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-4 text-center">
        Blog
      </h1>
      <p className="text-center text-gray-500 mb-12">
        Signage tips, industry news, and branding insights
      </p>

      {posts.length === 0 ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-100 rounded w-full mb-1" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border border-gray-100 rounded-xl p-6 bg-white shadow-sm hover:shadow-md hover:border-brand-gold transition-all"
            >
              {post.publishedAt && (
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              <h2 className="text-xl font-bold text-brand-navy mb-2">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-gray-500 text-sm line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <span className="inline-block mt-3 text-brand-gold text-sm font-medium hover:underline">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
