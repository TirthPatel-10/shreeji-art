package com.shreejiart.auth;

import com.shreejiart.auth.dto.AuthResponse;
import com.shreejiart.auth.dto.LoginRequest;
import com.shreejiart.auth.dto.RegisterRequest;
import com.shreejiart.common.response.ApiResponse;
import com.shreejiart.users.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(201).body(ApiResponse.success("Account created successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        log.info("[AUTH] Login request received: email={}", request.getEmail());
        AuthResponse response = authService.login(request);
        log.info("[AUTH] Login response ready: email={}", request.getEmail());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse.UserDto>> me(@AuthenticationPrincipal User user) {
        AuthResponse.UserDto dto = AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
