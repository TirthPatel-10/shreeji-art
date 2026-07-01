package com.shreejiart.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    Optional<PortfolioItem> findBySlug(String slug);
    List<PortfolioItem> findAllByOrderByDisplayOrderAsc();
    List<PortfolioItem> findByIsFeaturedTrueOrderByDisplayOrderAsc();
}
