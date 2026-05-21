package com.example.fitboard.auth.controller;

import com.example.fitboard.auth.service.KakaoAuthService;
import com.example.fitboard.user.dto.LoginResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
public class KakaoAuthController {

    private final KakaoAuthService kakaoAuthService;

    @Value("${kakao.frontend-redirect-uri}")
    private String frontendRedirectUri;

    public KakaoAuthController(KakaoAuthService kakaoAuthService) {
        this.kakaoAuthService = kakaoAuthService;
    }

    @GetMapping("/api/auth/kakao/login")
    public void redirectToKakao(HttpServletResponse response) throws IOException {
        String kakaoLoginUrl = kakaoAuthService.getKakaoLoginUrl();
        response.sendRedirect(kakaoLoginUrl);
    }

    @GetMapping("/api/auth/kakao/callback")
    public void kakaoCallback(
            @RequestParam String code,
            HttpServletResponse response
    ) throws IOException {
        LoginResponse loginResponse = kakaoAuthService.loginWithKakao(code);

        String encodedToken = URLEncoder.encode(
                loginResponse.getAccessToken(),
                StandardCharsets.UTF_8
        );

        response.sendRedirect(frontendRedirectUri + "?token=" + encodedToken);
    }
}