package com.shreejiart.customers;

import com.shreejiart.common.response.ApiResponse;
import com.shreejiart.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

record CustomerUpdateRequest(
        String companyName,
        String gstNumber,
        String address,
        String city,
        String state,
        String pincode
) {}

@RestController
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService service;

    @GetMapping("/api/v1/customers/profile")
    public ResponseEntity<ApiResponse<CustomerDto>> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(service.findOrCreate(user)));
    }

    @PutMapping("/api/v1/customers/profile")
    public ResponseEntity<ApiResponse<CustomerDto>> updateProfile(
            @AuthenticationPrincipal User user,
            @RequestBody CustomerUpdateRequest req) {
        CustomerDto updated = service.update(user, req.companyName(), req.gstNumber(),
                req.address(), req.city(), req.state(), req.pincode());
        return ResponseEntity.ok(ApiResponse.success("Profile updated", updated));
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/api/v1/admin/customers")
    public ResponseEntity<ApiResponse<List<CustomerDto>>> adminList() {
        return ResponseEntity.ok(ApiResponse.success(service.findAll()));
    }
}
