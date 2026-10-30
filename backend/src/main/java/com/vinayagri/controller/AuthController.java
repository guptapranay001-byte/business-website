package com.vinayagri.controller;

import com.vinayagri.dto.ApiResponse;
import com.vinayagri.dto.AuthResponseDto;
import com.vinayagri.dto.GoogleAuthRequestDto;
import com.vinayagri.dto.UserResponseDto;
import com.vinayagri.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/google")
    public ResponseEntity<ApiResponse<AuthResponseDto>> authenticateWithGoogle(
            @Valid @RequestBody GoogleAuthRequestDto request) {
        AuthResponseDto authResponse = authService.authenticateWithGoogle(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", authResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDto>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalArgumentException("Authentication principal is missing or expired");
        }
        String email = authentication.getName();
        UserResponseDto userProfile = authService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", userProfile));
    }
}
