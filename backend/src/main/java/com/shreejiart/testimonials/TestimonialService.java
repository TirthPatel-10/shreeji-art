package com.shreejiart.testimonials;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestimonialService {

    private final TestimonialRepository repository;

    public List<Testimonial> findApproved() {
        return repository.findByIsApprovedTrueOrderByDisplayOrderAsc();
    }

    public List<Testimonial> findAll() {
        return repository.findAll();
    }

    public Testimonial findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testimonial", id));
    }

    public Testimonial create(Testimonial item) {
        item.setId(null);
        return repository.save(item);
    }

    public Testimonial update(Long id, Testimonial updates) {
        Testimonial existing = findById(id);
        existing.setCustomerName(updates.getCustomerName());
        existing.setCompany(updates.getCompany());
        existing.setContent(updates.getContent());
        existing.setRating(updates.getRating());
        existing.setImageUrl(updates.getImageUrl());
        existing.setApproved(updates.isApproved());
        existing.setDisplayOrder(updates.getDisplayOrder());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Testimonial", id);
        repository.deleteById(id);
    }
}
