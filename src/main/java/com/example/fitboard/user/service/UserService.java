package com.example.fitboard.user.service;

import com.example.fitboard.user.dto.SignupRequest;
import com.example.fitboard.user.entity.User;
import com.example.fitboard.user.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
