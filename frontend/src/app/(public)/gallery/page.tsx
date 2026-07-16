import type { Metadata } from "next";
import { publicApi } from "@/lib/api";
import type { GalleryItem } from "@/types";
import { GALLERY_DATA, GALLERY_FALLBACK_IMAGE } from "@/data/gallery";
import type { DisplayGalleryItem } from "@/data/gallery";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | Shreeji Art — Signage & Branding Work",
  description:
    "Browse Shreeji Art's project gallery — stainless steel signs, acrylic lettering, ACP cladding, LED channel letters, 3D dimensional letters, retail branding, office signage, wayfinding systems, and custom fabrication in Ahmedabad.",
  openGraph: {
    title: "Gallery | Shreeji Art — Premium Signage & Branding",
    description:
      "Explore signage examples across 12 categories, including commercial, retail, corporate, and industrial signage work in Gujarat.",
    type: "website",
  },
};

export default async function GalleryPage() {
  let items: DisplayGalleryItem[] = [];
  let isLiveData = false;

  try {
    const res = await publicApi.getGallery();
    const apiItems = res.success && Array.isArray(res.data)
      ? (res.data as GalleryItem[])
      : [];

    if (apiItems.length > 0) {
      items = apiItems.map((item) => ({
        id: String(item.id),
        title: item.title || "Gallery item",
        category: item.category || "Signage",
        image: item.imageUrl || GALLERY_FALLBACK_IMAGE,
        alt: item.title
          ? `${item.title} signage project`
          : "Signage gallery item",
        placeholder: false,
      }));
      isLiveData = true;
    }
  } catch {
    // fall through to local data
  }

  if (!isLiveData) {
    items = GALLERY_DATA.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      categorySlug: item.categorySlug,
      image: item.image,
      alt: item.alt,
      description: item.description,
      placeholder: item.placeholder,
    }));
  }

  return <GalleryClient items={items} />;
}
