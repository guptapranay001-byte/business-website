package com.vinayagri;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.vinayagri.dto.GoogleAuthRequestDto;
import com.vinayagri.entity.User;
import com.vinayagri.repository.UserRepository;
import com.vinayagri.security.GoogleTokenVerifierService;
import com.vinayagri.security.GoogleUserInfo;
import com.vinayagri.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @MockBean
    private GoogleTokenVerifierService googleTokenVerifierService;

    @Value("${app.jwt.secret:test_jwt_secret_key_tonk_rajasthan_test_environment_2026}")
    private String jwtSecret;

    @BeforeEach
    void setUp() {
        // Clean up test users to avoid unique constraint collisions
        userRepository.findByEmail("farmer.tonk@example.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("existing.farmer@example.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("inactive.farmer@example.com").ifPresent(userRepository::delete);
        userRepository.findByEmail("authenticated.me@example.com").ifPresent(userRepository::delete);
    }

    // =========================================================================
    // POST /api/auth/google Tests
    // =========================================================================

    @Test
    @DisplayName("POST /api/auth/google should authenticate and register a new customer")
    void shouldAuthenticateAndRegisterNewCustomerViaGoogle() throws Exception {
        String googleIdToken = "valid-google-id-token-new";
        GoogleUserInfo googleUserInfo = new GoogleUserInfo(
                "google-sub-tonk-101",
                "farmer.tonk@example.com",
                "Kailash Meena",
                "https://lh3.googleusercontent.com/photo.jpg"
        );

        when(googleTokenVerifierService.verifyToken(eq(googleIdToken))).thenReturn(googleUserInfo);

        GoogleAuthRequestDto request = new GoogleAuthRequestDto(googleIdToken);

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Authentication successful"))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.type").value("Bearer"))
                .andExpect(jsonPath("$.data.expiresInMs").value(greaterThan(0)))
                .andExpect(jsonPath("$.data.user.email").value("farmer.tonk@example.com"))
                .andExpect(jsonPath("$.data.user.name").value("Kailash Meena"))
                .andExpect(jsonPath("$.data.user.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.data.user.pictureUrl").value("https://lh3.googleusercontent.com/photo.jpg"))
                .andExpect(jsonPath("$.data.user.authProvider").value("GOOGLE"))
                .andExpect(jsonPath("$.data.user.active").value(true));
    }

    @Test
    @DisplayName("POST /api/auth/google should authenticate existing user without creating duplicate account")
    void shouldAuthenticateExistingUserWithoutDuplicate() throws Exception {
        // Pre-create existing user
        User existingUser = new User();
        existingUser.setName("Existing Farmer");
        existingUser.setEmail("existing.farmer@example.com");
        existingUser.setPassword(passwordEncoder.encode("ExistingPass#123"));
        existingUser.setRole(User.Role.CUSTOMER);
        existingUser.setAuthProvider("GOOGLE");
        existingUser.setGoogleId("google-sub-existing-202");
        existingUser.setActive(true);
        userRepository.save(existingUser);

        long initialUserCount = userRepository.count();

        String googleIdToken = "valid-google-id-token-existing";
        GoogleUserInfo googleUserInfo = new GoogleUserInfo(
                "google-sub-existing-202",
                "existing.farmer@example.com",
                "Existing Farmer Updated",
                "https://lh3.googleusercontent.com/updated.jpg"
        );

        when(googleTokenVerifierService.verifyToken(eq(googleIdToken))).thenReturn(googleUserInfo);

        GoogleAuthRequestDto request = new GoogleAuthRequestDto(googleIdToken);

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.user.email").value("existing.farmer@example.com"))
                .andExpect(jsonPath("$.data.user.name").value("Existing Farmer Updated"));

        assertEquals(initialUserCount, userRepository.count(), "User count must not increase for existing user");
    }

    @Test
    @DisplayName("POST /api/auth/google should reject empty or blank Google ID token with 400 Bad Request")
    void shouldRejectGoogleAuthWithBlankToken() throws Exception {
        GoogleAuthRequestDto emptyRequest = new GoogleAuthRequestDto("");

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(emptyRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value(containsString("Validation failed")));
    }

    @Test
    @DisplayName("POST /api/auth/google should reject invalid or expired Google ID token with 400 Bad Request")
    void shouldRejectGoogleAuthWhenVerificationFails() throws Exception {
        String invalidToken = "invalid-or-expired-google-token";
        when(googleTokenVerifierService.verifyToken(eq(invalidToken)))
                .thenThrow(new IllegalArgumentException("Invalid or expired Google ID token"));

        GoogleAuthRequestDto request = new GoogleAuthRequestDto(invalidToken);

        mockMvc.perform(post("/api/auth/google")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Invalid or expired Google ID token"));
    }

    // =========================================================================
    // GET /api/auth/me Tests
    // =========================================================================

    @Test
    @DisplayName("GET /api/auth/me with valid Bearer token should return 200 OK and user profile")
    void shouldReturnCurrentUserProfileWithValidBearerToken() throws Exception {
        User user = new User();
        user.setName("Authorized Farmer");
        user.setEmail("authenticated.me@example.com");
        user.setPassword(passwordEncoder.encode("SecurePassword#1"));
        user.setRole(User.Role.CUSTOMER);
        user.setAuthProvider("GOOGLE");
        user.setActive(true);
        user = userRepository.save(user);

        String jwtToken = jwtTokenProvider.generateToken(user);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User profile retrieved successfully"))
                .andExpect(jsonPath("$.data.email").value("authenticated.me@example.com"))
                .andExpect(jsonPath("$.data.name").value("Authorized Farmer"))
                .andExpect(jsonPath("$.data.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.data.active").value(true));
    }

    @Test
    @DisplayName("GET /api/auth/me without Authorization header should be rejected (403 Forbidden)")
    void shouldRejectGetAuthMeWithoutAuthorizationHeader() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/auth/me with invalid or forged Bearer token should be rejected (403 Forbidden)")
    void shouldRejectGetAuthMeWithInvalidToken() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid-tampered-token-12345")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/auth/me with expired Bearer token should be rejected (403 Forbidden)")
    void shouldRejectGetAuthMeWithExpiredToken() throws Exception {
        User user = new User();
        user.setName("Expired User");
        user.setEmail("authenticated.me@example.com");
        user.setPassword(passwordEncoder.encode("SecurePassword#1"));
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);
        user = userRepository.save(user);

        // Create provider with negative expiration to simulate expired token
        JwtTokenProvider expiredProvider = new JwtTokenProvider(jwtSecret, -60000L);
        String expiredToken = expiredProvider.generateToken(user);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + expiredToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/auth/me for inactive user should be rejected (403 Forbidden)")
    void shouldRejectGetAuthMeForInactiveUser() throws Exception {
        User inactiveUser = new User();
        inactiveUser.setName("Inactive User");
        inactiveUser.setEmail("inactive.farmer@example.com");
        inactiveUser.setPassword(passwordEncoder.encode("SecurePassword#1"));
        inactiveUser.setRole(User.Role.CUSTOMER);
        inactiveUser.setActive(false);
        inactiveUser = userRepository.save(inactiveUser);

        String token = jwtTokenProvider.generateToken(inactiveUser);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    // =========================================================================
    // Public Endpoints Accessibility Verification Tests
    // =========================================================================

    @Test
    @DisplayName("GET /api/health should remain accessible without authentication (200 OK)")
    void shouldAllowPublicAccessToHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /api/categories should remain accessible without authentication (200 OK)")
    void shouldAllowPublicAccessToCategoriesEndpoint() throws Exception {
        mockMvc.perform(get("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("GET /api/products should remain accessible without authentication (200 OK)")
    void shouldAllowPublicAccessToProductsEndpoint() throws Exception {
        mockMvc.perform(get("/api/products")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @DisplayName("GET /api/firms should remain accessible without authentication (200 OK)")
    void shouldAllowPublicAccessToFirmsEndpoint() throws Exception {
        mockMvc.perform(get("/api/firms")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
