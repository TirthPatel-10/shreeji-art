import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { getPublicSiteContact } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const contact = await getPublicSiteContact();

  return {
    title: "Contact | Shreeji Art — Premium Signage & Branding",
    description: `Contact Shreeji Art at ${contact.phone} or ${contact.email}. Visit us at ${contact.address} Get expert advice on LED signs, acrylic signage, 3D letters, ACP cladding, office branding, and retail signage.`,
    openGraph: {
      title: "Contact Shreeji Art — Signage & Branding Experts",
      description: `Reach out for custom signage solutions, quotes, and consultations. Based at ${contact.shortLocation}.`,
      type: "website",
    },
  };
}

export default async function ContactPage() {
  const contact = await getPublicSiteContact();

  return <ContactClient contact={contact} />;
}
