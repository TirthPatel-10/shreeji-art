package com.shreejiart.portfolio;

import com.shreejiart.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PortfolioItemController {

    private final PortfolioItemService service;

    @GetMapping("/api/v1/portfolio")
    public ResponseEntity<ApiResponse<List<PortfolioItem>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @GetMapping("/api/v1/portfolio/{slug}")
    public ResponseEntity<ApiResponse<PortfolioItem>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(service.findBySlug(slug)));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

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
}
