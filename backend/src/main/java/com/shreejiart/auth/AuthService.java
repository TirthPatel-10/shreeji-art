package com.shreejiart.auth;

import com.shreejiart.auth.dto.AuthResponse;
import com.shreejiart.auth.dto.LoginRequest;
import com.shreejiart.auth.dto.RegisterRequest;
import com.shreejiart.common.jwt.JwtUtil;
import com.shreejiart.users.User;
import com.shreejiart.users.UserRepository;
import com.shreejiart.users.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.ROLE_CUSTOMER)
                .isActive(true)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return buildAuthResponse(token, user);
    }

    public AuthResponse login(LoginRequest request) {
        // [3] Password authentication started
        log.info("[AUTH] authenticate() starting: email={}", request.getEmail());
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        // [4] Password authentication succeeded
        log.info("[AUTH] authenticate() passed: email={}", request.getEmail());

        // [2] User loaded
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        log.info("[AUTH] User loaded: id={}, role={}, active={}", user.getId(), user.getRole(), user.isActive());

        // [5] Authorities loaded
        var authorities = user.getAuthorities();
        log.info("[AUTH] Authorities: count={}, values={}", authorities.size(), authorities);

        // [6] JWT generation started
        log.info("[AUTH] JWT generation starting");
        String token = jwtUtil.generateToken(user);
        // [7] JWT generation succeeded
        log.info("[AUTH] JWT generation succeeded");

        // [8] Login response created
        AuthResponse response = buildAuthResponse(token, user);
        log.info("[AUTH] Response built: tokenType={}, role={}", response.getTokenType(), response.getUser() != null ? response.getUser().getRole() : "null");

        // [9] Response returned (logged in AuthController after this returns)
        return response;
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(AuthResponse.UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .firstName(user.getFirstName())
                        .lastName(user.getLastName())
                        .phone(user.getPhone())
                        .role(user.getRole())
                        .build())
                .build();
    }
}
