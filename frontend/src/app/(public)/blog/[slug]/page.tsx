import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { publicApi } from "@/lib/api";
import type { BlogPost } from "@/types";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await publicApi.getBlog(params.slug);
    const post = res.data as BlogPost | null;
    if (post) {
      return {
        title: post.title,
        description: post.excerpt,
      };
    }
  } catch { /* fallback */ }
  return { title: "Blog Post" };
}

export default async function BlogPostPage({ params }: Props) {
  let post: BlogPost | undefined;
  try {
    const res = await publicApi.getBlog(params.slug);
    post = (res.data as BlogPost) ?? undefined;
  } catch { /* fall through */ }

  if (!post) notFound();

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/blog" className="text-brand-gold text-sm hover:underline">
        ← Back to Blog
      </Link>
      {post.publishedAt && (
        <p className="text-sm text-gray-400 mt-6 mb-2">
          {new Date(post.publishedAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
      <h1 className="text-4xl font-display font-bold text-brand-navy mb-6">
        {post.title}
      </h1>
      {post.excerpt && (
        <p className="text-lg text-gray-600 mb-8 border-l-4 border-brand-gold pl-4">
          {post.excerpt}
        </p>
      )}
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 whitespace-pre-line">{post.content}</p>
      </div>
    </main>
  );
}
