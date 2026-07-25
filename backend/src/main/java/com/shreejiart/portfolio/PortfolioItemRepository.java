package com.shreejiart.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioItemRepository extends JpaRepository<PortfolioItem, Long> {
    Optional<PortfolioItem> findBySlug(String slug);
    List<PortfolioItem> findAllByOrderByDisplayOrderAsc();
    List<PortfolioItem> findByIsFeaturedTrueOrderByDisplayOrderAsc();
    List<PortfolioItem> findByPublishedTrueOrderByDisplayOrderAsc();
    List<PortfolioItem> findByPublishedTrueAndIsFeaturedTrueOrderByDisplayOrderAsc();
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Long id);
}
