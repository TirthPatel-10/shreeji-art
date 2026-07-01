package com.shreejiart.services;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByIsActiveTrueOrderByDisplayOrderAsc();
    Optional<ServiceItem> findBySlug(String slug);
}
