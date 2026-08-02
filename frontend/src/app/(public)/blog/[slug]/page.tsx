import type { Metadata } from "next";
import BlogComingSoon from "../BlogComingSoon";

export const metadata: Metadata = {
  title: "Blog Coming Soon | Shreeji Art",
  description: "Shreeji Art signage and branding insights are coming soon.",
};

export default function BlogPostPage() {
  return <BlogComingSoon />;
}
