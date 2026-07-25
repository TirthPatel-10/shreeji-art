package com.shreejiart.gallery;

import com.shreejiart.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

record GalleryPublishRequest(boolean published) {}
record GalleryFeaturedRequest(boolean featured) {}
record GalleryOrderRequest(@NotNull Long galleryItemId, int sortOrder) {}
record GalleryReorderRequest(@NotNull List<@Valid GalleryOrderRequest> items) {}

@RestController
@RequiredArgsConstructor
public class GalleryItemController {

    private final GalleryItemService service;

    @GetMapping("/api/v1/gallery")
    public ResponseEntity<ApiResponse<List<GalleryItem>>> list(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(service.findAll(category)));
    }

    @GetMapping("/api/v1/gallery/{id}")
    public ResponseEntity<ApiResponse<GalleryItem>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    @GetMapping("/api/v1/admin/gallery")
    public ResponseEntity<ApiResponse<List<GalleryItem>>> adminList(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(service.findAllAdmin(category)));
    }

    @PostMapping(value = "/api/v1/admin/gallery", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<GalleryItem>> create(@RequestBody GalleryItem item) {
        return ResponseEntity.status(201).body(ApiResponse.success("Gallery item created", service.create(item)));
    }

    @PostMapping(value = "/api/v1/admin/gallery", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<GalleryItem>> upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String altText,
            @RequestParam(required = false) String caption,
            @RequestParam(defaultValue = "false") boolean featured,
            @RequestParam(defaultValue = "true") boolean published,
            @RequestParam(required = false) Integer sortOrder) {
        GalleryItem item = service.upload(file, title, category, projectId, altText, caption, featured, published, sortOrder);
        return ResponseEntity.status(201).body(ApiResponse.success("Gallery image uploaded", item));
    }

    @PutMapping("/api/v1/admin/gallery/{id}")
    public ResponseEntity<ApiResponse<GalleryItem>> update(@PathVariable Long id, @RequestBody GalleryItem item) {
        return ResponseEntity.ok(ApiResponse.success("Gallery item updated", service.update(id, item)));
    }

    @DeleteMapping("/api/v1/admin/gallery/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Gallery item deleted", null));
    }

    @PatchMapping("/api/v1/admin/gallery/reorder")
    public ResponseEntity<ApiResponse<List<GalleryItem>>> reorder(@RequestBody @Valid GalleryReorderRequest request) {
        List<GalleryItemService.GalleryOrder> orders = request.items().stream()
                .map(item -> new GalleryItemService.GalleryOrder(item.galleryItemId(), item.sortOrder()))
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Gallery images reordered", service.reorder(orders)));
    }

    @PatchMapping("/api/v1/admin/gallery/{id}/publish")
    public ResponseEntity<ApiResponse<GalleryItem>> publish(
            @PathVariable Long id,
            @RequestBody GalleryPublishRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Gallery publish state updated", service.setPublished(id, request.published())));
    }

    @PatchMapping("/api/v1/admin/gallery/{id}/featured")
    public ResponseEntity<ApiResponse<GalleryItem>> featured(
            @PathVariable Long id,
            @RequestBody GalleryFeaturedRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Gallery featured state updated", service.setFeatured(id, request.featured())));
    }
}
