import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact | Shreeji Art — Premium Signage & Branding",
  description:
    "Contact Shreeji Art in Ahmedabad, Gujarat. Get expert advice on LED signs, acrylic signage, 3D letters, ACP cladding, office branding, and retail signage. Call, WhatsApp, or email us.",
  openGraph: {
    title: "Contact Shreeji Art — Signage & Branding Experts",
    description:
      "Reach out for custom signage solutions, quotes, and consultations. Based in Ahmedabad, Gujarat.",
    type: "website",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
