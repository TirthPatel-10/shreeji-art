import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getPublicSiteContact } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getPublicSiteContact();

  return pageMetadata({
    title: "Contact Shreeji Art | Signage Company Ahmedabad",
    description: `Contact Shreeji Art at ${contact.phone} or ${contact.email}. Visit us in ${contact.shortLocation} for LED signs, acrylic signage, 3D letters, ACP signage, branding and installation.`,
    path: "/contact",
  });
}

export default async function ContactPage() {
  const contact = await getPublicSiteContact();

  return <ContactClient contact={contact} />;
}
