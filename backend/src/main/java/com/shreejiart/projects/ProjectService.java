package com.shreejiart.projects;

import com.shreejiart.common.exception.ResourceNotFoundException;
import com.shreejiart.customers.Customer;
import com.shreejiart.customers.CustomerRepository;
import com.shreejiart.users.User;
import com.shreejiart.users.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repository;
    private final CustomerRepository customerRepository;

    @Transactional(readOnly = true)
    public List<ProjectDto> findMyProjects(User user) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No customer profile found"));
        return repository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(ProjectDto::of).toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> findAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(ProjectDto::of).toList();
    }

    @Transactional(readOnly = true)
    public ProjectDto findById(Long id) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        return ProjectDto.of(project);
    }

    @Transactional(readOnly = true)
    public ProjectDto findByIdForUser(Long id, User user) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        ensureCanReadProject(project, user);
        return ProjectDto.of(project);
    }

    @Transactional
    public ProjectDto updateStatus(Long id, ProjectStatus status) {
        Project project = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", id));
        project.setStatus(status);
        return ProjectDto.of(repository.save(project));
    }

    private void ensureCanReadProject(Project project, User user) {
        if (user == null) {
            throw new AccessDeniedException("Access denied");
        }

        if (user.getRole() == UserRole.ROLE_ADMIN) {
            return;
        }

        Long ownerUserId = project.getCustomer() != null && project.getCustomer().getUser() != null
                ? project.getCustomer().getUser().getId()
                : null;

        if (!Objects.equals(ownerUserId, user.getId())) {
            throw new AccessDeniedException("Access denied");
        }
    }
}
