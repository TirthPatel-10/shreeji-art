import type { Metadata } from "next";
import BlogComingSoon from "./BlogComingSoon";
import { getPublicSiteContact } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Blog Coming Soon | Shreeji Art",
  description: "Shreeji Art signage and branding insights are coming soon.",
  path: "/blog",
  noIndex: true,
});

export default async function BlogPage() {
  const contact = await getPublicSiteContact();

  return <BlogComingSoon contact={contact} />;
}
