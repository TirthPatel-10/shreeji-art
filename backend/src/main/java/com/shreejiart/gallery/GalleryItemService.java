package com.shreejiart.gallery;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GalleryItemService {

    private final GalleryItemRepository repository;

    public List<GalleryItem> findAll(String category) {
        List<GalleryItem> items = repository.findAll(Sort.by("displayOrder").ascending());
        if (category != null && !category.isBlank()) {
            return items.stream().filter(i -> category.equals(i.getCategory())).toList();
        }
        return items;
    }

    public GalleryItem findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", id));
    }

    public GalleryItem create(GalleryItem item) {
        item.setId(null);
        return repository.save(item);
    }

    public GalleryItem update(Long id, GalleryItem updates) {
        GalleryItem existing = findById(id);
        existing.setTitle(updates.getTitle());
        existing.setImageUrl(updates.getImageUrl());
        existing.setCategory(updates.getCategory());
        existing.setServiceId(updates.getServiceId());
        existing.setFeatured(updates.isFeatured());
        existing.setDisplayOrder(updates.getDisplayOrder());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Gallery item", id);
        repository.deleteById(id);
    }
}
