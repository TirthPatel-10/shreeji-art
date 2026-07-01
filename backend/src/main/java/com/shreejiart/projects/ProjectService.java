package com.shreejiart.projects;

import com.shreejiart.common.exception.ResourceNotFoundException;
import com.shreejiart.customers.Customer;
import com.shreejiart.customers.CustomerRepository;
import com.shreejiart.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repository;
    private final CustomerRepository customerRepository;

    public List<ProjectDto> findMyProjects(User user) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No customer profile found"));
        return repository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(ProjectDto::of).toList();
    }

    public List<ProjectDto> findAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(ProjectDto::of).toList();
    }

    public ProjectDto findById(Long id) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        return ProjectDto.of(project);
    }

    public ProjectDto updateStatus(Long id, ProjectStatus status) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        project.setStatus(status);
        return ProjectDto.of(repository.save(project));
    }
}
