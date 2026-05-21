package com.example.fitboard.auth.service;

import com.example.fitboard.auth.dto.KakaoTokenResponse;
import com.example.fitboard.auth.dto.KakaoUserInfoResponse;
import com.example.fitboard.user.dto.LoginResponse;
import com.example.fitboard.user.entity.AuthProvider;
import com.example.fitboard.user.entity.User;
import com.example.fitboard.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import com.example.fitboard.global.jwt.JwtTokenProvider;

@Service
public class KakaoAuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RestClient restClient = RestClient.create();

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    public KakaoAuthService(UserRepository userRepository,
                            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public String getKakaoLoginUrl() {
        return UriComponentsBuilder
                .fromUriString("https://kauth.kakao.com/oauth/authorize")
                .queryParam("response_type", "code")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .build()
                .encode()
                .toUriString();
    }

    @Transactional
    public LoginResponse loginWithKakao(String code) {
        KakaoTokenResponse tokenResponse = requestToken(code);
        KakaoUserInfoResponse userInfo = requestUserInfo(tokenResponse.getAccessToken());

        String providerId = userInfo.getProviderId();

        User user = userRepository
                .findByProviderAndProviderId(AuthProvider.KAKAO, providerId)
                .orElseGet(() -> createKakaoUser(userInfo));

        if (user.isDeleted()) {
            throw new IllegalArgumentException("탈퇴한 회원입니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user);

        return new LoginResponse("로그인 성공", accessToken);
    }

    private KakaoTokenResponse requestToken(String code) {
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);
        body.add("client_secret", clientSecret);

        return restClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(body)
                .retrieve()
                .body(KakaoTokenResponse.class);
    }

    private KakaoUserInfoResponse requestUserInfo(String kakaoAccessToken) {
        return restClient.get()
                .uri("https://kapi.kakao.com/v2/user/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + kakaoAccessToken)
                .retrieve()
                .body(KakaoUserInfoResponse.class);
    }

    private User createKakaoUser(KakaoUserInfoResponse userInfo) {
        String providerId = userInfo.getProviderId();

        String email = userInfo.getEmail();
        if (email == null || email.isBlank()) {
            email = "kakao_" + providerId + "@kakao.local";
        }

        String nickname = userInfo.getNickname();

        User kakaoUser = User.createKakaoUser(providerId, email, nickname);

        return userRepository.save(kakaoUser);
    }
}