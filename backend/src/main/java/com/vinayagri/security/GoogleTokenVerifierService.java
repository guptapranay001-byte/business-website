package com.vinayagri.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleTokenVerifierService {

    private static final Logger log = LoggerFactory.getLogger(GoogleTokenVerifierService.class);

    private final String clientId;
    private final GoogleIdTokenVerifier verifier;

    @Autowired
    public GoogleTokenVerifierService(@Value("${app.google.client-id:}") String clientId) {
        this(clientId, createDefaultVerifier(clientId));
    }

    public GoogleTokenVerifierService(String clientId, GoogleIdTokenVerifier verifier) {
        this.clientId = (clientId != null) ? clientId.trim() : "";
        this.verifier = verifier;
    }

    private static GoogleIdTokenVerifier createDefaultVerifier(String clientId) {
        if (clientId == null || clientId.trim().isEmpty()) {
            log.warn("Google Client ID is not configured. Google token verification will not accept tokens until configured.");
            return null;
        }
        return new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId.trim()))
                .build();
    }

    public GoogleUserInfo verifyToken(String idTokenString) {
        if (idTokenString == null || idTokenString.trim().isEmpty()) {
            throw new IllegalArgumentException("Google ID token cannot be empty");
        }
        if (clientId.isEmpty() || verifier == null) {
            throw new IllegalStateException("Google authentication is not properly configured on the server (missing Google Client ID)");
        }

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString.trim());
            if (idToken == null) {
                log.warn("Google ID token verification failed: signature, issuer, audience, or expiry check failed");
                throw new IllegalArgumentException("Invalid or expired Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String googleId = payload.getSubject();
            String email = payload.getEmail();
            Boolean emailVerified = payload.getEmailVerified();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            if (googleId == null || googleId.trim().isEmpty()) {
                throw new IllegalArgumentException("Google token did not contain a valid subject (user ID)");
            }

            if (email == null || email.trim().isEmpty()) {
                throw new IllegalArgumentException("Google account must provide an email address");
            }

            if (emailVerified != null && !emailVerified) {
                throw new IllegalArgumentException("Google account email is not verified");
            }

            return new GoogleUserInfo(
                    googleId,
                    email.toLowerCase().trim(),
                    name != null ? name.trim() : "",
                    picture != null ? picture.trim() : null
            );
        } catch (IllegalArgumentException | IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during Google token verification: {}", e.getMessage());
            throw new IllegalArgumentException("Failed to verify Google ID token: " + e.getMessage(), e);
        }
    }

    public String getClientId() {
        return clientId;
    }
}
