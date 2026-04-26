package com.example.fitboard.board.controller;

import com.example.fitboard.board.dto.BoardCreateRequest;
import com.example.fitboard.board.dto.BoardResponse;
import com.example.fitboard.board.dto.BoardUpdateRequest;
import com.example.fitboard.board.service.BoardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(
            @Valid @RequestBody BoardCreateRequest request,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        BoardResponse response = boardService.createBoard(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<BoardResponse>> getBoards() {
        List<BoardResponse> response = boardService.getBoards();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> getBoard(@PathVariable Long boardId) {
        BoardResponse response = boardService.getBoard(boardId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable Long boardId,
            @Valid @RequestBody BoardUpdateRequest request,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        BoardResponse response = boardService.updateBoard(boardId, userId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Map<String, String>> deleteBoard(
            @PathVariable Long boardId,
            Authentication authentication
    ) {
        Long userId = Long.parseLong(authentication.getName());
        boardService.deleteBoard(boardId, userId);
        return ResponseEntity.ok(Map.of("message", "게시글 삭제 성공"));
    }
}