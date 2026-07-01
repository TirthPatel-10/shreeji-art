package com.shreejiart.services;

import com.shreejiart.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ServiceItemController {

    private final ServiceItemService service;

    @GetMapping("/api/v1/services")
    public ResponseEntity<ApiResponse<List<ServiceItem>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findAllActive()));
    }

    @GetMapping("/api/v1/services/{id}")
    public ResponseEntity<ApiResponse<ServiceItem>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/services")
    public ResponseEntity<ApiResponse<List<ServiceItem>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @PostMapping("/api/v1/admin/services")
    public ResponseEntity<ApiResponse<ServiceItem>> create(@RequestBody ServiceItem item) {
        return ResponseEntity.status(201).body(ApiResponse.success("Service created", service.create(item)));
    }

    @PutMapping("/api/v1/admin/services/{id}")
    public ResponseEntity<ApiResponse<ServiceItem>> update(@PathVariable Long id, @RequestBody ServiceItem item) {
        return ResponseEntity.ok(ApiResponse.success("Service updated", service.update(id, item)));
    }

    @DeleteMapping("/api/v1/admin/services/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Service deleted", null));
    }
}
