package com.example.fitboard.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SignupRequest {

    private String loginId;
    private String password;
    private String email;
    private String nickname;
}