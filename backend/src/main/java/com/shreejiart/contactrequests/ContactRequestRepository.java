package com.shreejiart.contactrequests;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, Long> {
    List<ContactRequest> findByStatusOrderByCreatedAtDesc(ContactStatus status);
    List<ContactRequest> findAllByOrderByCreatedAtDesc();
}
