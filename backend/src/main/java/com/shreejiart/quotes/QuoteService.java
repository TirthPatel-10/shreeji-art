package com.shreejiart.quotes;

import com.shreejiart.common.exception.ResourceNotFoundException;
import com.shreejiart.customers.Customer;
import com.shreejiart.customers.CustomerRepository;
import com.shreejiart.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuoteService {

    private final QuoteRepository repository;
    private final CustomerRepository customerRepository;

    public List<QuoteDto> findMyQuotes(User user) {
        Customer customer = customerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("No customer profile found"));
        return repository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(QuoteDto::of).toList();
    }

    public List<QuoteDto> findAll() {
        return repository.findAllByOrderByCreatedAtDesc()
                .stream().map(QuoteDto::of).toList();
    }

    public QuoteDto findById(Long id) {
        Quote quote = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote", id));
        return QuoteDto.of(quote);
    }

    public QuoteDto updateStatus(Long id, QuoteStatus status) {
        Quote quote = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quote", id));
        quote.setStatus(status);
        return QuoteDto.of(repository.save(quote));
    }
}
