import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import {
  isPublishedProject,
  projectLocationLabel,
  projectSummary,
} from "@/lib/public-projects";
import type { GalleryItem, PortfolioItem } from "@/types";
import { GALLERY_FALLBACK_IMAGE } from "@/data/gallery";
import type { DisplayGalleryItem } from "@/data/gallery";
import GalleryClient, { type GalleryStatus } from "./GalleryClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Our Work | Shreeji Art Gallery",
  description:
    "Explore Shreeji Art's gallery of premium signage projects, including LED sign boards, acrylic signs, 3D letters, ACP signage, retail branding, and industrial signage.",
  openGraph: {
    title: "Our Work | Shreeji Art Gallery",
    description:
      "Browse real signage and branding projects crafted by Shreeji Art for commercial, retail, corporate, and industrial spaces.",
    type: "website",
  },
};

type GalleryApiItem = GalleryItem & {
  projectName?: string;
  location?: string;
  city?: string;
  description?: string;
};

function mapGalleryItem(
  item: GalleryApiItem,
  projectMap: Map<number, PortfolioItem>
): DisplayGalleryItem {
  const project = item.projectId ? projectMap.get(item.projectId) : undefined;
  const title = item.title || item.projectName || project?.title || "Gallery item";
  const location = item.location || item.city || (project ? projectLocationLabel(project) : "");

  return {
    id: String(item.id),
    title,
    category: item.category || "Signage",
    image: item.imageUrl || GALLERY_FALLBACK_IMAGE,
    alt: item.altText || `${title} signage project${location ? ` in ${location}` : ""}`,
    description: item.caption || item.description || (project ? projectSummary(project) : undefined),
    location,
    projectId: item.projectId,
    projectTitle: project?.title,
    projectSlug: project?.slug,
  };
}

export default async function GalleryPage() {
  let items: DisplayGalleryItem[] = [];
  let status: GalleryStatus = "empty";

  try {
    const [galleryResult, portfolioResult] = await Promise.allSettled([
      publicApi.getGallery(),
      publicApi.getPortfolio(),
    ]);

    const galleryRes = galleryResult.status === "fulfilled" ? galleryResult.value : null;
    const portfolioRes = portfolioResult.status === "fulfilled" ? portfolioResult.value : null;
    if (!galleryRes?.success) {
      status = "error";
      return <GalleryClient items={items} status={status} />;
    }

    const apiItems = galleryRes?.success && Array.isArray(galleryRes.data)
      ? (galleryRes.data as GalleryApiItem[]).filter((item) => item.published !== false)
      : [];
    const projects = portfolioRes?.success && Array.isArray(portfolioRes.data)
      ? (portfolioRes.data as PortfolioItem[]).filter(isPublishedProject)
      : [];
    const projectMap = new Map(projects.map((project) => [project.id, project]));

    items = apiItems.map((item) => mapGalleryItem(item, projectMap));
    status = items.length > 0 ? "ready" : "empty";
  } catch {
    status = "error";
  }

  return <GalleryClient items={items} status={status} />;
}
