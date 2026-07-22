import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import type { GalleryItem } from "@/types";
import { GALLERY_FALLBACK_IMAGE } from "@/data/gallery";
import type { DisplayGalleryItem } from "@/data/gallery";
import GalleryClient, { type GalleryStatus } from "./GalleryClient";

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

function mapGalleryItem(item: GalleryApiItem): DisplayGalleryItem {
  const title = item.projectName || item.title || "Gallery item";
  const location = item.location || item.city;

  return {
    id: String(item.id),
    title,
    category: item.category || "Signage",
    image: item.imageUrl || GALLERY_FALLBACK_IMAGE,
    alt: `${title} signage project${location ? ` in ${location}` : ""}`,
    description: item.description,
    location,
    placeholder: false,
  };
}

export default async function GalleryPage() {
  let items: DisplayGalleryItem[] = [];
  let status: GalleryStatus = "empty";

  try {
    const res = await publicApi.getGallery();
    const apiItems =
      res.success && Array.isArray(res.data)
        ? (res.data as GalleryApiItem[])
        : [];

    items = apiItems.map(mapGalleryItem);
    status = items.length > 0 ? "ready" : "empty";
  } catch {
    status = "error";
  }

  return <GalleryClient items={items} status={status} />;
}
