package com.example.fitboard.global.jwt;

import com.example.fitboard.user.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey secretKey;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long expirationMs
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String createAccessToken(User user) {
        long now = System.currentTimeMillis();

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .claim("loginId", user.getLoginId())
                .claim("nickname", user.getNickname())
                .issuedAt(new Date(now))
                .expiration(new Date(now + expirationMs))
                .signWith(secretKey)
                .compact();
    }
}