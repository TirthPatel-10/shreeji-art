package com.shreejiart.blogs;

import com.shreejiart.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class BlogPostController {

    private final BlogPostService service;

    @GetMapping("/api/v1/blogs")
    public ResponseEntity<ApiResponse<List<BlogPost>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findPublished()));
    }

    @GetMapping("/api/v1/blogs/{slug}")
    public ResponseEntity<ApiResponse<BlogPost>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(service.findBySlug(slug)));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/blogs")
    public ResponseEntity<ApiResponse<List<BlogPost>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @PostMapping("/api/v1/admin/blogs")
    public ResponseEntity<ApiResponse<BlogPost>> create(@RequestBody BlogPost post) {
        return ResponseEntity.status(201).body(ApiResponse.success("Blog post created", service.create(post)));
    }

    @PutMapping("/api/v1/admin/blogs/{id}")
    public ResponseEntity<ApiResponse<BlogPost>> update(@PathVariable Long id, @RequestBody BlogPost post) {
        return ResponseEntity.ok(ApiResponse.success("Blog post updated", service.update(id, post)));
    }

    @DeleteMapping("/api/v1/admin/blogs/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Blog post deleted", null));
    }
}
