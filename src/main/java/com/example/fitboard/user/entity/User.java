package com.example.fitboard.user.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.example.fitboard.user.entity.AuthProvider;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String loginId;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 30)
    private String nickname;

    private boolean deleted = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AuthProvider provider = AuthProvider.LOCAL;

    @Column(length = 100)
    private String providerId;

    public User(String loginId, String password, String email, String nickname) {
        this.loginId = loginId;
        this.password = password;
        this.email = email;
        this.nickname = nickname;
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changePassword(String password) {
        this.password = password;
    }

    public void withdraw() {
        this.deleted = true;
        this.nickname = "탈퇴한 회원";

        this.loginId = "deleted_" + this.id;
        this.email = "deleted_" + this.id + "@deleted.local";

        if (this.providerId != null) {
            this.providerId = "deleted_" + this.id;
        }
    }

    public static User createKakaoUser(String providerId, String email, String nickname) {
        User user = new User();
        user.provider = AuthProvider.KAKAO;
        user.providerId = providerId;
        user.email = email;
        user.nickname = nickname;
        user.loginId = "kakao_" + providerId;
        user.password = "";
        user.deleted = false;
        return user;
    }
}