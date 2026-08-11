import type { Metadata } from "next";
import BlogComingSoon from "../BlogComingSoon";
import { getPublicSiteContact } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Blog Coming Soon | Shreeji Art",
  description: "Shreeji Art signage and branding insights are coming soon.",
};

export default async function BlogPostPage() {
  const contact = await getPublicSiteContact();

  return <BlogComingSoon contact={contact} />;
}
