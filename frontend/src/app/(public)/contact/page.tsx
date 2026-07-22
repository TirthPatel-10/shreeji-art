import type { Metadata } from "next";
import ContactClient from "./ContactClient";
import { SITE_CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact | Shreeji Art — Premium Signage & Branding",
  description: `Contact Shreeji Art at ${SITE_CONTACT.phone} or ${SITE_CONTACT.email}. Visit us at ${SITE_CONTACT.address} Get expert advice on LED signs, acrylic signage, 3D letters, ACP cladding, office branding, and retail signage.`,
  openGraph: {
    title: "Contact Shreeji Art — Signage & Branding Experts",
    description: `Reach out for custom signage solutions, quotes, and consultations. Based at ${SITE_CONTACT.shortLocation}.`,
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
