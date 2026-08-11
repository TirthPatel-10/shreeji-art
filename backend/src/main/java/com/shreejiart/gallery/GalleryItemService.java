package com.shreejiart.gallery;

import com.shreejiart.common.exception.ResourceNotFoundException;
import com.shreejiart.media.MediaStorageService;
import com.shreejiart.media.StoredMedia;
import com.shreejiart.portfolio.PortfolioItemRepository;
import com.shreejiart.portfolio.PortfolioImage;
import com.shreejiart.portfolio.PortfolioImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class GalleryItemService {

    private final GalleryItemRepository repository;
    private final PortfolioItemRepository portfolioRepository;
    private final PortfolioImageRepository portfolioImageRepository;
    private final MediaStorageService storageService;

    public List<GalleryItem> findAll(String category) {
        if (category != null && !category.isBlank()) {
            return repository.findByCategoryAndPublishedTrueOrderBySortOrderAscDisplayOrderAscIdAsc(category);
        }
        return repository.findByPublishedTrueOrderBySortOrderAscDisplayOrderAscIdAsc();
    }

    public List<GalleryItem> findAllAdmin(String category) {
        List<GalleryItem> items = repository.findAll(Sort.by("sortOrder").ascending().and(Sort.by("displayOrder").ascending()));
        if (category != null && !category.isBlank()) {
            return items.stream().filter(i -> category.equals(i.getCategory())).toList();
        }
        return items;
    }

    public GalleryItem findById(Long id) {
        GalleryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));
        if (!item.isPublished()) {
            throw new ResourceNotFoundException("Gallery item", id);
        }
        return item;
    }

    public GalleryItem findByIdAdmin(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));
    }

    @Transactional
    public GalleryItem create(GalleryItem item) {
        item.setId(null);
        validateImageUrl(item.getImageUrl());
        validateOptionalProject(item.getProjectId());
        item.setStoragePath(null);
        return repository.save(item);
    }

    @Transactional
    public GalleryItem update(Long id, GalleryItem updates) {
        GalleryItem existing = findByIdAdmin(id);
        validateImageUrl(updates.getImageUrl());
        validateOptionalProject(updates.getProjectId());
        existing.setTitle(updates.getTitle());
        existing.setImageUrl(updates.getImageUrl());
        existing.setAltText(updates.getAltText());
        existing.setCaption(updates.getCaption());
        existing.setCategory(updates.getCategory());
        existing.setServiceId(updates.getServiceId());
        existing.setProjectId(updates.getProjectId());
        existing.setFeatured(updates.isFeatured());
        existing.setPublished(updates.isPublished());
        existing.setSortOrder(updates.getSortOrder());
        existing.setDisplayOrder(updates.getDisplayOrder());
        return repository.save(existing);
    }

    @Transactional
    public GalleryItem upload(
            MultipartFile file,
            String title,
            String category,
            Long projectId,
            String altText,
            String caption,
            boolean featured,
            boolean published,
            Integer sortOrder
    ) {
        validateOptionalProject(projectId);
        StoredMedia stored = storageService.uploadStandaloneGalleryImage(file);
        GalleryItem item = GalleryItem.builder()
                .title(title)
                .imageUrl(stored.publicUrl())
                .storagePath(stored.storagePath())
                .altText(altText)
                .caption(caption)
                .category(category)
                .projectId(projectId)
                .isFeatured(featured)
                .published(published)
                .sortOrder(sortOrder != null ? sortOrder : nextSortOrder())
                .displayOrder(sortOrder != null ? sortOrder : nextSortOrder())
                .build();
        return repository.save(item);
    }

    @Transactional
    public CopyPortfolioImagesResult copyPortfolioImages(
            Long projectId,
            List<Long> imageIds,
            String title,
            String category,
            String altText,
            String caption,
            boolean featured,
            boolean published
    ) {
        validateOptionalProject(projectId);
        if (imageIds == null || imageIds.isEmpty()) {
            throw new IllegalArgumentException("Select at least one portfolio image.");
        }

        List<GalleryItem> created = new ArrayList<>();
        List<Long> skippedDuplicateImageIds = new ArrayList<>();
        int nextSortOrder = nextSortOrder();

        for (Long imageId : imageIds.stream().distinct().toList()) {
            PortfolioImage sourceImage = portfolioImageRepository
                    .findByIdAndProjectId(imageId, projectId)
                    .orElseThrow(() -> new ResourceNotFoundException("Portfolio image", imageId));

            if (repository.existsByProjectIdAndImageUrl(projectId, sourceImage.getImageUrl())) {
                skippedDuplicateImageIds.add(imageId);
                continue;
            }

            GalleryItem galleryItem = GalleryItem.builder()
                    .title(firstText(title, sourceImage.getCaption()))
                    .imageUrl(sourceImage.getImageUrl())
                    .storagePath(null)
                    .altText(firstText(altText, sourceImage.getAltText()))
                    .caption(firstText(caption, sourceImage.getCaption()))
                    .category(category)
                    .projectId(projectId)
                    .isFeatured(featured)
                    .published(published)
                    .sortOrder(nextSortOrder)
                    .displayOrder(nextSortOrder)
                    .build();

            created.add(repository.save(galleryItem));
            nextSortOrder += 1;
        }

        return new CopyPortfolioImagesResult(created, skippedDuplicateImageIds);
    }

    @Transactional
    public GalleryItem setPublished(Long id, boolean published) {
        GalleryItem item = findByIdAdmin(id);
        item.setPublished(published);
        return repository.save(item);
    }

    @Transactional
    public GalleryItem setFeatured(Long id, boolean featured) {
        GalleryItem item = findByIdAdmin(id);
        item.setFeatured(featured);
        return repository.save(item);
    }

    @Transactional
    public List<GalleryItem> reorder(List<GalleryOrder> orders) {
        List<GalleryItem> existing = repository.findAll();
        for (GalleryOrder order : orders) {
            GalleryItem item = existing.stream()
                    .filter(existingItem -> Objects.equals(existingItem.getId(), order.galleryItemId()))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Gallery item", order.galleryItemId()));
            item.setSortOrder(order.sortOrder());
            item.setDisplayOrder(order.sortOrder());
        }
        repository.saveAll(existing);
        return findAllAdmin(null);
    }

    @Transactional
    public void delete(Long id) {
        GalleryItem item = findByIdAdmin(id);
        String storagePath = item.getStoragePath();
        repository.delete(item);
        storageService.deleteGalleryImage(storagePath);
    }

    private void validateOptionalProject(Long projectId) {
        if (projectId != null && !portfolioRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Portfolio item", projectId);
        }
    }

    private void validateImageUrl(String imageUrl) {
        if (!StringUtils.hasText(imageUrl)) {
            throw new IllegalArgumentException("Gallery image URL is required.");
        }
    }

    private int nextSortOrder() {
        return repository.findAll().stream()
                .mapToInt(GalleryItem::getSortOrder)
                .max()
                .orElse(-1) + 1;
    }

    private String firstText(String preferred, String fallback) {
        return StringUtils.hasText(preferred) ? preferred : fallback;
    }

    public record GalleryOrder(Long galleryItemId, int sortOrder) {}

    public record CopyPortfolioImagesResult(
            List<GalleryItem> created,
            List<Long> skippedDuplicateImageIds
    ) {}
}
