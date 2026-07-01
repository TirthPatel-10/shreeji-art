package com.shreejiart.settings;

import com.shreejiart.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingService service;

    @GetMapping("/api/v1/settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> list() {
        return ResponseEntity.ok(ApiResponse.success(service.findAllAsMap()));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/settings")
    public ResponseEntity<ApiResponse<List<SiteSetting>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @PutMapping("/api/v1/admin/settings/{key}")
    public ResponseEntity<ApiResponse<SiteSetting>> upsert(
            @PathVariable String key,
            @RequestBody Map<String, String> body) {
        String value = body.getOrDefault("value", "");
        return ResponseEntity.ok(ApiResponse.success("Setting updated", service.upsert(key, value)));
    }

    @DeleteMapping("/api/v1/admin/settings/{key}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String key) {
        service.delete(key);
        return ResponseEntity.ok(ApiResponse.success("Setting deleted", null));
    }
}
