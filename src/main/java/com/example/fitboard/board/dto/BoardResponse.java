package com.example.fitboard.board.dto;

import com.example.fitboard.board.entity.Board;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class BoardResponse {

    private final Long id;
    private final String title;
    private final String content;
    private final String category;
    private final int viewCount;
    private final Long userId;
    private final String nickname;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public BoardResponse(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.content = board.getContent();
        this.category = board.getCategory();
        this.viewCount = board.getViewCount();
        this.userId = board.getUser().getId();
        this.nickname = board.getUser().getNickname();
        this.createdAt = board.getCreatedAt();
        this.updatedAt = board.getUpdatedAt();
    }
}

// 응답 DTO를 따로두는 이유 >> Entity를 그대로 반환하지 않기 위함.
// Entity를 그대로 반환하면 나중에 연관관계나 불필요한 필드 때문에 응답이 지저분해질 수 있기 때문