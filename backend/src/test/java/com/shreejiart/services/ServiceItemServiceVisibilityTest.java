package com.shreejiart.services;

import com.shreejiart.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ServiceItemServiceVisibilityTest {

    @Mock
    private ServiceItemRepository repository;

    @Test
    void publicLookupReturnsOnlyActiveServices() {
        ServiceItemService service = new ServiceItemService(repository);
        ServiceItem item = serviceItem(10L, true);

        when(repository.findByIdAndIsActiveTrue(10L)).thenReturn(Optional.of(item));

        ServiceItem result = service.findActiveById(10L);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.isActive()).isTrue();
    }

    @Test
    void publicLookupRejectsInactiveServices() {
        ServiceItemService service = new ServiceItemService(repository);

        when(repository.findByIdAndIsActiveTrue(10L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findActiveById(10L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void adminLookupStillReturnsInactiveServices() {
        ServiceItemService service = new ServiceItemService(repository);
        ServiceItem inactiveItem = serviceItem(10L, false);

        when(repository.findById(10L)).thenReturn(Optional.of(inactiveItem));

        ServiceItem result = service.findById(10L);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.isActive()).isFalse();
    }

    private ServiceItem serviceItem(Long id, boolean active) {
        return ServiceItem.builder()
                .id(id)
                .name("LED Signs")
                .slug("led-signs")
                .shortDescription("Energy-efficient LED signage.")
                .description("Detailed description")
                .isActive(active)
                .displayOrder(1)
                .build();
    }
}
