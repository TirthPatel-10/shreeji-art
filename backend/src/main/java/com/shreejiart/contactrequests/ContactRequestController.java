package com.shreejiart.contactrequests;

import com.shreejiart.common.response.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

record CreateContactRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        String phone,
        String company,
        @NotBlank String subject,
        @NotBlank String message
) {}

record ContactStatusRequest(@NotBlank String status) {}

@RestController
@RequiredArgsConstructor
public class ContactRequestController {

    private final ContactRequestService service;

    @PostMapping("/api/v1/contact")
    public ResponseEntity<ApiResponse<ContactRequest>> submit(@Valid @RequestBody CreateContactRequest req) {
        ContactRequest saved = service.create(req.name(), req.email(), req.phone(),
                req.company(), req.subject(), req.message());
        return ResponseEntity.status(201).body(ApiResponse.success("Message sent successfully", saved));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/contact-requests")
    public ResponseEntity<ApiResponse<List<ContactRequest>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @GetMapping("/api/v1/admin/contact-requests/{id}")
    public ResponseEntity<ApiResponse<ContactRequest>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    @PatchMapping("/api/v1/admin/contact-requests/{id}/status")
    public ResponseEntity<ApiResponse<ContactRequest>> updateStatus(
            @PathVariable Long id,
            @RequestBody ContactStatusRequest req) {
        ContactStatus status = ContactStatus.valueOf(req.status().toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Status updated", service.updateStatus(id, status)));
    }
}
