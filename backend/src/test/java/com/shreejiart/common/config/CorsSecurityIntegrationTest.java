package com.shreejiart.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shreejiart.auth.AuthService;
import com.shreejiart.auth.dto.AuthResponse;
import com.shreejiart.users.UserRole;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "app.allowed-origins=https://shreeji-art.vercel.app,http://localhost:3000,http://localhost:3001"
})
@AutoConfigureMockMvc
class CorsSecurityIntegrationTest {

    private static final String PRODUCTION_ORIGIN = "https://shreeji-art.vercel.app";
    private static final String UNKNOWN_ORIGIN = "https://example.com";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    // Test A: production preflight must not return 403
    @Test
    void productionPreflightCanReachAuthEndpointWithoutJwt() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, PRODUCTION_ORIGIN)
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Authorization,Content-Type,Accept,Origin"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, PRODUCTION_ORIGIN))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString("POST")))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, containsString("Authorization")))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, containsString("Content-Type")))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS));
    }

    // Test B: login endpoint is public (unauthenticated POST succeeds)
    @Test
    void loginFromProductionOriginReceivesCorsHeaders() throws Exception {
        when(authService.login(any())).thenReturn(adminAuthResponse());

        mockMvc.perform(post("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, PRODUCTION_ORIGIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "admin@shreejiart.in",
                                "password", "correct-password"
                        ))))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, PRODUCTION_ORIGIN))
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS));
    }

    // Test C: protected admin endpoint rejects unauthenticated requests (but still sends CORS headers)
    @Test
    void protectedAdminEndpointStillRejectsUnauthenticatedRequests() throws Exception {
        var result = mockMvc.perform(get("/api/v1/admin/quotes")
                        .header(HttpHeaders.ORIGIN, PRODUCTION_ORIGIN))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, PRODUCTION_ORIGIN))
                .andReturn();

        assertThat(result.getResponse().getStatus()).isIn(401, 403);
    }

    // Test D: customer role cannot access admin endpoints
    @Test
    void customerRoleStillCannotAccessAdminEndpoints() throws Exception {
        mockMvc.perform(get("/api/v1/admin/quotes")
                        .header(HttpHeaders.ORIGIN, PRODUCTION_ORIGIN)
                        .with(user("customer@shreejiart.in").roles("CUSTOMER")))
                .andExpect(status().isForbidden())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, PRODUCTION_ORIGIN));
    }

    // Test E: unknown origin does not receive CORS access headers
    @Test
    void unknownOriginDoesNotReceiveCorsAccess() throws Exception {
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, UNKNOWN_ORIGIN)
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Authorization,Content-Type"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    // Test F: JWT filter must NOT reject an OPTIONS preflight that carries no Authorization header.
    // The filter's early-return path (no Bearer token → pass through) must not produce a 403.
    @Test
    void jwtFilterDoesNotRejectOptionsWithNoAuthorizationHeader() throws Exception {
        // No "Authorization" header is sent — exactly as a browser preflight behaves.
        mockMvc.perform(options("/api/v1/auth/login")
                        .header(HttpHeaders.ORIGIN, PRODUCTION_ORIGIN)
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "POST")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_HEADERS, "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, PRODUCTION_ORIGIN));
    }

    // Health endpoint must be reachable without authentication, even from the production origin.
    @Test
    void healthEndpointIsPublicAndReturnsCorsHeaders() throws Exception {
        mockMvc.perform(get("/api/health")
                        .header(HttpHeaders.ORIGIN, PRODUCTION_ORIGIN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"))
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, PRODUCTION_ORIGIN));
    }

    private AuthResponse adminAuthResponse() {
        return AuthResponse.builder()
                .token("test-token")
                .tokenType("Bearer")
                .user(AuthResponse.UserDto.builder()
                        .id(1L)
                        .email("admin@shreejiart.in")
                        .firstName("Admin")
                        .lastName("User")
                        .role(UserRole.ROLE_ADMIN)
                        .build())
                .build();
    }
}
