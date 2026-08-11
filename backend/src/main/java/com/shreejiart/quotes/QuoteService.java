package com.shreejiart.quotes;

import com.shreejiart.common.exception.ResourceNotFoundException;
import com.shreejiart.customers.Customer;
import com.shreejiart.customers.CustomerRepository;
import com.shreejiart.users.User;
import com.shreejiart.users.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QuoteService {

    private final QuoteRepository repository;
    private final CustomerRepository customerRepository;

    @Transactional
    public QuoteDto createFromRequest(User user, String serviceType, String description, String companyName) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseGet(() -> customerRepository.save(
                        Customer.builder().user(user).build()
                ));

        if (companyName != null && !companyName.isBlank()
                && (customer.getCompanyName() == null || customer.getCompanyName().isBlank())) {
            customer.setCompanyName(companyName);
            customer = customerRepository.save(customer);
        }

        Quote quote = Quote.builder()
                .referenceNo(generateReferenceNo())
                .customer(customer)
                .title(serviceType + " — Quote Request")
                .description(description)
                .status(QuoteStatus.PENDING)
                .build();

        return QuoteDto.of(repository.save(quote));
    }

    @Transactional(readOnly = true)
    public List<QuoteDto> findMyQuotes(User user) {
        return customerRepository.findByUserId(user.getId())
                .map(c -> repository.findByCustomerIdOrderByCreatedAtDesc(c.getId())
                        .stream().map(QuoteDto::of).toList())
                .orElse(List.of());
    }

    @Transactional(readOnly = true)
    public List<QuoteDto> findAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(QuoteDto::of).toList();
    }

    @Transactional(readOnly = true)
    public QuoteDto findById(Long id) {
        Quote quote = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote", id));
        return QuoteDto.of(quote);
    }

    @Transactional(readOnly = true)
    public QuoteDto findByIdForUser(Long id, User user) {
        Quote quote = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote", id));
        ensureCanReadQuote(quote, user);
        return QuoteDto.of(quote);
    }

    @Transactional
    public QuoteDto updateStatus(Long id, QuoteStatus status) {
        Quote quote = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote", id));
        quote.setStatus(status);
        return QuoteDto.of(repository.save(quote));
    }

    private String generateReferenceNo() {
        int year = LocalDate.now().getYear();
        String uid = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        return "SA-" + year + "-" + uid;
    }

    private void ensureCanReadQuote(Quote quote, User user) {
        if (user == null) {
            throw new AccessDeniedException("Access denied");
        }

        if (user.getRole() == UserRole.ROLE_ADMIN) {
            return;
        }

        Long ownerUserId = quote.getCustomer() != null && quote.getCustomer().getUser() != null
                ? quote.getCustomer().getUser().getId()
                : null;

        if (!Objects.equals(ownerUserId, user.getId())) {
            throw new AccessDeniedException("Access denied");
        }
    }
}
