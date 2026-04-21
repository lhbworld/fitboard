package com.example.fitboard.comment.service;

import com.example.fitboard.board.entity.Board;
import com.example.fitboard.board.repository.BoardRepository;
import com.example.fitboard.comment.dto.CommentCreateRequest;
import com.example.fitboard.comment.dto.CommentResponse;
import com.example.fitboard.comment.dto.CommentUpdateRequest;
import com.example.fitboard.comment.entity.Comment;
import com.example.fitboard.comment.repository.CommentRepository;
import com.example.fitboard.user.entity.User;
import com.example.fitboard.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    public CommentService(CommentRepository commentRepository,
                          UserRepository userRepository,
                          BoardRepository boardRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.boardRepository = boardRepository;
    }

    @Transactional
    public CommentResponse createComment(Long boardId, CommentCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        Comment comment = new Comment(
                request.getContent(),
                user,
                board
        );

        Comment savedComment = commentRepository.save(comment);
        return new CommentResponse(savedComment);
    }

    public List<CommentResponse> getComments(Long boardId) {
        boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        return commentRepository.findByBoardIdOrderByCreatedAtAsc(boardId)
                .stream()
                .map(CommentResponse::new)
                .toList();
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        validateCommentOwner(comment, request.getUserId(), "작성자만 수정할 수 있습니다.");

        comment.update(request.getContent());

        return new CommentResponse(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 댓글입니다."));

        validateCommentOwner(comment, userId, "작성자만 삭제할 수 있습니다.");

        commentRepository.delete(comment);
    }

    private void validateCommentOwner(Comment comment, Long userId, String message) {
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(message);
        }
    }
}