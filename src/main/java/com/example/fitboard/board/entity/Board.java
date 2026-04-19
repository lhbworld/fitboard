package com.example.fitboard.board.entity;

import com.example.fitboard.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "boards")
@Getter
@NoArgsConstructor
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 게시글 제목
    @Column(nullable = false, length = 100)
    private String title;

    // 게시글 내용
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    // 운동 카테고리 예: 헬스, 식단, 유산소, 부상관리
    @Column(nullable = false, length = 30)
    private String category;

    // 조회수
    @Column(nullable = false)
    private int viewCount;

    // 작성자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 생성일
    @Column(nullable = false)
    private LocalDateTime createdAt;

    // 수정일
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Board(String title, String content, String category, User user) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.user = user;
        this.viewCount = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void update(String title, String content, String category) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.updatedAt = LocalDateTime.now();
    }

    public void increaseViewCount() {
        this.viewCount++;
    }
}