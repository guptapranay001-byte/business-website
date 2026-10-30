package com.vinayagri;

import com.vinayagri.entity.User;
import com.vinayagri.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private static final String TEST_SECRET = "vinay_agri_inputs_super_secure_secret_key_tonk_rajasthan_2026";
    private static final long EXPIRATION_MS = 3600000; // 1 hour

    private JwtTokenProvider jwtTokenProvider;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(TEST_SECRET, EXPIRATION_MS);

        testUser = new User();
        testUser.setId(42L);
        testUser.setName("Mohan Lal");
        testUser.setEmail("mohan@example.com");
        testUser.setRole(User.Role.CUSTOMER);
        testUser.setAuthProvider("GOOGLE");
        testUser.setActive(true);
    }

    @Test
    void shouldGenerateValidJwtTokenForUser() {
        String token = jwtTokenProvider.generateToken(testUser);

        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3, "JWT must consist of header, payload, and signature");
    }

    @Test
    void shouldValidateAndExtractClaimsFromValidToken() {
        String token = jwtTokenProvider.generateToken(testUser);

        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals("mohan@example.com", jwtTokenProvider.getEmailFromToken(token));
        assertEquals(42L, jwtTokenProvider.getUserIdFromToken(token));
        assertEquals("CUSTOMER", jwtTokenProvider.getRoleFromToken(token));
    }

    @Test
    void shouldReturnFalseForNullOrBlankToken() {
        assertFalse(jwtTokenProvider.validateToken(null));
        assertFalse(jwtTokenProvider.validateToken(""));
        assertFalse(jwtTokenProvider.validateToken("   "));
    }

    @Test
    void shouldReturnFalseForMalformedToken() {
        assertFalse(jwtTokenProvider.validateToken("not-a-valid-jwt-token"));
    }

    @Test
    void shouldReturnFalseForTamperedToken() {
        String token = jwtTokenProvider.generateToken(testUser);
        // Tamper with payload characters
        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";

        assertFalse(jwtTokenProvider.validateToken(tamperedToken));
    }

    @Test
    void shouldReturnFalseForExpiredToken() {
        // Expiration in the past (-60 seconds)
        JwtTokenProvider expiredProvider = new JwtTokenProvider(TEST_SECRET, -60000L);
        String expiredToken = expiredProvider.generateToken(testUser);

        assertFalse(jwtTokenProvider.validateToken(expiredToken));
    }

    @Test
    void shouldHandleShortSecretGracefullyViaSha256Hashing() {
        JwtTokenProvider shortSecretProvider = new JwtTokenProvider("short-key", EXPIRATION_MS);
        String token = shortSecretProvider.generateToken(testUser);

        assertNotNull(token);
        assertTrue(shortSecretProvider.validateToken(token));
        assertEquals("mohan@example.com", shortSecretProvider.getEmailFromToken(token));
    }
}
