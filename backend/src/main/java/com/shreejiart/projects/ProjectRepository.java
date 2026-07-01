package com.shreejiart.projects;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Project> findAllByOrderByCreatedAtDesc();
}
