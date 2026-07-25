import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import type { PortfolioItem } from "@/types";
import PortfolioClient from "./PortfolioClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Portfolio | Shreeji Art — Premium Signage Projects",
  description:
    "Explore Shreeji Art's portfolio of completed LED signs, acrylic letters, 3D signage, retail branding, and office branding projects across Gujarat.",
};

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  let status: "ready" | "empty" | "error" = "empty";
  try {
    const res = await publicApi.getPortfolio();
    items = res.success ? ((res.data as PortfolioItem[]) ?? []) : [];
    status = res.success ? (items.length > 0 ? "ready" : "empty") : "error";
  } catch {
    status = "error";
  }
  return <PortfolioClient items={items} status={status} />;
}
