package com.shreejiart.portfolio;

import java.time.OffsetDateTime;

public record PortfolioImageResponse(
        Long id,
        String imageUrl,
        String altText,
        String caption,
        int sortOrder,
        boolean coverImage,
        boolean published,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static PortfolioImageResponse from(PortfolioImage image) {
        return new PortfolioImageResponse(
                image.getId(),
                image.getImageUrl(),
                image.getAltText(),
                image.getCaption(),
                image.getSortOrder(),
                image.isCoverImage(),
                image.isPublished(),
                image.getCreatedAt(),
                image.getUpdatedAt()
        );
    }
}
