package com.shreejiart.media;

public record StoredMedia(
        String bucket,
        String storagePath,
        String publicUrl,
        String contentType,
        long sizeBytes
) {}
