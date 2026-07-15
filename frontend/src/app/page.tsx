import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { publicApi } from "@/lib/api";
import type { Service, PortfolioItem, Testimonial } from "@/types";

export const metadata: Metadata = {
  title: "Shreeji Art — Premium Signage & Branding, Ahmedabad",
  description:
    "Premium signage company in Ahmedabad crafting LED signs, acrylic letters, 3D letters, ACP signage, office branding, and custom manufacturing for Gujarat brands.",
  keywords: [
    "premium signage Ahmedabad",
    "LED signs Ahmedabad",
    "acrylic letters Gujarat",
    "3D letter signs",
    "ACP signage",
    "office branding Ahmedabad",
    "sign board manufacturer Ahmedabad",
    "Shreeji Art",
  ],
  openGraph: {
    title: "Shreeji Art — Premium Signage & Branding, Ahmedabad",
    description:
      "Premium signage manufacturing for LED signs, acrylic letters, ACP facades, 3D letters, and office branding in Ahmedabad.",
    type: "website",
    locale: "en_IN",
    siteName: "Shreeji Art",
  },
};

async function fetchHomeData() {
  try {
    const [svcRes, portRes, testRes] = await Promise.allSettled([
      publicApi.getServices(),
      publicApi.getPortfolio(),
      publicApi.getTestimonials(),
    ]);

    return {
      services: svcRes.status === "fulfilled" && svcRes.value.data
        ? (svcRes.value.data as Service[]).slice(0, 8)
        : [] as Service[],
      portfolio: portRes.status === "fulfilled" && portRes.value.data
        ? (portRes.value.data as PortfolioItem[]).filter((p) => p.isFeatured).slice(0, 3)
        : [] as PortfolioItem[],
      testimonials: testRes.status === "fulfilled" && testRes.value.data
        ? (testRes.value.data as Testimonial[]).slice(0, 3)
        : [] as Testimonial[],
    };
  } catch {
    return { services: [] as Service[], portfolio: [] as PortfolioItem[], testimonials: [] as Testimonial[] };
  }
}

export default async function HomePage() {
  const { services, portfolio, testimonials } = await fetchHomeData();
  return <HomeClient services={services} portfolio={portfolio} testimonials={testimonials} />;
}
