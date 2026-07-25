import type { PortfolioImage, PortfolioItem } from "@/types";

export function isPublishedProject(project: PortfolioItem) {
  return project.published !== false;
}

export function sortedProjectImages(project: PortfolioItem): PortfolioImage[] {
  const imageRecords = (project.imageRecords ?? [])
    .filter((image) => image.published !== false && Boolean(image.imageUrl))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (imageRecords.length > 0) return imageRecords;

  return (project.images ?? [])
    .filter(Boolean)
    .map((imageUrl, index) => ({
      id: index,
      imageUrl,
      sortOrder: index,
      coverImage: project.coverImageUrl === imageUrl || index === 0,
      published: true,
      altText: project.title,
    }));
}

export function projectCoverImage(project: PortfolioItem) {
  return (
    project.coverImageUrl ||
    sortedProjectImages(project).find((image) => image.coverImage)?.imageUrl ||
    sortedProjectImages(project)[0]?.imageUrl
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
