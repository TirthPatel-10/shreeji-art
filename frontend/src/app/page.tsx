import type { Metadata } from "next";
import HomeClient, { type PortfolioStatus, type ServicesStatus } from "./HomeClient";
import { publicApi } from "@/lib/api";
import { getPublicSiteContact } from "@/lib/site-settings";
import { isPublishedProject, sortNewestProjects } from "@/lib/public-projects";
import {
  DEFAULT_SEO_DESCRIPTION,
  DEFAULT_SEO_TITLE,
  pageMetadata,
} from "@/lib/seo";
import type { Service, PortfolioItem, Testimonial } from "@/types";

export const revalidate = 60;

export const metadata: Metadata = {
  ...pageMetadata({
    title: DEFAULT_SEO_TITLE,
    description: DEFAULT_SEO_DESCRIPTION,
    path: "/",
  }),
  keywords: [
    "signage company Ahmedabad",
    "sign board manufacturer Ahmedabad",
    "LED sign boards Ahmedabad",
    "acrylic signage Gujarat",
    "3D letter signage",
    "ACP signage Ahmedabad",
    "office branding Ahmedabad",
    "Shreeji Art",
  ],
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
      services:
        svcRes.status === "fulfilled" && svcRes.value.data
          ? (svcRes.value.data as Service[]).slice(0, 8)
          : ([] as Service[]),
      servicesStatus:
        svcRes.status === "rejected"
          ? "error"
          : svcRes.value.data && (svcRes.value.data as Service[]).length > 0
            ? "ready"
            : "empty",
      portfolio:
        portRes.status === "fulfilled" && portRes.value.data
          ? sortNewestProjects(
              (portRes.value.data as PortfolioItem[])
                .filter(isPublishedProject)
                .filter((project) => project.isFeatured)
            ).slice(0, 12)
          : ([] as PortfolioItem[]),
      portfolioStatus:
        portRes.status === "rejected" || !portRes.value.success
          ? "error"
          : portRes.value.data && (portRes.value.data as PortfolioItem[]).length > 0
            ? "ready"
            : "empty",
      testimonials:
        testRes.status === "fulfilled" && testRes.value.data
          ? (testRes.value.data as Testimonial[]).slice(0, 3)
          : ([] as Testimonial[]),
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
  const [{ services, servicesStatus, portfolio, portfolioStatus, testimonials }, contact] =
    await Promise.all([fetchHomeData(), getPublicSiteContact()]);

  return (
    <HomeClient
      services={services}
      servicesStatus={servicesStatus}
      portfolio={portfolio}
      portfolioStatus={portfolioStatus}
      testimonials={testimonials}
      contact={contact}
    />
  );
}
