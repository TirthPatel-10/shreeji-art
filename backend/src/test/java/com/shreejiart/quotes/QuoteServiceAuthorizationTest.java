package com.shreejiart.quotes;

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
class QuoteServiceAuthorizationTest {

    @Mock
    private QuoteRepository quoteRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Test
    void customerCanReadOwnQuoteById() {
        QuoteService service = new QuoteService(quoteRepository, customerRepository);
        User owner = customerUser(10L, "owner@example.com");
        Quote quote = quoteForCustomer(100L, owner);

        when(quoteRepository.findById(100L)).thenReturn(Optional.of(quote));

        QuoteDto result = service.findByIdForUser(100L, owner);

        assertThat(result.id()).isEqualTo(100L);
        assertThat(result.customerEmail()).isEqualTo("owner@example.com");
    }

    @Test
    void customerCannotReadAnotherCustomersQuoteById() {
        QuoteService service = new QuoteService(quoteRepository, customerRepository);
        User owner = customerUser(10L, "owner@example.com");
        User otherCustomer = customerUser(20L, "other@example.com");
        Quote quote = quoteForCustomer(100L, owner);

        when(quoteRepository.findById(100L)).thenReturn(Optional.of(quote));

        assertThatThrownBy(() -> service.findByIdForUser(100L, otherCustomer))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void adminCanReadAnyQuoteById() {
        QuoteService service = new QuoteService(quoteRepository, customerRepository);
        User owner = customerUser(10L, "owner@example.com");
        User admin = adminUser(1L);
        Quote quote = quoteForCustomer(100L, owner);

        when(quoteRepository.findById(100L)).thenReturn(Optional.of(quote));

        QuoteDto result = service.findByIdForUser(100L, admin);

        assertThat(result.id()).isEqualTo(100L);
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

    private Quote quoteForCustomer(Long quoteId, User user) {
        return Quote.builder()
                .id(quoteId)
                .referenceNo("SA-2026-ABC123")
                .customer(Customer.builder().id(50L).user(user).build())
                .title("LED Signs — Quote Request")
                .description("Project description")
                .status(QuoteStatus.PENDING)
                .build();
    }
}
