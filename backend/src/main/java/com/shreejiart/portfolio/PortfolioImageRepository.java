package com.shreejiart.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PortfolioImageRepository extends JpaRepository<PortfolioImage, Long> {
    List<PortfolioImage> findByProjectIdOrderBySortOrderAscIdAsc(Long projectId);

    List<PortfolioImage> findByProjectIdAndPublishedTrueOrderBySortOrderAscIdAsc(Long projectId);

    Optional<PortfolioImage> findByIdAndProjectId(Long id, Long projectId);

    void deleteByProjectId(Long projectId);
}
