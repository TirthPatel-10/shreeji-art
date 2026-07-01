package com.shreejiart.projects;

import java.time.LocalDate;
import java.time.OffsetDateTime;

public record ProjectDto(
        Long id,
        String referenceNo,
        String title,
        String description,
        String status,
        LocalDate startDate,
        LocalDate estimatedCompletion,
        LocalDate actualCompletion,
        Long customerId,
        OffsetDateTime createdAt
) {
    static ProjectDto of(Project p) {
        return new ProjectDto(
                p.getId(), p.getReferenceNo(), p.getTitle(), p.getDescription(),
                p.getStatus().name(), p.getStartDate(), p.getEstimatedCompletion(),
                p.getActualCompletion(), p.getCustomer().getId(), p.getCreatedAt()
        );
    }
}
