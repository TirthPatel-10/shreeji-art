package com.shreejiart.contactrequests;

import com.shreejiart.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactRequestService {

    private final ContactRequestRepository repository;

    public ContactRequest create(String name, String email, String phone,
                                  String company, String subject, String message) {
        return repository.save(ContactRequest.builder()
                .name(name).email(email).phone(phone)
                .company(company).subject(subject).message(message)
                .status(ContactStatus.NEW)
                .build());
    }

    public List<ContactRequest> findAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public ContactRequest findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact request", id));
    }

    public ContactRequest updateStatus(Long id, ContactStatus status) {
        ContactRequest req = findById(id);
        req.setStatus(status);
        return repository.save(req);
    }
}
