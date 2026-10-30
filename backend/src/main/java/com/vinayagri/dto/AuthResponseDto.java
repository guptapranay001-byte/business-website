package com.vinayagri.dto;

public class AuthResponseDto {

    private String token;
    private String type = "Bearer";
    private long expiresInMs;
    private UserResponseDto user;

    public AuthResponseDto() {
    }

    public AuthResponseDto(String token, long expiresInMs, UserResponseDto user) {
        this.token = token;
        this.expiresInMs = expiresInMs;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getExpiresInMs() {
        return expiresInMs;
    }

    public void setExpiresInMs(long expiresInMs) {
        this.expiresInMs = expiresInMs;
    }

    public UserResponseDto getUser() {
        return user;
    }

    public void setUser(UserResponseDto user) {
        this.user = user;
    }
}
