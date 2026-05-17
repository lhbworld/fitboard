package com.example.fitboard.comment.repository;

import com.example.fitboard.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBoardIdOrderByCreatedAtAsc(Long boardId);

    List<Comment> findByUser_IdOrderByCreatedAtDesc(Long userId);

    void deleteByBoard_User_Id(Long userId);
}