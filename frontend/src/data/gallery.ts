export interface DisplayGalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  alt?: string;
  description?: string;
  location?: string;
  projectId?: number;
  projectTitle?: string;
  projectSlug?: string;
}

export const GALLERY_FALLBACK_IMAGE = "/gallery/shared/gallery-fallback.svg";
