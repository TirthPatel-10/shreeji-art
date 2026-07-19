import type { Metadata } from "next";
import BlogClient from "./BlogClient";

export const metadata: Metadata = {
  title: "Blog | Shreeji Art — Signage Tips & Branding Insights",
  description:
    "Learn about signage, branding, fabrication, installation, and design trends from Shreeji Art's expert team in Ahmedabad, Gujarat.",
  openGraph: {
    title: "Blog | Shreeji Art — Signage & Branding Insights",
    description:
      "Tips on LED signage, acrylic signs, office branding, retail trends, outdoor sign maintenance, and more.",
    type: "website",
  },
};

export default function BlogPage() {
  return <BlogClient />;
}
