package com.shreejiart.customers;

import com.shreejiart.users.User;

public record CustomerDto(
        Long id,
        Long userId,
        String email,
        String firstName,
        String lastName,
        String phone,
        String companyName,
        String gstNumber,
        String address,
        String city,
        String state,
        String pincode
) {
    static CustomerDto of(Customer c, User user) {
        return new CustomerDto(
                c.getId(), user.getId(),
                user.getEmail(), user.getFirstName(), user.getLastName(), user.getPhone(),
                c.getCompanyName(), c.getGstNumber(),
                c.getAddress(), c.getCity(), c.getState(), c.getPincode()
        );
    }
}
