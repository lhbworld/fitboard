package com.example.fitboard.user.service;

import com.example.fitboard.user.dto.LoginRequest;
import com.example.fitboard.user.dto.SignupRequest;
import com.example.fitboard.user.entity.User;
import com.example.fitboard.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.fitboard.global.jwt.JwtTokenProvider;
import com.example.fitboard.user.dto.LoginResponse;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public void signup(SignupRequest request) {
        validateDuplicateLoginId(request.getLoginId());
        validateDuplicateEmail(request.getEmail());

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                request.getLoginId(),
                encodedPassword,
                request.getEmail(),
                request.getNickname()
        );

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByLoginId(request.getLoginId())
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtTokenProvider.createAccessToken(user); // 로그인 성공 후 토큰 만들기

        return new LoginResponse("로그인 성공", accessToken);
    }

    private void validateDuplicateLoginId(String loginId) {
        if (userRepository.existsByLoginId(loginId)) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
    }

    private void validateDuplicateEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
    }
}