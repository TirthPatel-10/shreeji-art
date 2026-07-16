import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Shreeji Art | Premium Signage & Branding Company, Ahmedabad",
  description:
    "Learn about Shreeji Art — an Ahmedabad-based signage company providing custom LED signs, acrylic signage, 3D letters, ACP signage, wayfinding, office and retail branding, fabrication, and installation.",
  openGraph: {
    title: "About Shreeji Art | Premium Signage & Branding Company",
    description:
      "Shreeji Art designs, fabricates, and installs premium custom signage for commercial, retail, corporate, and industrial clients across Gujarat.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
