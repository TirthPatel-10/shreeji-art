package com.shreejiart.portfolio;

import com.shreejiart.common.exception.ResourceNotFoundException;
import com.shreejiart.media.MediaStorageException;
import com.shreejiart.media.MediaStorageService;
import com.shreejiart.media.StoredMedia;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PortfolioItemService {

    private final PortfolioItemRepository repository;
    private final PortfolioImageRepository imageRepository;
    private final MediaStorageService storageService;

    public List<PortfolioItem> findAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    @Transactional(readOnly = true)
    public List<PortfolioItemResponse> findAllResponses() {
        return findAll().stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public List<PortfolioItem> findPublished() {
        return repository.findByPublishedTrueOrderByDisplayOrderAsc();
    }

    @Transactional(readOnly = true)
    public List<PortfolioItemResponse> findPublishedResponses() {
        return findPublished().stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    public PortfolioItem findBySlug(String slug) {
        PortfolioItem item = repository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio item not found: " + slug));
        if (!item.isPublished()) {
            throw new ResourceNotFoundException("Portfolio item not found: " + slug);
        }
        return item;
    }

    public PortfolioItem findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio item", id));
    }

    @Transactional(readOnly = true)
    public PortfolioItemResponse findResponseBySlug(String slug) {
        PortfolioItem item = findBySlug(slug);
        List<PortfolioImage> images = imageRepository.findByProjectIdAndPublishedTrueOrderBySortOrderAscIdAsc(item.getId());
        return PortfolioItemResponse.fromDetail(item, images);
    }

    @Transactional
    public PortfolioItem create(PortfolioItem item) {
        item.setId(null);
        validateSlug(item.getSlug(), null);
        normalizeDescriptions(item);
        return repository.save(item);
    }

    @Transactional
    public PortfolioItemResponse createResponse(PortfolioItem item) {
        PortfolioItem saved = create(item);
        return PortfolioItemResponse.fromDetail(saved, List.of());
    }

    @Transactional
    public PortfolioItem update(Long id, PortfolioItem updates) {
        PortfolioItem existing = findById(id);
        validateSlug(updates.getSlug(), id);
        existing.setTitle(updates.getTitle());
        existing.setSlug(updates.getSlug());
        existing.setDescription(updates.getDescription());
        existing.setShortDescription(updates.getShortDescription());
        existing.setFullDescription(updates.getFullDescription());
        existing.setClientName(updates.getClientName());
        existing.setCategory(updates.getCategory());
        existing.setLocation(updates.getLocation());
        existing.setCompletionYear(updates.getCompletionYear());
        existing.setServiceId(updates.getServiceId());
        existing.setCoverImageUrl(updates.getCoverImageUrl());
        existing.setImages(updates.getImages());
        existing.setTags(updates.getTags());
        existing.setFeatured(updates.isFeatured());
        existing.setPublished(updates.isPublished());
        existing.setDisplayOrder(updates.getDisplayOrder());
        normalizeDescriptions(existing);
        return repository.save(existing);
    }

    @Transactional
    public PortfolioItemResponse updateResponse(Long id, PortfolioItem updates) {
        PortfolioItem saved = update(id, updates);
        List<PortfolioImage> images = imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(saved.getId());
        return PortfolioItemResponse.fromDetail(saved, images);
    }

    @Transactional
    public PortfolioItem setPublished(Long id, boolean published) {
        PortfolioItem project = findById(id);
        project.setPublished(published);
        return repository.save(project);
    }

    @Transactional
    public PortfolioItem setFeatured(Long id, boolean featured) {
        PortfolioItem project = findById(id);
        project.setFeatured(featured);
        return repository.save(project);
    }

    @Transactional
    public PortfolioItemResponse setPublishedResponse(Long id, boolean published) {
        return toSummaryResponse(setPublished(id, published));
    }

    @Transactional
    public PortfolioItemResponse setFeaturedResponse(Long id, boolean featured) {
        return toSummaryResponse(setFeatured(id, featured));
    }

    @Transactional
    public void delete(Long id) {
        PortfolioItem project = findById(id);
        List<PortfolioImage> images = imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(id);
        repository.delete(project);

        List<String> failedPaths = new ArrayList<>();
        for (PortfolioImage image : images) {
            try {
                storageService.deleteProjectImage(image.getStoragePath());
            } catch (RuntimeException ex) {
                failedPaths.add(image.getStoragePath());
            }
        }
        if (!failedPaths.isEmpty()) {
            throw new MediaStorageException("Portfolio project deleted, but some storage objects could not be removed.");
        }
    }

    public List<PortfolioImage> findImages(Long projectId, boolean publicOnly) {
        findById(projectId);
        return publicOnly
                ? imageRepository.findByProjectIdAndPublishedTrueOrderBySortOrderAscIdAsc(projectId)
                : imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId);
    }

    @Transactional(readOnly = true)
    public List<PortfolioImageResponse> findImageResponses(Long projectId, boolean publicOnly) {
        return findImages(projectId, publicOnly).stream()
                .map(PortfolioImageResponse::from)
                .toList();
    }

    public List<PortfolioImage> findPublishedImagesBySlug(String slug) {
        PortfolioItem project = findBySlug(slug);
        return imageRepository.findByProjectIdAndPublishedTrueOrderBySortOrderAscIdAsc(project.getId());
    }

    @Transactional(readOnly = true)
    public List<PortfolioImageResponse> findPublishedImageResponsesBySlug(String slug) {
        return findPublishedImagesBySlug(slug).stream()
                .map(PortfolioImageResponse::from)
                .toList();
    }

    @Transactional
    public PortfolioImage uploadImage(
            Long projectId,
            MultipartFile file,
            boolean coverImage,
            String altText,
            String caption,
            Integer sortOrder,
            boolean published
    ) {
        PortfolioItem project = findById(projectId);
        StoredMedia stored = coverImage
                ? storageService.uploadProjectCover(project.getId(), project.getSlug(), file)
                : storageService.uploadProjectGalleryImage(project.getId(), project.getSlug(), file);

        if (coverImage) {
            clearCover(projectId);
        }

        PortfolioImage image = PortfolioImage.builder()
                .project(project)
                .imageUrl(stored.publicUrl())
                .storagePath(stored.storagePath())
                .altText(altText)
                .caption(caption)
                .sortOrder(sortOrder != null ? sortOrder : nextSortOrder(projectId))
                .coverImage(coverImage)
                .published(published)
                .build();
        PortfolioImage saved = imageRepository.save(image);
        syncLegacyImageFields(projectId);
        return saved;
    }

    @Transactional
    public PortfolioImageResponse uploadImageResponse(
            Long projectId,
            MultipartFile file,
            boolean coverImage,
            String altText,
            String caption,
            Integer sortOrder,
            boolean published
    ) {
        return PortfolioImageResponse.from(uploadImage(projectId, file, coverImage, altText, caption, sortOrder, published));
    }

    @Transactional
    public PortfolioImage updateImage(
            Long projectId,
            Long imageId,
            String altText,
            String caption,
            Integer sortOrder,
            Boolean published
    ) {
        PortfolioImage image = findImageForProject(projectId, imageId);
        image.setAltText(altText);
        image.setCaption(caption);
        if (sortOrder != null) image.setSortOrder(sortOrder);
        if (published != null) image.setPublished(published);
        PortfolioImage saved = imageRepository.save(image);
        syncLegacyImageFields(projectId);
        return saved;
    }

    @Transactional
    public PortfolioImageResponse updateImageResponse(
            Long projectId,
            Long imageId,
            String altText,
            String caption,
            Integer sortOrder,
            Boolean published
    ) {
        return PortfolioImageResponse.from(updateImage(projectId, imageId, altText, caption, sortOrder, published));
    }

    @Transactional
    public void deleteImage(Long projectId, Long imageId) {
        PortfolioImage image = findImageForProject(projectId, imageId);
        boolean wasCover = image.isCoverImage();
        String storagePath = image.getStoragePath();
        imageRepository.delete(image);
        if (wasCover) {
            promoteFirstImageToCover(projectId);
        } else {
            syncLegacyImageFields(projectId);
        }
        storageService.deleteProjectImage(storagePath);
    }

    @Transactional
    public List<PortfolioImage> reorderImages(Long projectId, List<ImageOrder> imageOrders) {
        findById(projectId);
        List<PortfolioImage> existing = imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId);
        for (ImageOrder order : imageOrders) {
            PortfolioImage image = existing.stream()
                    .filter(item -> Objects.equals(item.getId(), order.imageId()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Image does not belong to this project."));
            image.setSortOrder(order.sortOrder());
        }
        imageRepository.saveAll(existing);
        syncLegacyImageFields(projectId);
        return imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId);
    }

    @Transactional
    public List<PortfolioImageResponse> reorderImageResponses(Long projectId, List<ImageOrder> imageOrders) {
        return reorderImages(projectId, imageOrders).stream()
                .map(PortfolioImageResponse::from)
                .toList();
    }

    @Transactional
    public PortfolioImage setCoverImage(Long projectId, Long imageId) {
        PortfolioImage image = findImageForProject(projectId, imageId);
        clearCover(projectId);
        image.setCoverImage(true);
        PortfolioImage saved = imageRepository.save(image);
        syncLegacyImageFields(projectId);
        return saved;
    }

    @Transactional
    public PortfolioImageResponse setCoverImageResponse(Long projectId, Long imageId) {
        return PortfolioImageResponse.from(setCoverImage(projectId, imageId));
    }

    private PortfolioImage findImageForProject(Long projectId, Long imageId) {
        findById(projectId);
        return imageRepository.findByIdAndProjectId(imageId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio image", imageId));
    }

    private void validateSlug(String slug, Long currentId) {
        if (!StringUtils.hasText(slug) || !slug.matches("^[a-z0-9]+(?:-[a-z0-9]+)*$")) {
            throw new IllegalArgumentException("Slug must use lowercase letters, numbers, and hyphens.");
        }
        boolean exists = currentId == null
                ? repository.existsBySlug(slug)
                : repository.existsBySlugAndIdNot(slug, currentId);
        if (exists) {
            throw new IllegalArgumentException("Portfolio slug already exists.");
        }
    }

    private void normalizeDescriptions(PortfolioItem item) {
        if (!StringUtils.hasText(item.getShortDescription()) && StringUtils.hasText(item.getDescription())) {
            item.setShortDescription(item.getDescription());
        }
        if (!StringUtils.hasText(item.getFullDescription()) && StringUtils.hasText(item.getDescription())) {
            item.setFullDescription(item.getDescription());
        }
        if (!StringUtils.hasText(item.getDescription()) && StringUtils.hasText(item.getFullDescription())) {
            item.setDescription(item.getFullDescription());
        }
    }

    private int nextSortOrder(Long projectId) {
        return imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId)
                .stream()
                .mapToInt(PortfolioImage::getSortOrder)
                .max()
                .orElse(-1) + 1;
    }

    private void clearCover(Long projectId) {
        List<PortfolioImage> images = imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId);
        images.forEach(image -> image.setCoverImage(false));
        imageRepository.saveAll(images);
    }

    private void promoteFirstImageToCover(Long projectId) {
        List<PortfolioImage> remaining = imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId);
        if (!remaining.isEmpty()) {
            remaining.getFirst().setCoverImage(true);
            imageRepository.save(remaining.getFirst());
        }
        syncLegacyImageFields(projectId);
    }

    private void syncLegacyImageFields(Long projectId) {
        PortfolioItem project = findById(projectId);
        List<PortfolioImage> images = imageRepository.findByProjectIdOrderBySortOrderAscIdAsc(projectId);
        project.setImages(images.stream().map(PortfolioImage::getImageUrl).toArray(String[]::new));
        project.setCoverImageUrl(images.stream()
                .filter(PortfolioImage::isCoverImage)
                .findFirst()
                .or(() -> images.stream().findFirst())
                .map(PortfolioImage::getImageUrl)
                .orElse(null));
        repository.save(project);
    }

    private PortfolioItemResponse toSummaryResponse(PortfolioItem item) {
        String[] legacyImages = item.getImages();
        int imageCount = legacyImages == null ? 0 : legacyImages.length;
        return PortfolioItemResponse.fromSummary(item, imageCount);
    }

    public record ImageOrder(Long imageId, int sortOrder) {}
}
