package com.vinayagri;

import com.vinayagri.dto.AuthResponseDto;
import com.vinayagri.dto.GoogleAuthRequestDto;
import com.vinayagri.dto.UserResponseDto;
import com.vinayagri.entity.User;
import com.vinayagri.exception.ResourceNotFoundException;
import com.vinayagri.repository.UserRepository;
import com.vinayagri.security.GoogleTokenVerifierService;
import com.vinayagri.security.GoogleUserInfo;
import com.vinayagri.security.JwtTokenProvider;
import com.vinayagri.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private GoogleTokenVerifierService googleTokenVerifierService;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        authService = new AuthServiceImpl(
                googleTokenVerifierService,
                jwtTokenProvider,
                userRepository,
                passwordEncoder
        );
    }

    @Test
    void shouldThrowExceptionWhenRequestOrTokenIsEmpty() {
        assertThrows(IllegalArgumentException.class, () -> authService.authenticateWithGoogle(null));
        assertThrows(IllegalArgumentException.class, () -> authService.authenticateWithGoogle(new GoogleAuthRequestDto(null)));
        assertThrows(IllegalArgumentException.class, () -> authService.authenticateWithGoogle(new GoogleAuthRequestDto("")));
        assertThrows(IllegalArgumentException.class, () -> authService.authenticateWithGoogle(new GoogleAuthRequestDto("   ")));
    }

    @Test
    void shouldCreateNewCustomerWhenGoogleUserDoesNotExist() {
        GoogleUserInfo googleUserInfo = new GoogleUserInfo(
                "google-sub-new-123",
                "newfarmer@example.com",
                "Kailash Meena",
                "https://example.com/photo.jpg"
        );

        when(googleTokenVerifierService.verifyToken("valid-token")).thenReturn(googleUserInfo);
        when(userRepository.findByGoogleId("google-sub-new-123")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("newfarmer@example.com")).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPasswordHash");

        User savedUser = new User();
        savedUser.setId(101L);
        savedUser.setName("Kailash Meena");
        savedUser.setEmail("newfarmer@example.com");
        savedUser.setGoogleId("google-sub-new-123");
        savedUser.setPictureUrl("https://example.com/photo.jpg");
        savedUser.setAuthProvider("GOOGLE");
        savedUser.setRole(User.Role.CUSTOMER);
        savedUser.setActive(true);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtTokenProvider.generateToken(any(User.class))).thenReturn("mocked-jwt-token");
        when(jwtTokenProvider.getExpirationMs()).thenReturn(86400000L);

        AuthResponseDto response = authService.authenticateWithGoogle(new GoogleAuthRequestDto("valid-token"));

        assertNotNull(response);
        assertEquals("mocked-jwt-token", response.getToken());
        assertEquals("Bearer", response.getType());
        assertEquals(86400000L, response.getExpiresInMs());

        assertNotNull(response.getUser());
        assertEquals(101L, response.getUser().getId());
        assertEquals("Kailash Meena", response.getUser().getName());
        assertEquals("newfarmer@example.com", response.getUser().getEmail());
        assertEquals("CUSTOMER", response.getUser().getRole());
        assertEquals("GOOGLE", response.getUser().getAuthProvider());

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository, times(1)).save(captor.capture());
        User createdUser = captor.getValue();
        assertEquals("newfarmer@example.com", createdUser.getEmail());
        assertEquals("google-sub-new-123", createdUser.getGoogleId());
        assertEquals(User.Role.CUSTOMER, createdUser.getRole());
        assertTrue(createdUser.isActive());
    }

    @Test
    void shouldLoginExistingUserByGoogleId() {
        GoogleUserInfo googleUserInfo = new GoogleUserInfo(
                "google-sub-existing",
                "existing@example.com",
                "Suresh Sharma",
                "https://example.com/new-pic.jpg"
        );

        User existingUser = new User();
        existingUser.setId(55L);
        existingUser.setName("Suresh Sharma");
        existingUser.setEmail("existing@example.com");
        existingUser.setGoogleId("google-sub-existing");
        existingUser.setPictureUrl("https://example.com/old-pic.jpg");
        existingUser.setAuthProvider("GOOGLE");
        existingUser.setRole(User.Role.CUSTOMER);
        existingUser.setActive(true);

        when(googleTokenVerifierService.verifyToken("existing-token")).thenReturn(googleUserInfo);
        when(userRepository.findByGoogleId("google-sub-existing")).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenReturn(existingUser);
        when(jwtTokenProvider.generateToken(existingUser)).thenReturn("existing-user-jwt");
        when(jwtTokenProvider.getExpirationMs()).thenReturn(86400000L);

        AuthResponseDto response = authService.authenticateWithGoogle(new GoogleAuthRequestDto("existing-token"));

        assertNotNull(response);
        assertEquals("existing-user-jwt", response.getToken());
        assertEquals(55L, response.getUser().getId());
        assertEquals("https://example.com/new-pic.jpg", existingUser.getPictureUrl());
    }

    @Test
    void shouldLinkGoogleIdToExistingUserWithSameEmail() {
        GoogleUserInfo googleUserInfo = new GoogleUserInfo(
                "google-sub-link-999",
                "alreadyregistered@example.com",
                "Local Customer",
                "https://example.com/pic.jpg"
        );

        User localUser = new User();
        localUser.setId(77L);
        localUser.setName("Local Customer");
        localUser.setEmail("alreadyregistered@example.com");
        localUser.setAuthProvider("LOCAL");
        localUser.setRole(User.Role.CUSTOMER);
        localUser.setActive(true);

        when(googleTokenVerifierService.verifyToken("link-token")).thenReturn(googleUserInfo);
        when(userRepository.findByGoogleId("google-sub-link-999")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("alreadyregistered@example.com")).thenReturn(Optional.of(localUser));
        when(userRepository.save(any(User.class))).thenReturn(localUser);
        when(jwtTokenProvider.generateToken(localUser)).thenReturn("linked-user-jwt");
        when(jwtTokenProvider.getExpirationMs()).thenReturn(86400000L);

        AuthResponseDto response = authService.authenticateWithGoogle(new GoogleAuthRequestDto("link-token"));

        assertNotNull(response);
        assertEquals("linked-user-jwt", response.getToken());
        assertEquals(77L, response.getUser().getId());
        assertEquals("google-sub-link-999", localUser.getGoogleId());
        assertEquals("GOOGLE", localUser.getAuthProvider());
    }

    @Test
    void shouldThrowExceptionWhenAccountIsInactive() {
        GoogleUserInfo googleUserInfo = new GoogleUserInfo(
                "google-sub-inactive",
                "inactive@example.com",
                "Inactive User",
                null
        );

        User inactiveUser = new User();
        inactiveUser.setId(99L);
        inactiveUser.setName("Inactive User");
        inactiveUser.setEmail("inactive@example.com");
        inactiveUser.setGoogleId("google-sub-inactive");
        inactiveUser.setActive(false);

        when(googleTokenVerifierService.verifyToken("inactive-token")).thenReturn(googleUserInfo);
        when(userRepository.findByGoogleId("google-sub-inactive")).thenReturn(Optional.of(inactiveUser));

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> authService.authenticateWithGoogle(new GoogleAuthRequestDto("inactive-token")));
        assertTrue(ex.getMessage().contains("inactive"));
        verify(jwtTokenProvider, never()).generateToken(any());
    }

    @Test
    void shouldGetCurrentUserByEmail() {
        User user = new User();
        user.setId(10L);
        user.setName("Gopal Lal");
        user.setEmail("gopal@example.com");
        user.setRole(User.Role.CUSTOMER);
        user.setActive(true);

        when(userRepository.findByEmail("gopal@example.com")).thenReturn(Optional.of(user));

        UserResponseDto dto = authService.getCurrentUser("gopal@example.com");

        assertNotNull(dto);
        assertEquals(10L, dto.getId());
        assertEquals("Gopal Lal", dto.getName());
        assertEquals("gopal@example.com", dto.getEmail());
    }

    @Test
    void shouldThrowExceptionWhenCurrentUserNotFound() {
        when(userRepository.findByEmail("nonexistent@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> authService.getCurrentUser("nonexistent@example.com"));
    }
}
