package com.shreejiart.gallery;

import com.shreejiart.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // ── Admin ────────────────────────────────────────────────────────────────

    @PostMapping("/api/v1/admin/gallery")
    public ResponseEntity<ApiResponse<GalleryItem>> create(@RequestBody GalleryItem item) {
        return ResponseEntity.status(201).body(ApiResponse.success("Gallery item created", service.create(item)));
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
}
