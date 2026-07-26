package com.shreejiart.media;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.StringUtils;

import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class MediaStoragePropertiesBindingTest {

    @Autowired
    private MediaStorageProperties properties;

    @Test
    void bindsStorageConfigurationWithoutPrintingSecrets() {
        boolean hasLocalEnvFile = Files.exists(Path.of(".env"));
        boolean hasSupabaseUrl = StringUtils.hasText(properties.getSupabaseUrl());
        boolean hasServiceRoleKey = StringUtils.hasText(properties.getServiceRoleKey());

        System.out.printf(
                "[MEDIA STORAGE CONFIG] supabaseUrl=%s serviceRoleKey=%s projectBucket=%s galleryBucket=%s timeoutSeconds=%d%n",
                hasSupabaseUrl ? maskUrl(properties.getSupabaseUrl()) : "MISSING",
                hasServiceRoleKey ? "SET length=" + properties.getServiceRoleKey().length() : "MISSING",
                properties.getProjectBucket(),
                properties.getGalleryBucket(),
                properties.getRequestTimeoutSeconds()
        );

        assertTrue(hasSupabaseUrl, "media.storage.supabase-url / SUPABASE_URL must be configured.");
        if (hasLocalEnvFile) {
            assertTrue(hasServiceRoleKey, "media.storage.service-role-key / SUPABASE_SERVICE_ROLE_KEY must be configured.");
        }
    }

    private String maskUrl(String value) {
        if (!StringUtils.hasText(value)) {
            return "MISSING";
        }
        return value.replaceFirst("https://([^.]+).*", "https://$1...");
    }
}
