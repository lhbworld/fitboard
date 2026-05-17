package com.example.fitboard.comment.dto;

import com.example.fitboard.comment.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommentResponse {

    private final Long id;
    private final String content;
    private final Long userId;
    private final String nickname;
    private final Long boardId;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.userId = comment.getUser().getId();
        this.nickname = comment.getUser().isDeleted()
                ? "탈퇴한 회원"
                : comment.getUser().getNickname();
        this.boardId = comment.getBoard().getId();
        this.createdAt = comment.getCreatedAt();
        this.updatedAt = comment.getUpdatedAt();
    }
}