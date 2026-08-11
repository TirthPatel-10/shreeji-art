package com.shreejiart.gallery;

import com.shreejiart.media.MediaStorageService;
import com.shreejiart.portfolio.PortfolioImageRepository;
import com.shreejiart.portfolio.PortfolioItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GalleryItemServiceValidationTest {

    @Mock
    private GalleryItemRepository repository;

    @Mock
    private PortfolioItemRepository portfolioRepository;

    @Mock
    private PortfolioImageRepository portfolioImageRepository;

    @Mock
    private MediaStorageService storageService;

    @Test
    void createRejectsMissingImageUrlBeforeSaving() {
        GalleryItemService service = service();
        GalleryItem item = GalleryItem.builder()
                .title("Lobby signage")
                .imageUrl(" ")
                .published(true)
                .build();

        assertThatThrownBy(() -> service.create(item))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Gallery image URL is required");

        verify(repository, never()).save(item);
    }

    @Test
    void updateRejectsBlankImageUrlBeforeSaving() {
        GalleryItemService service = service();
        GalleryItem existing = GalleryItem.builder()
                .id(5L)
                .title("Existing")
                .imageUrl("https://example.com/existing.jpg")
                .published(true)
                .build();
        GalleryItem updates = GalleryItem.builder()
                .title("Updated")
                .imageUrl("")
                .published(true)
                .build();

        when(repository.findById(5L)).thenReturn(Optional.of(existing));

        assertThatThrownBy(() -> service.update(5L, updates))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Gallery image URL is required");

        verify(repository, never()).save(existing);
    }

    private GalleryItemService service() {
        return new GalleryItemService(
                repository,
                portfolioRepository,
                portfolioImageRepository,
                storageService
        );
    }
}
