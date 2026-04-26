package com.example.fitboard.board.service;

import com.example.fitboard.board.dto.BoardCreateRequest;
import com.example.fitboard.board.dto.BoardResponse;
import com.example.fitboard.board.dto.BoardUpdateRequest;
import com.example.fitboard.board.entity.Board;
import com.example.fitboard.board.repository.BoardRepository;
import com.example.fitboard.user.entity.User;
import com.example.fitboard.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserRepository userRepository;

    public BoardService(BoardRepository boardRepository, UserRepository userRepository) {
        this.boardRepository = boardRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BoardResponse createBoard(Long userId, BoardCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        Board board = new Board(
                request.getTitle(),
                request.getContent(),
                request.getCategory(),
                user
        );

        Board savedBoard = boardRepository.save(board);
        return new BoardResponse(savedBoard);
    }

    public List<BoardResponse> getBoards() {
        return boardRepository.findAll()
                .stream()
                .map(BoardResponse::new)
                .toList();
    }

    @Transactional
    public BoardResponse getBoard(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        board.increaseViewCount();

        return new BoardResponse(board);
    }

    @Transactional
    public BoardResponse updateBoard(Long boardId, Long userId, BoardUpdateRequest request) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        validateBoardOwner(board, userId, "작성자만 수정할 수 있습니다.");

        board.update(
                request.getTitle(),
                request.getContent(),
                request.getCategory()
        );

        return new BoardResponse(board);
    }

    @Transactional
    public void deleteBoard(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글입니다."));

        validateBoardOwner(board, userId, "작성자만 삭제할 수 있습니다.");

        boardRepository.delete(board);
    }

    private void validateBoardOwner(Board board, Long userId, String message) {
        if (!board.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(message);
        }
    }
}