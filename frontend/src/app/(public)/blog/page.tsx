import type { Metadata } from "next";
import BlogComingSoon from "./BlogComingSoon";
import { getPublicSiteContact } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Blog Coming Soon | Shreeji Art",
  description: "Shreeji Art signage and branding insights are coming soon.",
  openGraph: {
    title: "Blog Coming Soon | Shreeji Art",
    description: "Shreeji Art signage and branding insights are coming soon.",
    type: "website",
  },
};

export default async function BlogPage() {
  const contact = await getPublicSiteContact();

  return <BlogComingSoon contact={contact} />;
}
