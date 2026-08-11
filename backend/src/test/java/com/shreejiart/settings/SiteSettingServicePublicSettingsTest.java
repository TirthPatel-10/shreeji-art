package com.shreejiart.settings;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SiteSettingServicePublicSettingsTest {

    @Mock
    private SiteSettingRepository repository;

    @Test
    void publicSettingsIncludeOnlyWhitelistedCompanyKeys() {
        SiteSettingService service = new SiteSettingService(repository);

        when(repository.findAll()).thenReturn(List.of(
                setting("company_phone", "+91 7383628386"),
                setting("company_email", "shreejiart1119@gmail.com"),
                setting("jwt_secret", "do-not-expose"),
                setting("internal_admin_note", "private")
        ));

        assertThat(service.findPublicAsMap())
                .containsEntry("company_phone", "+91 7383628386")
                .containsEntry("company_email", "shreejiart1119@gmail.com")
                .doesNotContainKeys("jwt_secret", "internal_admin_note");
    }

    private SiteSetting setting(String key, String value) {
        return SiteSetting.builder()
                .key(key)
                .value(value)
                .description("Test setting")
                .build();
    }
}
