import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import type { PortfolioItem } from "@/types";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio | Shreeji Art — Premium Signage Projects",
  description:
    "Explore Shreeji Art's portfolio of completed LED signs, acrylic letters, 3D signage, retail branding, and office branding projects across Gujarat.",
};

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  try {
    const res = await publicApi.getPortfolio();
    items = (res.data as PortfolioItem[]) ?? [];
  } catch {
    /* PortfolioClient shows empty state */
  }
  return <PortfolioClient items={items} />;
}
