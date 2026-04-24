package com.example.fitboard.user.controller;

import com.example.fitboard.user.dto.LoginRequest;
import com.example.fitboard.user.dto.LoginResponse;
import com.example.fitboard.user.dto.SignupRequest;
import com.example.fitboard.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.fitboard.user.dto.MyInfoResponse;
import org.springframework.security.core.Authentication;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@Valid @RequestBody SignupRequest request) {
        userService.signup(request);
        return ResponseEntity.ok(Map.of("message", "회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<MyInfoResponse> getMyInfo(Authentication authentication) {
        Long userId = Long.parseLong(authentication.getName());
        MyInfoResponse response = userService.getMyInfo(userId);
        return ResponseEntity.ok(response);
    }
}