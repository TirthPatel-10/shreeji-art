package com.shreejiart.leads;

import com.shreejiart.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

record CreateLeadRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone,
        String company,
        String serviceType,
        String message
) {}

record LeadStatusRequest(@NotBlank String status) {}

@RestController
@RequiredArgsConstructor
public class LeadController {

    private final LeadService service;

    @PostMapping("/api/v1/leads")
    public ResponseEntity<ApiResponse<Lead>> submit(@Valid @RequestBody CreateLeadRequest req) {
        Lead saved = service.create(req.name(), req.email(), req.phone(),
                req.company(), req.serviceType(), req.message());
        return ResponseEntity.status(201).body(ApiResponse.success("Enquiry submitted successfully", saved));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/leads")
    public ResponseEntity<ApiResponse<List<Lead>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @GetMapping("/api/v1/admin/leads/{id}")
    public ResponseEntity<ApiResponse<Lead>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    @PatchMapping("/api/v1/admin/leads/{id}/status")
    public ResponseEntity<ApiResponse<Lead>> updateStatus(
            @PathVariable Long id,
            @RequestBody LeadStatusRequest req) {
        LeadStatus status = LeadStatus.valueOf(req.status().toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Status updated", service.updateStatus(id, status)));
    }
}
