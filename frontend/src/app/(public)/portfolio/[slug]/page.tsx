import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publicApi } from "@/lib/api";
import type { PortfolioItem } from "@/types";
import PortfolioDetailClient from "./PortfolioDetailClient";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const res = await publicApi.getPortfolioBySlug(params.slug);
    const item = res.data as PortfolioItem | null;
    if (!item) return { title: "Project Not Found | Shreeji Art" };
    return {
      title: `${item.title} | Portfolio — Shreeji Art`,
      description:
        item.description?.slice(0, 160) ||
        `${item.clientName ? item.clientName + " — " : ""}Premium signage project by Shreeji Art, Ahmedabad.`,
    };
  } catch {
    return { title: "Portfolio Project | Shreeji Art" };
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  let item: PortfolioItem | null = null;
  let related: PortfolioItem[] = [];

  try {
    const [itemRes, allRes] = await Promise.allSettled([
      publicApi.getPortfolioBySlug(params.slug),
      publicApi.getPortfolio(),
    ]);

    if (itemRes.status === "fulfilled" && itemRes.value.success) {
      item = itemRes.value.data as PortfolioItem;
    }
    if (allRes.status === "fulfilled") {
      const all = (allRes.value.data as PortfolioItem[]) ?? [];
      related = all.filter((p) => p.slug !== params.slug).slice(0, 3);
    }
  } catch {
    /* handled below */
  }

  if (!item) notFound();

  return <PortfolioDetailClient item={item} related={related} />;
}
