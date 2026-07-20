package com.shreejiart.quotes;

import com.shreejiart.customers.Customer;
import com.shreejiart.users.User;

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
        String customerName,
        String customerEmail,
        String customerPhone,
        String companyName,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    static QuoteDto of(Quote q) {
        Customer c = q.getCustomer();
        User u = (c != null) ? c.getUser() : null;
        String name = (u != null)
                ? (u.getFirstName() + " " + u.getLastName()).strip()
                : null;
        return new QuoteDto(
                q.getId(),
                q.getReferenceNo(),
                q.getTitle(),
                q.getDescription(),
                q.getStatus().name(),
                q.getTotalAmount(),
                q.getValidUntil(),
                (c != null) ? c.getId() : null,
                name,
                (u != null) ? u.getEmail() : null,
                (u != null) ? u.getPhone() : null,
                (c != null) ? c.getCompanyName() : null,
                q.getCreatedAt(),
                q.getUpdatedAt()
        );
    }
}
