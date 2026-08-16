import type { MetadataRoute } from "next";
import { publicApi } from "@/lib/api";
import { isPublishedProject } from "@/lib/public-projects";
import { SERVICE_SLUGS } from "@/lib/service-details";
import { PRODUCTION_SITE_URL, absoluteUrl } from "@/lib/seo";
import type { PortfolioItem } from "@/types";

export const revalidate = 3600;

const staticRoutes = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/gallery",
  "/contact",
  "/quote",
] as const;

const PRODUCTION_BACKEND_API_URL =
  "https://shreeji-art-production.up.railway.app/api/v1";

async function fetchPortfolioProjectsForSitemap() {
  try {
    const response = await publicApi.getPortfolio();
    if (response.success && Array.isArray(response.data) && response.data.length > 0) {
      return response.data as PortfolioItem[];
    }
  } catch {
    /* Fallback below supports local builds where NEXT_PUBLIC_API_URL points at localhost. */
  }

  try {
    const response = await fetch(`${PRODUCTION_BACKEND_API_URL}/portfolio`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const json = await response.json();

    return json?.success && Array.isArray(json.data)
      ? (json.data as PortfolioItem[])
      : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let portfolioRoutes: MetadataRoute.Sitemap = [];

  const projects = (await fetchPortfolioProjectsForSitemap()).filter(isPublishedProject);
  portfolioRoutes = projects.map((project) => ({
    url: absoluteUrl(`/portfolio/${project.slug}`),
    lastModified: project.updatedAt || project.createdAt || now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...staticRoutes.map((route) => ({
      url: route === "/" ? PRODUCTION_SITE_URL : absoluteUrl(route),
      lastModified: now,
      changeFrequency: route === "/" ? "weekly" as const : "monthly" as const,
      priority: route === "/" ? 1 : route === "/services" ? 0.9 : 0.8,
    })),
    ...SERVICE_SLUGS.map((slug) => ({
      url: absoluteUrl(`/services/${slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...portfolioRoutes,
  ];
}
