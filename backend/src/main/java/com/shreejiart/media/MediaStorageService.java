package com.shreejiart.media;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.Arrays;
import java.time.Clock;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MediaStorageService {

    private final MediaStorageProperties properties;
    private final Clock clock = Clock.systemUTC();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public StoredMedia uploadProjectCover(Long projectId, String slug, MultipartFile file) {
        return upload(properties.getProjectBucket(), "projects/%s/cover".formatted(projectFolder(projectId, slug)), file);
    }

    public StoredMedia uploadProjectGalleryImage(Long projectId, String slug, MultipartFile file) {
        return upload(properties.getProjectBucket(), "projects/%s/gallery".formatted(projectFolder(projectId, slug)), file);
    }

    public StoredMedia uploadStandaloneGalleryImage(MultipartFile file) {
        return upload(properties.getGalleryBucket(), "standalone/%s".formatted(UUID.randomUUID()), file);
    }

    public void delete(String bucket, String storagePath) {
        if (!StringUtils.hasText(storagePath)) return;
        ensureConfigured();
        validateSafeStoragePath(storagePath);
        String endpoint = normalizedSupabaseUrl() + "/storage/v1/object/" + urlPath(bucket);
        String body = "{\"prefixes\":[\"" + escapeJson(storagePath) + "\"]}";
        HttpRequest request = HttpRequest.newBuilder(URI.create(endpoint))
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getServiceRoleKey())
                .header("apikey", properties.getServiceRoleKey())
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .method("DELETE", HttpRequest.BodyPublishers.ofString(body))
                .build();
        sendStorageRequest(request, "delete storage object");
    }

    public void deleteProjectImage(String storagePath) {
        delete(properties.getProjectBucket(), storagePath);
    }

    public void deleteGalleryImage(String storagePath) {
        delete(properties.getGalleryBucket(), storagePath);
    }

    public String publicUrl(String bucket, String storagePath) {
        return normalizedSupabaseUrl() + "/storage/v1/object/public/" + urlPath(bucket) + "/" + urlPath(storagePath);
    }

    public String sanitizeFilename(String filename) {
        String base = StringUtils.hasText(filename) ? filename : "image";
        base = base.replace("\\", "/");
        base = base.substring(base.lastIndexOf('/') + 1);
        String extension = extensionOf(base);
        String nameOnly = extension.isBlank() ? base : base.substring(0, base.length() - extension.length() - 1);
        String normalized = Normalizer.normalize(nameOnly, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        if (!StringUtils.hasText(normalized)) normalized = "image";
        return extension.isBlank() ? normalized : normalized + "." + extension;
    }

    public void validateUpload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Upload file is required.");
        }
        if (file.getSize() > properties.getMaxUploadBytes()) {
            throw new IllegalArgumentException("Upload exceeds the maximum allowed size.");
        }
        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType) || !properties.getAllowedMimeTypes().contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Unsupported image MIME type.");
        }
        String extension = extensionOf(file.getOriginalFilename());
        if (!StringUtils.hasText(extension) || !properties.getAllowedExtensions().contains(extension)) {
            throw new IllegalArgumentException("Unsupported image file extension.");
        }
        String detectedMimeType = detectImageMimeType(file);
        if (!contentType.equalsIgnoreCase(detectedMimeType)) {
            throw new IllegalArgumentException("Uploaded image content does not match the declared MIME type.");
        }
        if (!extensionMatchesMimeType(extension, detectedMimeType)) {
            throw new IllegalArgumentException("Uploaded image extension does not match the image content.");
        }
    }

    private StoredMedia upload(String bucket, String prefix, MultipartFile file) {
        validateUpload(file);
        ensureConfigured();
        String safeName = sanitizeFilename(file.getOriginalFilename());
        String extension = extensionOf(safeName);
        String uniqueName = "%d-%s.%s".formatted(clock.millis(), UUID.randomUUID(), extension);
        String storagePath = prefix + "/" + uniqueName;
        validateSafeStoragePath(storagePath);

        try {
            String endpoint = normalizedSupabaseUrl() + "/storage/v1/object/" + urlPath(bucket) + "/" + urlPath(storagePath);
            HttpRequest request = HttpRequest.newBuilder(URI.create(endpoint))
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.getServiceRoleKey())
                    .header("apikey", properties.getServiceRoleKey())
                    .header(HttpHeaders.CONTENT_TYPE, file.getContentType())
                    .header("x-upsert", "false")
                    .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                    .build();
            sendStorageRequest(request, "upload storage object");
            return new StoredMedia(bucket, storagePath, publicUrl(bucket, storagePath), file.getContentType(), file.getSize());
        } catch (IOException ex) {
            throw new MediaStorageException("Could not read uploaded image.", ex);
        }
    }

    private void sendStorageRequest(HttpRequest request, String action) {
        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new MediaStorageException("Supabase Storage failed to " + action + ".");
            }
        } catch (IOException ex) {
            throw new MediaStorageException("Supabase Storage request failed.", ex);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new MediaStorageException("Supabase Storage request was interrupted.", ex);
        }
    }

    private void ensureConfigured() {
        if (!StringUtils.hasText(properties.getSupabaseUrl()) || !StringUtils.hasText(properties.getServiceRoleKey())) {
            throw new MediaStorageException("Supabase Storage is not configured.");
        }
    }

    private String normalizedSupabaseUrl() {
        return properties.getSupabaseUrl().replaceAll("/+$", "");
    }

    private String projectFolder(Long projectId, String slug) {
        String safeSlug = sanitizePathSegment(slug);
        return projectId + "-" + (StringUtils.hasText(safeSlug) ? safeSlug : "project");
    }

    private String sanitizePathSegment(String value) {
        if (!StringUtils.hasText(value)) return "";
        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9-]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private void validateSafeStoragePath(String storagePath) {
        if (storagePath.contains("..") || storagePath.startsWith("/") || storagePath.contains("\\")) {
            throw new IllegalArgumentException("Invalid storage path.");
        }
    }

    private String extensionOf(String filename) {
        if (!StringUtils.hasText(filename) || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
    }

    private String detectImageMimeType(MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length >= 3
                    && unsigned(bytes[0]) == 0xFF
                    && unsigned(bytes[1]) == 0xD8
                    && unsigned(bytes[2]) == 0xFF) {
                return MediaType.IMAGE_JPEG_VALUE;
            }
            if (bytes.length >= 8
                    && unsigned(bytes[0]) == 0x89
                    && bytes[1] == 0x50
                    && bytes[2] == 0x4E
                    && bytes[3] == 0x47
                    && bytes[4] == 0x0D
                    && bytes[5] == 0x0A
                    && bytes[6] == 0x1A
                    && bytes[7] == 0x0A) {
                return MediaType.IMAGE_PNG_VALUE;
            }
            if (bytes.length >= 12
                    && bytes[0] == 0x52
                    && bytes[1] == 0x49
                    && bytes[2] == 0x46
                    && bytes[3] == 0x46
                    && bytes[8] == 0x57
                    && bytes[9] == 0x45
                    && bytes[10] == 0x42
                    && bytes[11] == 0x50) {
                return "image/webp";
            }
            if (bytes.length >= 12
                    && bytes[4] == 0x66
                    && bytes[5] == 0x74
                    && bytes[6] == 0x79
                    && bytes[7] == 0x70
                    && Arrays.equals(Arrays.copyOfRange(bytes, 8, 12), new byte[] {0x61, 0x76, 0x69, 0x66})) {
                return "image/avif";
            }
            throw new IllegalArgumentException("Unsupported or invalid image file content.");
        } catch (IOException ex) {
            throw new IllegalArgumentException("Could not read uploaded image.");
        }
    }

    private boolean extensionMatchesMimeType(String extension, String mimeType) {
        return switch (mimeType.toLowerCase(Locale.ROOT)) {
            case MediaType.IMAGE_JPEG_VALUE -> extension.equals("jpg") || extension.equals("jpeg");
            case MediaType.IMAGE_PNG_VALUE -> extension.equals("png");
            case "image/webp" -> extension.equals("webp");
            case "image/avif" -> extension.equals("avif");
            default -> false;
        };
    }

    private int unsigned(byte value) {
        return value & 0xFF;
    }

    private String urlPath(String value) {
        return UriUtils.encodePath(value, StandardCharsets.UTF_8);
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
