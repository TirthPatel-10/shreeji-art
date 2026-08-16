import type { Metadata } from "next";
import AboutClient from "./AboutClient";
import { getPublicSiteContact } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Shreeji Art | Signage Company Ahmedabad",
  description:
    "Learn about Shreeji Art, an Ahmedabad signage company providing LED signs, acrylic signage, 3D letters, ACP signage, wayfinding, branding, fabrication and installation.",
  path: "/about",
});

export default async function AboutPage() {
  const contact = await getPublicSiteContact();

  return <AboutClient contact={contact} />;
}
