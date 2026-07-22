import type { Metadata } from "next";
import HomeClient, { type PortfolioStatus, type ServicesStatus } from "./HomeClient";
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

async function fetchHomeData(): Promise<{
  services: Service[];
  servicesStatus: ServicesStatus;
  portfolio: PortfolioItem[];
  portfolioStatus: PortfolioStatus;
  testimonials: Testimonial[];
}> {
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
      servicesStatus: svcRes.status === "rejected"
        ? "error"
        : svcRes.value.data && (svcRes.value.data as Service[]).length > 0
        ? "ready"
        : "empty",
      portfolio: portRes.status === "fulfilled" && portRes.value.data
        ? [...(portRes.value.data as PortfolioItem[])].sort((a, b) => b.id - a.id).slice(0, 12)
        : [] as PortfolioItem[],
      portfolioStatus: portRes.status === "rejected"
        ? "error"
        : portRes.value.data && (portRes.value.data as PortfolioItem[]).length > 0
        ? "ready"
        : "empty",
      testimonials: testRes.status === "fulfilled" && testRes.value.data
        ? (testRes.value.data as Testimonial[]).slice(0, 3)
        : [] as Testimonial[],
    };
  } catch {
    return {
      services: [] as Service[],
      servicesStatus: "error",
      portfolio: [] as PortfolioItem[],
      portfolioStatus: "error",
      testimonials: [] as Testimonial[],
    };
  }
}

export default async function HomePage() {
  const { services, servicesStatus, portfolio, portfolioStatus, testimonials } = await fetchHomeData();
  return (
    <HomeClient
      services={services}
      servicesStatus={servicesStatus}
      portfolio={portfolio}
      portfolioStatus={portfolioStatus}
      testimonials={testimonials}
    />
  );
}
