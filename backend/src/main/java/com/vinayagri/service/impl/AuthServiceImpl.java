package com.vinayagri.service.impl;

import com.vinayagri.dto.AuthResponseDto;
import com.vinayagri.dto.GoogleAuthRequestDto;
import com.vinayagri.dto.UserResponseDto;
import com.vinayagri.entity.User;
import com.vinayagri.exception.ResourceNotFoundException;
import com.vinayagri.repository.UserRepository;
import com.vinayagri.security.GoogleTokenVerifierService;
import com.vinayagri.security.GoogleUserInfo;
import com.vinayagri.security.JwtTokenProvider;
import com.vinayagri.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final GoogleTokenVerifierService googleTokenVerifierService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(GoogleTokenVerifierService googleTokenVerifierService,
                           JwtTokenProvider jwtTokenProvider,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.googleTokenVerifierService = googleTokenVerifierService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponseDto authenticateWithGoogle(GoogleAuthRequestDto request) {
        if (request == null || request.getIdToken() == null || request.getIdToken().trim().isEmpty()) {
            throw new IllegalArgumentException("Google ID token cannot be empty");
        }

        // 1. Verify Google ID token cryptographically
        GoogleUserInfo googleUserInfo = googleTokenVerifierService.verifyToken(request.getIdToken().trim());

        // 2. Lookup existing user by Google Subject ID or verified email
        User user = findOrCreateGoogleUser(googleUserInfo);

        if (!user.isActive()) {
            throw new IllegalArgumentException("User account is inactive. Please contact support.");
        }

        // 3. Issue application JWT token
        String jwtToken = jwtTokenProvider.generateToken(user);

        log.info("Google authentication successful for user email: {}, role: {}", user.getEmail(), user.getRole());

        return new AuthResponseDto(
                jwtToken,
                jwtTokenProvider.getExpirationMs(),
                mapToDto(user)
        );
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getCurrentUser(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return mapToDto(user);
    }

    private User findOrCreateGoogleUser(GoogleUserInfo googleInfo) {
        String googleId = googleInfo.getGoogleId();
        String email = googleInfo.getEmail().toLowerCase().trim();
        String name = (googleInfo.getName() != null && !googleInfo.getName().trim().isEmpty())
                ? googleInfo.getName().trim()
                : "Google User";
        String picture = googleInfo.getPictureUrl();

        // Check if user exists with this Google Subject ID
        Optional<User> existingByGoogleId = userRepository.findByGoogleId(googleId);
        if (existingByGoogleId.isPresent()) {
            User user = existingByGoogleId.get();
            boolean updated = false;
            if (name != null && !name.equals(user.getName())) {
                user.setName(name);
                updated = true;
            }
            if (picture != null && !picture.equals(user.getPictureUrl())) {
                user.setPictureUrl(picture);
                updated = true;
            }
            if (updated) {
                userRepository.save(user);
            }
            return user;
        }

        // Check if user exists with this verified email
        Optional<User> existingByEmail = userRepository.findByEmail(email);
        if (existingByEmail.isPresent()) {
            User user = existingByEmail.get();
            log.info("Linking verified Google identity {} to existing user with email {}", googleId, email);
            user.setGoogleId(googleId);
            if (user.getPictureUrl() == null && picture != null) {
                user.setPictureUrl(picture);
            }
            if ("LOCAL".equalsIgnoreCase(user.getAuthProvider())) {
                user.setAuthProvider("GOOGLE");
            }
            userRepository.save(user);
            return user;
        }

        // Create new Customer account
        log.info("Creating new customer account via Google Sign-In for email: {}", email);
        User newUser = new User();
        newUser.setName(name);
        newUser.setEmail(email);
        newUser.setGoogleId(googleId);
        newUser.setPictureUrl(picture);
        newUser.setAuthProvider("GOOGLE");
        newUser.setRole(User.Role.CUSTOMER);
        newUser.setActive(true);
        // Generate secure random hashed password to fulfill @NotBlank / nullable=false database constraint
        newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

        return userRepository.save(newUser);
    }

    private UserResponseDto mapToDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                user.getPictureUrl(),
                user.getAuthProvider(),
                user.isActive()
        );
    }
}
