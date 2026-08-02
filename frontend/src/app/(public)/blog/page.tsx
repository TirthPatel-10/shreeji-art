import type { Metadata } from "next";
import BlogComingSoon from "./BlogComingSoon";

export const metadata: Metadata = {
  title: "Blog Coming Soon | Shreeji Art",
  description: "Shreeji Art signage and branding insights are coming soon.",
  openGraph: {
    title: "Blog Coming Soon | Shreeji Art",
    description: "Shreeji Art signage and branding insights are coming soon.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogComingSoon />;
}
