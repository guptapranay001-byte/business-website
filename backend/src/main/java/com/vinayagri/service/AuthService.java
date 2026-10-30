package com.vinayagri.service;

import com.vinayagri.dto.AuthResponseDto;
import com.vinayagri.dto.GoogleAuthRequestDto;
import com.vinayagri.dto.UserResponseDto;

public interface AuthService {
    AuthResponseDto authenticateWithGoogle(GoogleAuthRequestDto request);
    UserResponseDto getCurrentUser(String email);
}
