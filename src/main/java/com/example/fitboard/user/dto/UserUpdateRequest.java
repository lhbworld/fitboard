package com.example.fitboard.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class UserUpdateRequest {

    @NotBlank(message = "닉네임은 필수입니다.")
    private String nickname;
}