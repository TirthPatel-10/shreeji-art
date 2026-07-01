package com.shreejiart.leads;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository repository;

    public Lead create(String name, String email, String phone,
                       String company, String serviceType, String message) {
        return repository.save(Lead.builder()
                .name(name).email(email).phone(phone)
                .company(company).serviceType(serviceType).message(message)
                .source("quote_form").status(LeadStatus.NEW)
                .build());
    }

    public List<Lead> findAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Lead findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
    }

    public Lead updateStatus(Long id, LeadStatus status) {
        Lead lead = findById(id);
        lead.setStatus(status);
        return repository.save(lead);
    }
}
