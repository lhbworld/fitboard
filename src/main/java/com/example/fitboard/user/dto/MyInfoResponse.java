package com.example.fitboard.user.dto;

import com.example.fitboard.user.entity.User;
import lombok.Getter;

@Getter
public class MyInfoResponse {

    private final Long id;
    private final String loginId;
    private final String email;
    private final String nickname;

    public MyInfoResponse(User user) {
        this.id = user.getId();
        this.loginId = user.getLoginId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
    }
}