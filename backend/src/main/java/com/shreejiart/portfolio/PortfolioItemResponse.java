package com.shreejiart.portfolio;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.OffsetDateTime;
import java.util.List;

public record PortfolioItemResponse(
        Long id,
        String title,
        String slug,
        String description,
        String shortDescription,
        String fullDescription,
        String clientName,
        String category,
        String location,
        Integer completionYear,
        Long serviceId,
        String coverImageUrl,
        String[] images,
        String[] tags,
        @JsonProperty("isFeatured")
        boolean isFeatured,
        boolean published,
        int displayOrder,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt,
        List<PortfolioImageResponse> imageRecords,
        int imageCount
) {
    public static PortfolioItemResponse fromSummary(PortfolioItem item, int imageCount) {
        return from(item, null, imageCount);
    }

    public static PortfolioItemResponse fromDetail(PortfolioItem item, List<PortfolioImage> images) {
        List<PortfolioImageResponse> imageResponses = images.stream()
                .map(PortfolioImageResponse::from)
                .toList();
        return from(item, imageResponses, imageResponses.size());
    }

    private static PortfolioItemResponse from(
            PortfolioItem item,
            List<PortfolioImageResponse> imageRecords,
            int imageCount
    ) {
        return new PortfolioItemResponse(
                item.getId(),
                item.getTitle(),
                item.getSlug(),
                item.getDescription(),
                item.getShortDescription(),
                item.getFullDescription(),
                item.getClientName(),
                item.getCategory(),
                item.getLocation(),
                item.getCompletionYear(),
                item.getServiceId(),
                item.getCoverImageUrl(),
                item.getImages(),
                item.getTags(),
                item.isFeatured(),
                item.isPublished(),
                item.getDisplayOrder(),
                item.getCreatedAt(),
                item.getUpdatedAt(),
                imageRecords,
                imageCount
        );
    }
}
