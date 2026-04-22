package com.example.fitboard.user.dto;

import lombok.Getter;

@Getter
public class LoginResponse {

    private final String message;
    private final String accessToken;

    public LoginResponse(String message, String accessToken) {
        this.message = message;
        this.accessToken = accessToken;
    }
}