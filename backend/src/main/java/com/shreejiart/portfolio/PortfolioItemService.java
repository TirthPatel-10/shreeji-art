package com.shreejiart.portfolio;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PortfolioItemService {

    private final PortfolioItemRepository repository;

    public List<PortfolioItem> findAll() {
        return repository.findAllByOrderByDisplayOrderAsc();
    }

    public PortfolioItem findBySlug(String slug) {
        return repository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio item not found: " + slug));
    }

    public PortfolioItem findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio item", id));
    }

    public PortfolioItem create(PortfolioItem item) {
        item.setId(null);
        return repository.save(item);
    }

    public PortfolioItem update(Long id, PortfolioItem updates) {
        PortfolioItem existing = findById(id);
        existing.setTitle(updates.getTitle());
        existing.setSlug(updates.getSlug());
        existing.setDescription(updates.getDescription());
        existing.setClientName(updates.getClientName());
        existing.setServiceId(updates.getServiceId());
        existing.setFeatured(updates.isFeatured());
        existing.setDisplayOrder(updates.getDisplayOrder());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Portfolio item", id);
        repository.deleteById(id);
    }
}
