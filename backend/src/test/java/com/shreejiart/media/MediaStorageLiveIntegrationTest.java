package com.shreejiart.media;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfSystemProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@EnabledIfSystemProperty(named = "media.storage.live", matches = "true")
class MediaStorageLiveIntegrationTest {

    @Autowired
    private MediaStorageService storageService;

    @Autowired
    private MediaStorageProperties properties;

    @Test
    void uploadsGeneratesPublicUrlAndDeletesPortfolioImage() {
        MockMultipartFile file = pngFile();
        StoredMedia stored = storageService.uploadProjectCover(0L, "storage-smoke-test", file);
        System.out.printf(
                "[MEDIA STORAGE LIVE] bucket=%s pathPrefix=%s publicUrl=%s%n",
                stored.bucket(),
                stored.storagePath().split("/")[0],
                maskPublicUrl(stored.publicUrl())
        );

        try {
            assertEquals(properties.getProjectBucket(), stored.bucket());
            assertTrue(stored.storagePath().startsWith("projects/"));
            assertTrue(stored.publicUrl().contains("/storage/v1/object/public/" + properties.getProjectBucket() + "/"));
        } finally {
            storageService.deleteProjectImage(stored.storagePath());
        }
    }

    @Test
    void uploadsGeneratesPublicUrlAndDeletesGalleryImage() {
        MockMultipartFile file = pngFile();
        StoredMedia stored = storageService.uploadStandaloneGalleryImage(file);
        System.out.printf(
                "[MEDIA STORAGE LIVE] bucket=%s pathPrefix=%s publicUrl=%s%n",
                stored.bucket(),
                stored.storagePath().split("/")[0],
                maskPublicUrl(stored.publicUrl())
        );

        try {
            assertEquals(properties.getGalleryBucket(), stored.bucket());
            assertTrue(stored.storagePath().startsWith("standalone/"));
            assertTrue(stored.publicUrl().contains("/storage/v1/object/public/" + properties.getGalleryBucket() + "/"));
        } finally {
            storageService.deleteGalleryImage(stored.storagePath());
        }
    }

    private MockMultipartFile pngFile() {
        byte[] pngSignature = new byte[] {
                (byte) 0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A
        };
        return new MockMultipartFile(
                "file",
                "storage-smoke-test.png",
                "image/png",
                pngSignature
        );
    }

    private String maskPublicUrl(String value) {
        return value.replaceFirst("https://([^.]+).*", "https://$1.../storage-object");
    }
}
