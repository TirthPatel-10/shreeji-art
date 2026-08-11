package com.shreejiart.projects;

import com.shreejiart.customers.Customer;
import com.shreejiart.customers.CustomerRepository;
import com.shreejiart.users.User;
import com.shreejiart.users.UserRole;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceAuthorizationTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Test
    void customerCanReadOwnProjectById() {
        ProjectService service = new ProjectService(projectRepository, customerRepository);
        User owner = customerUser(10L, "owner@example.com");
        Project project = projectForCustomer(200L, owner);

        when(projectRepository.findById(200L)).thenReturn(Optional.of(project));

        ProjectDto result = service.findByIdForUser(200L, owner);

        assertThat(result.id()).isEqualTo(200L);
        assertThat(result.customerId()).isEqualTo(70L);
    }

    @Test
    void customerCannotReadAnotherCustomersProjectById() {
        ProjectService service = new ProjectService(projectRepository, customerRepository);
        User owner = customerUser(10L, "owner@example.com");
        User otherCustomer = customerUser(20L, "other@example.com");
        Project project = projectForCustomer(200L, owner);

        when(projectRepository.findById(200L)).thenReturn(Optional.of(project));

        assertThatThrownBy(() -> service.findByIdForUser(200L, otherCustomer))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void adminCanReadAnyProjectById() {
        ProjectService service = new ProjectService(projectRepository, customerRepository);
        User owner = customerUser(10L, "owner@example.com");
        User admin = adminUser(1L);
        Project project = projectForCustomer(200L, owner);

        when(projectRepository.findById(200L)).thenReturn(Optional.of(project));

        ProjectDto result = service.findByIdForUser(200L, admin);

        assertThat(result.id()).isEqualTo(200L);
    }

    private User customerUser(Long id, String email) {
        return User.builder()
                .id(id)
                .email(email)
                .passwordHash("hash")
                .firstName("Test")
                .lastName("Customer")
                .role(UserRole.ROLE_CUSTOMER)
                .isActive(true)
                .build();
    }

    private User adminUser(Long id) {
        return User.builder()
                .id(id)
                .email("admin@example.com")
                .passwordHash("hash")
                .firstName("Admin")
                .lastName("User")
                .role(UserRole.ROLE_ADMIN)
                .isActive(true)
                .build();
    }

    private Project projectForCustomer(Long projectId, User user) {
        return Project.builder()
                .id(projectId)
                .referenceNo("PRJ-2026-ABC123")
                .customer(Customer.builder().id(70L).user(user).build())
                .title("Installation Project")
                .description("Project description")
                .status(ProjectStatus.PLANNED)
                .build();
    }
}
