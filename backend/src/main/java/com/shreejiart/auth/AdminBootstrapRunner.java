package com.shreejiart.auth;

import com.shreejiart.users.User;
import com.shreejiart.users.UserRepository;
import com.shreejiart.users.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements ApplicationRunner {

    @Value("${admin.bootstrap.enabled:false}")
    private boolean bootstrapEnabled;

    @Value("${admin.bootstrap.email:}")
    private String adminEmail;

    @Value("${admin.bootstrap.password:}")
    private String adminPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!bootstrapEnabled) {
            return;
        }

        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            throw new IllegalStateException(
                "ADMIN_EMAIL and ADMIN_PASSWORD must both be set when ADMIN_BOOTSTRAP_ENABLED=true"
            );
        }

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin bootstrap: account already exists for '{}', skipping.", adminEmail);
            return;
        }

        User admin = User.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .firstName("Admin")
                .lastName("")
                .role(UserRole.ROLE_ADMIN)
                .isActive(true)
                .build();

        userRepository.save(admin);
        log.info("Admin bootstrap: created admin account for '{}'.", adminEmail);
        log.info("Admin bootstrap: set ADMIN_BOOTSTRAP_ENABLED=false and redeploy to disable this runner.");
    }
}
