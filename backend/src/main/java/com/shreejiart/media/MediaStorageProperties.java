package com.shreejiart.media;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "media.storage")
public class MediaStorageProperties {
    private String supabaseUrl = "";
    private String serviceRoleKey = "";
    private String projectBucket = "project-images";
    private String galleryBucket = "gallery-images";
    private long maxUploadBytes = 15L * 1024L * 1024L;
    private List<String> allowedMimeTypes = List.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif"
    );
    private List<String> allowedExtensions = List.of("jpg", "jpeg", "png", "webp", "avif");
}
