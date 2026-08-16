import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import { getPublicSiteContact } from "@/lib/site-settings";
import { pageMetadata } from "@/lib/seo";
import type { PortfolioItem } from "@/types";
import PortfolioClient from "./PortfolioClient";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Signage Projects & Portfolio | Shreeji Art",
  description:
    "Explore Shreeji Art signage projects and portfolio work across Gujarat, including LED signs, acrylic letters, 3D signage, retail branding and office branding.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  let items: PortfolioItem[] = [];
  let status: "ready" | "empty" | "error" = "empty";
  const contact = await getPublicSiteContact();

  try {
    const res = await publicApi.getPortfolio();
    items = res.success ? ((res.data as PortfolioItem[]) ?? []) : [];
    status = res.success ? (items.length > 0 ? "ready" : "empty") : "error";
  } catch {
    status = "error";
  }
  return <PortfolioClient items={items} status={status} contact={contact} />;
}
