package com.shreejiart.quotes;

import com.shreejiart.common.response.ApiResponse;
import com.shreejiart.users.User;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

record QuoteStatusRequest(@NotBlank String status) {}

@RestController
@RequiredArgsConstructor
public class QuoteController {

    private final QuoteService service;

    @GetMapping("/api/v1/quotes/my")
    public ResponseEntity<ApiResponse<List<QuoteDto>>> myQuotes(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(service.findMyQuotes(user)));
    }

    @GetMapping("/api/v1/quotes/{id}")
    public ResponseEntity<ApiResponse<QuoteDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/quotes")
    public ResponseEntity<ApiResponse<List<QuoteDto>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @GetMapping("/api/v1/admin/quotes/{id}")
    public ResponseEntity<ApiResponse<QuoteDto>> adminGetById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    @PatchMapping("/api/v1/admin/quotes/{id}/status")
    public ResponseEntity<ApiResponse<QuoteDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody QuoteStatusRequest req) {
        QuoteStatus status = QuoteStatus.valueOf(req.status().toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Status updated", service.updateStatus(id, status)));
    }
}
