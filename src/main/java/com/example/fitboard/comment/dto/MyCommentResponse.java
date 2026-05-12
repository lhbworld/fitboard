package com.example.fitboard.comment.dto;

import com.example.fitboard.comment.entity.Comment;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MyCommentResponse {

    private final Long id;
    private final String content;
    private final LocalDateTime createdAt;
    private final Long boardId;
    private final String boardTitle;

    public MyCommentResponse(Comment comment) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.boardId = comment.getBoard().getId();
        this.boardTitle = comment.getBoard().getTitle();
    }
}