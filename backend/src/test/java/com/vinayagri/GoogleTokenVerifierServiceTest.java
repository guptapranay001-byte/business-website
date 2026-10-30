package com.vinayagri;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.vinayagri.security.GoogleTokenVerifierService;
import com.vinayagri.security.GoogleUserInfo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.security.GeneralSecurityException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GoogleTokenVerifierServiceTest {

    private static final String TEST_CLIENT_ID = "test-client-id.apps.googleusercontent.com";

    @Mock
    private GoogleIdTokenVerifier mockVerifier;

    private GoogleTokenVerifierService service;

    @BeforeEach
    void setUp() {
        service = new GoogleTokenVerifierService(TEST_CLIENT_ID, mockVerifier);
    }

    @Test
    void shouldThrowExceptionWhenTokenIsEmptyOrNull() {
        assertThrows(IllegalArgumentException.class, () -> service.verifyToken(null));
        assertThrows(IllegalArgumentException.class, () -> service.verifyToken(""));
        assertThrows(IllegalArgumentException.class, () -> service.verifyToken("   "));
    }

    @Test
    void shouldThrowExceptionWhenClientIdIsNotConfigured() {
        GoogleTokenVerifierService unconfiguredService = new GoogleTokenVerifierService("", null);
        assertThrows(IllegalStateException.class, () -> unconfiguredService.verifyToken("dummy-token"));
    }

    @Test
    void shouldThrowExceptionWhenVerifierRejectsToken() throws GeneralSecurityException, IOException {
        when(mockVerifier.verify("invalid-token")).thenReturn(null);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyToken("invalid-token"));
        assertTrue(ex.getMessage().contains("Invalid or expired"));
    }

    @Test
    void shouldThrowExceptionWhenEmailIsNotVerified() throws GeneralSecurityException, IOException {
        GoogleIdToken mockIdToken = mock(GoogleIdToken.class);
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setSubject("google-sub-123");
        payload.setEmail("farmer@example.com");
        payload.setEmailVerified(false);

        when(mockIdToken.getPayload()).thenReturn(payload);
        when(mockVerifier.verify("unverified-email-token")).thenReturn(mockIdToken);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyToken("unverified-email-token"));
        assertTrue(ex.getMessage().contains("email is not verified"));
    }

    @Test
    void shouldThrowExceptionWhenEmailIsMissing() throws GeneralSecurityException, IOException {
        GoogleIdToken mockIdToken = mock(GoogleIdToken.class);
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setSubject("google-sub-123");
        payload.setEmail(null);

        when(mockIdToken.getPayload()).thenReturn(payload);
        when(mockVerifier.verify("missing-email-token")).thenReturn(mockIdToken);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> service.verifyToken("missing-email-token"));
        assertTrue(ex.getMessage().contains("provide an email address"));
    }

    @Test
    void shouldReturnGoogleUserInfoOnSuccessfulVerification() throws GeneralSecurityException, IOException {
        GoogleIdToken mockIdToken = mock(GoogleIdToken.class);
        GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
        payload.setSubject("google-sub-98765");
        payload.setEmail("Farmer.Tonk@Example.com");
        payload.setEmailVerified(true);
        payload.set("name", "Ramesh Kumar");
        payload.set("picture", "https://example.com/avatar.jpg");

        when(mockIdToken.getPayload()).thenReturn(payload);
        when(mockVerifier.verify("valid-google-id-token")).thenReturn(mockIdToken);

        GoogleUserInfo userInfo = service.verifyToken("valid-google-id-token");

        assertNotNull(userInfo);
        assertEquals("google-sub-98765", userInfo.getGoogleId());
        assertEquals("farmer.tonk@example.com", userInfo.getEmail());
        assertEquals("Ramesh Kumar", userInfo.getName());
        assertEquals("https://example.com/avatar.jpg", userInfo.getPictureUrl());
    }
}
