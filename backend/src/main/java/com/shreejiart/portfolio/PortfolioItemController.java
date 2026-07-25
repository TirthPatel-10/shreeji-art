package com.shreejiart.portfolio;

import com.shreejiart.common.response.ApiResponse;
import jakarta.validation.Valid;
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

@RestController
@RequiredArgsConstructor
public class PortfolioItemController {

    private final PortfolioItemService service;

    @GetMapping("/api/v1/portfolio")
    public ResponseEntity<ApiResponse<List<PortfolioItem>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findPublished()));
    }

    @GetMapping("/api/v1/portfolio/{slug}")
    public ResponseEntity<ApiResponse<PortfolioItem>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(service.findBySlug(slug)));
    }

    @GetMapping("/api/v1/portfolio/{slug}/images")
    public ResponseEntity<ApiResponse<List<PortfolioImage>>> getImagesBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(service.findPublishedImagesBySlug(slug)));
    }

    @GetMapping("/api/v1/admin/portfolio")
    public ResponseEntity<ApiResponse<List<PortfolioItem>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @PostMapping("/api/v1/admin/portfolio")
    public ResponseEntity<ApiResponse<PortfolioItem>> create(@RequestBody PortfolioItem item) {
        return ResponseEntity.status(201).body(ApiResponse.success("Portfolio item created", service.create(item)));
    }

    @PutMapping("/api/v1/admin/portfolio/{id}")
    public ResponseEntity<ApiResponse<PortfolioItem>> update(@PathVariable Long id, @RequestBody PortfolioItem item) {
        return ResponseEntity.ok(ApiResponse.success("Portfolio item updated", service.update(id, item)));
    }

    @DeleteMapping("/api/v1/admin/portfolio/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Portfolio item deleted", null));
    }

    @PatchMapping("/api/v1/admin/portfolio/{id}/publish")
    public ResponseEntity<ApiResponse<PortfolioItem>> setPublished(
            @PathVariable Long id,
            @RequestBody PublishRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Portfolio publish state updated",
                service.setPublished(id, request.published())
        ));
    }

    @PatchMapping("/api/v1/admin/portfolio/{id}/featured")
    public ResponseEntity<ApiResponse<PortfolioItem>> setFeatured(
            @PathVariable Long id,
            @RequestBody FeaturedRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Portfolio featured state updated",
                service.setFeatured(id, request.featured())
        ));
    }

    @GetMapping("/api/v1/admin/portfolio/{projectId}/images")
    public ResponseEntity<ApiResponse<List<PortfolioImage>>> adminImages(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success(service.findImages(projectId, false)));
    }

    @PostMapping(value = "/api/v1/admin/portfolio/{projectId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<PortfolioImage>> uploadImage(
            @PathVariable Long projectId,
            @RequestPart("file") MultipartFile file,
            @RequestParam(defaultValue = "false") boolean coverImage,
            @RequestParam(required = false) String altText,
            @RequestParam(required = false) String caption,
            @RequestParam(required = false) Integer sortOrder,
            @RequestParam(defaultValue = "true") boolean published) {
        PortfolioImage image = service.uploadImage(projectId, file, coverImage, altText, caption, sortOrder, published);
        return ResponseEntity.status(201).body(ApiResponse.success("Portfolio image uploaded", image));
    }

    @PutMapping("/api/v1/admin/portfolio/{projectId}/images/{imageId}")
    public ResponseEntity<ApiResponse<PortfolioImage>> updateImage(
            @PathVariable Long projectId,
            @PathVariable Long imageId,
            @RequestBody PortfolioImageUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Portfolio image updated",
                service.updateImage(projectId, imageId, request.altText(), request.caption(), request.sortOrder(), request.published())
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
    public ResponseEntity<ApiResponse<List<PortfolioImage>>> reorderImages(
            @PathVariable Long projectId,
            @RequestBody @Valid PortfolioImageReorderRequest request) {
        List<PortfolioItemService.ImageOrder> orders = request.images().stream()
                .map(item -> new PortfolioItemService.ImageOrder(item.imageId(), item.sortOrder()))
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Portfolio images reordered", service.reorderImages(projectId, orders)));
    }

    @PatchMapping("/api/v1/admin/portfolio/{projectId}/images/{imageId}/cover")
    public ResponseEntity<ApiResponse<PortfolioImage>> setCoverImage(
            @PathVariable Long projectId,
            @PathVariable Long imageId) {
        return ResponseEntity.ok(ApiResponse.success("Portfolio cover image updated", service.setCoverImage(projectId, imageId)));
    }
}
