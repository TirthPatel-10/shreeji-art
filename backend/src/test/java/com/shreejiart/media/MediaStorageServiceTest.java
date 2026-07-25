package com.shreejiart.media;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class MediaStorageServiceTest {

    private final MediaStorageProperties properties = new MediaStorageProperties();
    private final MediaStorageService service = new MediaStorageService(properties);

    @Test
    void acceptsSupportedImageUpload() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "Sign Board.JPG",
                "image/jpeg",
                new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00}
        );

        service.validateUpload(file);

        assertThat(service.sanitizeFilename(file.getOriginalFilename())).isEqualTo("sign-board.jpg");
    }

    @Test
    void rejectsEmptyUpload() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "empty.jpg",
                "image/jpeg",
                new byte[0]
        );

        assertThatThrownBy(() -> service.validateUpload(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("required");
    }

    @Test
    void rejectsUnsupportedMimeType() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "script.svg",
                "image/svg+xml",
                new byte[] {'<', 's', 'v', 'g'}
        );

        assertThatThrownBy(() -> service.validateUpload(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("MIME");
    }

    @Test
    void rejectsOversizedUpload() {
        properties.setMaxUploadBytes(2);
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "large.png",
                "image/png",
                new byte[] {(byte) 0x89, 0x50, 0x4E}
        );

        assertThatThrownBy(() -> service.validateUpload(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("maximum");
    }

    @Test
    void rejectsMismatchedMimeTypeAndFileContent() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "fake.png",
                "image/png",
                new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00}
        );

        assertThatThrownBy(() -> service.validateUpload(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("MIME");
    }

    @Test
    void rejectsMismatchedExtensionAndFileContent() {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "fake.webp",
                "image/jpeg",
                new byte[] {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF, 0x00}
        );

        assertThatThrownBy(() -> service.validateUpload(file))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("extension");
    }
}
