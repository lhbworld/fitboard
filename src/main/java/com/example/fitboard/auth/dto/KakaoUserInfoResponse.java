package com.example.fitboard.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KakaoUserInfoResponse {

    private Long id;

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Getter
    public static class KakaoAccount {

        private String email;

        private Profile profile;
    }

    @Getter
    public static class Profile {

        private String nickname;

        @JsonProperty("profile_image_url")
        private String profileImageUrl;

        @JsonProperty("thumbnail_image_url")
        private String thumbnailImageUrl;
    }

    public String getProviderId() {
        return String.valueOf(id);
    }

    public String getEmail() {
        if (kakaoAccount == null) {
            return null;
        }

        return kakaoAccount.getEmail();
    }

    public String getNickname() {
        if (kakaoAccount == null || kakaoAccount.getProfile() == null) {
            return "카카오회원";
        }

        String nickname = kakaoAccount.getProfile().getNickname();

        if (nickname == null || nickname.isBlank()) {
            return "카카오회원";
        }

        return nickname;
    }
}