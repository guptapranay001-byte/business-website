package com.vinayagri.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleAuthRequestDto {

    @NotBlank(message = "Google ID token cannot be empty")
    private String idToken;

    public GoogleAuthRequestDto() {
    }

    public GoogleAuthRequestDto(String idToken) {
        this.idToken = idToken;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }
}
