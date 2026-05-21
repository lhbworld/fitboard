package com.example.fitboard.user.repository;

import com.example.fitboard.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.fitboard.user.entity.AuthProvider;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByLoginId(String loginId);

    boolean existsByEmail(String email);

    Optional<User> findByLoginId(String loginId);

    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);
}