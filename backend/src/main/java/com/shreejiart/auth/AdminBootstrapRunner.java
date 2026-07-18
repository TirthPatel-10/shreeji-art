package com.shreejiart.auth;

import com.shreejiart.users.User;
import com.shreejiart.users.UserRepository;
import com.shreejiart.users.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Runs once on startup when ADMIN_BOOTSTRAP_ENABLED=true.
 * Creates the initial admin account if it does not already exist.
 * Disable after first successful run by setting ADMIN_BOOTSTRAP_ENABLED=false.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "admin.bootstrap.enabled", havingValue = "true", matchIfMissing = false)
public class AdminBootstrapRunner implements ApplicationRunner {

    @Value("${admin.bootstrap.email:}")
    private String adminEmail;

    @Value("${admin.bootstrap.password:}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Admin bootstrap enabled");

        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            log.error("Admin bootstrap: ADMIN_EMAIL and ADMIN_PASSWORD must both be set — skipping");
            return;
        }

        String email = adminEmail.toLowerCase().trim();

        if (userRepository.existsByEmail(email)) {
            log.info("Admin user already exists");
            return;
        }

        try {
            User admin = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .firstName("Shreeji")
                    .lastName("Admin")
                    .role(UserRole.ROLE_ADMIN)
                    .isActive(true)
                    .build();

            userRepository.save(admin);
            log.info("Admin user created successfully");
        } catch (Exception e) {
            log.error("Admin bootstrap: failed to create admin user — {}", e.getMessage());
        }
    }
}
