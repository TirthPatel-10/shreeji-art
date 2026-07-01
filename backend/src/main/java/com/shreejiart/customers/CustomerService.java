package com.shreejiart.customers;

import com.shreejiart.users.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository repository;

    @Transactional
    public CustomerDto findOrCreate(User user) {
        Customer customer = repository.findByUserId(user.getId())
                .orElseGet(() -> repository.save(Customer.builder().user(user).build()));
        return CustomerDto.of(customer, user);
    }

    @Transactional
    public CustomerDto update(User user, String companyName, String gstNumber,
                               String address, String city, String state, String pincode) {
        Customer customer = repository.findByUserId(user.getId())
                .orElseGet(() -> repository.save(Customer.builder().user(user).build()));
        customer.setCompanyName(companyName);
        customer.setGstNumber(gstNumber);
        customer.setAddress(address);
        customer.setCity(city);
        customer.setState(state);
        customer.setPincode(pincode);
        repository.save(customer);
        return CustomerDto.of(customer, user);
    }

    @Transactional(readOnly = true)
    public List<CustomerDto> findAll() {
        return repository.findAll().stream()
                .map(c -> CustomerDto.of(c, c.getUser()))
                .toList();
    }
}
