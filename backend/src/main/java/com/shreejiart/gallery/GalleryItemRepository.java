package com.shreejiart.gallery;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryItemRepository extends JpaRepository<GalleryItem, Long> {
    List<GalleryItem> findByOrderByDisplayOrderAsc();
    List<GalleryItem> findByCategoryOrderByDisplayOrderAsc(String category);
    List<GalleryItem> findByIsFeaturedTrueOrderByDisplayOrderAsc();
}
