package com.shreejiart.services;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceItemService {

    private final ServiceItemRepository repository;

    public List<ServiceItem> findAllActive() {
        return repository.findByIsActiveTrueOrderByDisplayOrderAsc();
    }

    public List<ServiceItem> findAll() {
        return repository.findAll();
    }

    public ServiceItem findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", id));
    }

    public ServiceItem create(ServiceItem item) {
        item.setId(null);
        return repository.save(item);
    }

    public ServiceItem update(Long id, ServiceItem updates) {
        ServiceItem existing = findById(id);
        existing.setName(updates.getName());
        existing.setSlug(updates.getSlug());
        existing.setShortDescription(updates.getShortDescription());
        existing.setDescription(updates.getDescription());
        existing.setIcon(updates.getIcon());
        existing.setImageUrl(updates.getImageUrl());
        existing.setActive(updates.isActive());
        existing.setDisplayOrder(updates.getDisplayOrder());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Service", id);
        repository.deleteById(id);
    }
}
