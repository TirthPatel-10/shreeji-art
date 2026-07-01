package com.shreejiart.projects;

import com.shreejiart.common.response.ApiResponse;
import com.shreejiart.users.User;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

record ProjectStatusRequest(@NotBlank String status) {}

@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService service;

    @GetMapping("/api/v1/projects/my")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> myProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(service.findMyProjects(user)));
    }

    @GetMapping("/api/v1/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/projects")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }

    @GetMapping("/api/v1/admin/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> adminGetById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(service.findById(id)));
    }

    @PatchMapping("/api/v1/admin/projects/{id}/status")
    public ResponseEntity<ApiResponse<ProjectDto>> updateStatus(
            @PathVariable Long id,
            @RequestBody ProjectStatusRequest req) {
        ProjectStatus status = ProjectStatus.valueOf(req.status().toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Status updated", service.updateStatus(id, status)));
    }
}
