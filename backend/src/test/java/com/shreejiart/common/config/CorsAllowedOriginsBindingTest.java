package com.shreejiart.common.config;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfigurationSource;

import static org.assertj.core.api.Assertions.assertThat;

class CorsAllowedOriginsBindingTest {

    private static final String RAILWAY_ALLOWED_ORIGINS =
            "http://localhost:3000,https://shreeji-art.vercel.app";

    private final ApplicationContextRunner contextRunner = new ApplicationContextRunner()
            .withUserConfiguration(CorsConfig.class)
            .withPropertyValues(
                    "ALLOWED_ORIGINS=" + RAILWAY_ALLOWED_ORIGINS,
                    "app.allowed-origins=${ALLOWED_ORIGINS}"
            );

    @Test
    void railwayAllowedOriginsValueIsResolvedSplitAndTrimmed() {
        contextRunner.run(context -> {
            CorsConfigurationSource source = context.getBean(CorsConfigurationSource.class);
            MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/v1/auth/login");

            var configuration = source.getCorsConfiguration(request);

            assertThat(configuration).isNotNull();
            assertThat(configuration.getAllowedOrigins())
                    .containsExactly("http://localhost:3000", "https://shreeji-art.vercel.app");
        });
    }
}
