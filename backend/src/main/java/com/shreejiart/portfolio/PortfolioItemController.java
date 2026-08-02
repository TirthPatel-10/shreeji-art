package com.shreejiart.portfolio;

import com.shreejiart.common.response.ApiResponse;
import com.shreejiart.gallery.GalleryItem;
import com.shreejiart.gallery.GalleryItemService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

record PublishRequest(boolean published) {}
record FeaturedRequest(boolean featured) {}
record PortfolioImageUpdateRequest(String altText, String caption, Integer sortOrder, Boolean published) {}
record PortfolioImageOrderRequest(@NotNull Long imageId, int sortOrder) {}
record PortfolioImageReorderRequest(@NotNull List<@Valid PortfolioImageOrderRequest> images) {}
record PortfolioImagesToGalleryRequest(
        @NotEmpty List<@NotNull Long> imageIds,
        String title,
        String category,
        String altText,
        String caption,
        Boolean featured,
        Boolean published
) {}
record PortfolioImagesToGalleryResponse(
        List<GalleryItem> created,
        List<Long> skippedDuplicateImageIds
) {}

@RestController
@RequiredArgsConstructor
public class PortfolioItemController {

    private final PortfolioItemService service;
    private final GalleryItemService galleryItemService;

    @GetMapping("/api/v1/portfolio")
    public ResponseEntity<ApiResponse<List<PortfolioItemResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findPublishedResponses()));
    }

    @GetMapping("/api/v1/portfolio/{slug}")
    public ResponseEntity<ApiResponse<PortfolioItemResponse>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(service.findResponseBySlug(slug)));
    }

    @GetMapping("/api/v1/portfolio/{slug}/images")
    public ResponseEntity<ApiResponse<List<PortfolioImageResponse>>> getImagesBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(service.findPublishedImageResponsesBySlug(slug)));
    }

    @GetMapping("/api/v1/admin/portfolio")
    public ResponseEntity<ApiResponse<List<PortfolioItemResponse>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAllResponses()));
    }

    @PostMapping("/api/v1/admin/portfolio")
    public ResponseEntity<ApiResponse<PortfolioItemResponse>> create(@RequestBody PortfolioItem item) {
        return ResponseEntity.status(201).body(ApiResponse.success("Portfolio item created", service.createResponse(item)));
    }

    @PutMapping("/api/v1/admin/portfolio/{id}")
    public ResponseEntity<ApiResponse<PortfolioItemResponse>> update(@PathVariable Long id, @RequestBody PortfolioItem item) {
        return ResponseEntity.ok(ApiResponse.success("Portfolio item updated", service.updateResponse(id, item)));
    }

    @DeleteMapping("/api/v1/admin/portfolio/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Portfolio item deleted", null));
    }

    @PatchMapping("/api/v1/admin/portfolio/{id}/publish")
    public ResponseEntity<ApiResponse<PortfolioItemResponse>> setPublished(
            @PathVariable Long id,
            @RequestBody PublishRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Portfolio publish state updated",
                service.setPublishedResponse(id, request.published())
        ));
    }

    @PatchMapping("/api/v1/admin/portfolio/{id}/featured")
    public ResponseEntity<ApiResponse<PortfolioItemResponse>> setFeatured(
            @PathVariable Long id,
            @RequestBody FeaturedRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Portfolio featured state updated",
                service.setFeaturedResponse(id, request.featured())
        ));
    }

    @GetMapping("/api/v1/admin/portfolio/{projectId}/images")
    public ResponseEntity<ApiResponse<List<PortfolioImageResponse>>> adminImages(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(service.findImageResponses(projectId, false)));
    }

    @PostMapping(value = "/api/v1/admin/portfolio/{projectId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PortfolioImageResponse>> uploadImage(
            @PathVariable Long projectId,
            @RequestPart("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean coverImage,
            @RequestParam(required = false) String altText,
            @RequestParam(required = false) String caption,
            @RequestParam(required = false) Integer sortOrder,
            @RequestParam(defaultValue = "true") boolean published) {
        PortfolioImageResponse image = service.uploadImageResponse(projectId, file, coverImage, altText, caption, sortOrder, published);
        return ResponseEntity.status(201).body(ApiResponse.success("Portfolio image uploaded", image));
    }

    @PutMapping("/api/v1/admin/portfolio/{projectId}/images/{imageId}")
    public ResponseEntity<ApiResponse<PortfolioImageResponse>> updateImage(
            @PathVariable Long projectId,
            @PathVariable Long imageId,
            @RequestBody PortfolioImageUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Portfolio image updated",
                service.updateImageResponse(projectId, imageId, request.altText(), request.caption(), request.sortOrder(), request.published())
        ));
    }

    @DeleteMapping("/api/v1/admin/portfolio/{projectId}/images/{imageId}")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long projectId,
            @PathVariable Long imageId) {
        service.deleteImage(projectId, imageId);
        return ResponseEntity.ok(ApiResponse.success("Portfolio image deleted", null));
    }

    @PatchMapping("/api/v1/admin/portfolio/{projectId}/images/reorder")
    public ResponseEntity<ApiResponse<List<PortfolioImageResponse>>> reorderImages(
            @PathVariable Long projectId,
            @RequestBody @Valid PortfolioImageReorderRequest request) {
        List<PortfolioItemService.ImageOrder> orders = request.images().stream()
                .map(item -> new PortfolioItemService.ImageOrder(item.imageId(), item.sortOrder()))
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Portfolio images reordered", service.reorderImageResponses(projectId, orders)));
    }

    @PatchMapping("/api/v1/admin/portfolio/{projectId}/images/{imageId}/cover")
    public ResponseEntity<ApiResponse<PortfolioImageResponse>> setCoverImage(
            @PathVariable Long projectId,
            @PathVariable Long imageId) {
        return ResponseEntity.ok(ApiResponse.success("Portfolio cover image updated", service.setCoverImageResponse(projectId, imageId)));
    }

    @PostMapping("/api/v1/admin/portfolio/{projectId}/images/gallery")
    public ResponseEntity<ApiResponse<PortfolioImagesToGalleryResponse>> addImagesToGallery(
            @PathVariable Long projectId,
            @RequestBody @Valid PortfolioImagesToGalleryRequest request) {
        GalleryItemService.CopyPortfolioImagesResult result = galleryItemService.copyPortfolioImages(
                projectId,
                request.imageIds(),
                request.title(),
                request.category(),
                request.altText(),
                request.caption(),
                Boolean.TRUE.equals(request.featured()),
                Boolean.TRUE.equals(request.published())
        );
        String message = result.created().isEmpty()
                ? "Selected images are already in the gallery"
                : "Selected portfolio images added to gallery";
        return ResponseEntity.status(201).body(ApiResponse.success(
                message,
                new PortfolioImagesToGalleryResponse(result.created(), result.skippedDuplicateImageIds())
        ));
    }
}
