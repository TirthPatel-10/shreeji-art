import type { PortfolioImage, PortfolioItem } from "@/types";

type PortfolioItemImageAliases = PortfolioItem & {
  cover_image_url?: string | null;
  imageUrl?: string | null;
  image_url?: string | null;
};

function cleanImageUrl(value: unknown) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function isPublishedProject(project: PortfolioItem) {
  return project.published !== false;
}

export function sortedProjectImages(project: PortfolioItem): PortfolioImage[] {
  const imageRecords = (project.imageRecords ?? [])
    .filter((image) => image.published !== false && Boolean(cleanImageUrl(image.imageUrl)))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((image) => ({
      ...image,
      imageUrl: cleanImageUrl(image.imageUrl) ?? image.imageUrl,
    }));

  if (imageRecords.length > 0) return imageRecords;

  return (project.images ?? [])
    .map(cleanImageUrl)
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl))
    .map((imageUrl, index) => ({
      id: index,
      imageUrl,
      sortOrder: index,
      coverImage: cleanImageUrl(project.coverImageUrl) === imageUrl || index === 0,
      published: true,
      altText: project.title,
    }));
}

export function projectCoverImage(project: PortfolioItem) {
  const projectWithAliases = project as PortfolioItemImageAliases;
  const explicitCover =
    cleanImageUrl(project.coverImageUrl) ??
    cleanImageUrl(projectWithAliases.cover_image_url) ??
    cleanImageUrl(projectWithAliases.imageUrl) ??
    cleanImageUrl(projectWithAliases.image_url);

  if (explicitCover) return explicitCover;

  const images = sortedProjectImages(project);

  return (
    cleanImageUrl(images.find((image) => image.coverImage)?.imageUrl) ||
    cleanImageUrl(images[0]?.imageUrl)
  );
}

export function projectSummary(project: PortfolioItem) {
  return project.shortDescription || project.description || project.fullDescription || "";
}

export function projectFullDescription(project: PortfolioItem) {
  return project.fullDescription || project.description || project.shortDescription || "";
}

export function projectCategoryLabel(project: PortfolioItem) {
  return project.category || project.service?.name || project.tags?.[0] || "";
}

export function projectLocationLabel(project: PortfolioItem) {
  return project.location || "";
}

export function projectTimestamp(project: PortfolioItem) {
  const dateValue = project.updatedAt ?? project.createdAt;
  const parsedDate = dateValue ? Date.parse(dateValue) : Number.NaN;

  if (Number.isFinite(parsedDate)) return parsedDate;
  return project.id;
}

export function sortNewestProjects(projects: PortfolioItem[]) {
  return [...projects].sort((a, b) => {
    const newestDelta = projectTimestamp(b) - projectTimestamp(a);
    if (newestDelta !== 0) return newestDelta;

    return (b.displayOrder ?? 0) - (a.displayOrder ?? 0);
  });
}
