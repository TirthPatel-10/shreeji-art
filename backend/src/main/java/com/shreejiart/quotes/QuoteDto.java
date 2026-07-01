package com.shreejiart.quotes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

public record QuoteDto(
        Long id,
        String referenceNo,
        String title,
        String description,
        String status,
        BigDecimal totalAmount,
        LocalDate validUntil,
        Long customerId,
        OffsetDateTime createdAt
) {
    static QuoteDto of(Quote q) {
        return new QuoteDto(
                q.getId(), q.getReferenceNo(), q.getTitle(), q.getDescription(),
                q.getStatus().name(), q.getTotalAmount(), q.getValidUntil(),
                q.getCustomer().getId(), q.getCreatedAt()
        );
    }
}
