import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicApi } from "@/lib/api";
import { isPublishedProject } from "@/lib/public-projects";
import type { PortfolioImage, PortfolioItem } from "@/types";
import PortfolioDetailClient from "./PortfolioDetailClient";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await publicApi.getPortfolioBySlug(params.slug);
    if (!res.success) return { title: "Project Not Found | Shreeji Art" };

    const item = res.data as PortfolioItem | null;
    if (!item || !isPublishedProject(item)) {
      return { title: "Project Not Found | Shreeji Art" };
    }

    return {
      title: `${item.title} | Portfolio — Shreeji Art`,
      description:
        (item.shortDescription || item.description || item.fullDescription)?.slice(0, 160) ||
        `${item.clientName ? `${item.clientName} — ` : ""}Premium signage project by Shreeji Art, Ahmedabad.`,
    };
  } catch {
    return { title: "Portfolio Project | Shreeji Art" };
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  let item: PortfolioItem | null = null;
  let images: PortfolioImage[] = [];
  let related: PortfolioItem[] = [];

  try {
    const [itemRes, imagesRes, allRes] = await Promise.allSettled([
      publicApi.getPortfolioBySlug(params.slug),
      publicApi.getPortfolioImagesBySlug(params.slug),
      publicApi.getPortfolio(),
    ]);

    if (itemRes.status === "fulfilled" && itemRes.value.success) {
      item = itemRes.value.data as PortfolioItem;
    }

    if (imagesRes.status === "fulfilled" && imagesRes.value.success) {
      images = (imagesRes.value.data as PortfolioImage[] | null) ?? [];
    }

    if (allRes.status === "fulfilled") {
      const all = allRes.value.success
        ? ((allRes.value.data as PortfolioItem[]) ?? [])
        : [];
      related = all
        .filter((project) => project.slug !== params.slug && isPublishedProject(project))
        .slice(0, 3);
    }
  } catch {
    /* handled below */
  }

  if (!item || !isPublishedProject(item)) notFound();

  return <PortfolioDetailClient item={item} images={images} related={related} />;
}
