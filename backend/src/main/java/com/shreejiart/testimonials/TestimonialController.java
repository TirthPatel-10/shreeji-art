package com.shreejiart.testimonials;

import com.shreejiart.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialService service;

    @GetMapping("/api/v1/testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findApproved()));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/testimonials")
    public ResponseEntity<ApiResponse<List<Testimonial>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @PostMapping("/api/v1/admin/testimonials")
    public ResponseEntity<ApiResponse<Testimonial>> create(@RequestBody Testimonial item) {
        return ResponseEntity.status(201).body(ApiResponse.success("Testimonial created", service.create(item)));
    }

    @PutMapping("/api/v1/admin/testimonials/{id}")
    public ResponseEntity<ApiResponse<Testimonial>> update(@PathVariable Long id, @RequestBody Testimonial item) {
        return ResponseEntity.ok(ApiResponse.success("Testimonial updated", service.update(id, item)));
    }

    @DeleteMapping("/api/v1/admin/testimonials/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Testimonial deleted", null));
    }
}
