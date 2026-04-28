import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./BoardDetailPage.css";

function BoardDetailPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [myInfo, setMyInfo] = useState(null);

  const [message, setMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const getAccessToken = () => localStorage.getItem("accessToken");

  const fetchMyInfo = async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setMyInfo(null);
      return;
    }

    try {
      const response = await api.get("/api/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMyInfo(response.data);
    } catch (error) {
      console.error(error);
      setMyInfo(null);
    }
  };

  const fetchBoardDetail = async () => {
    try {
      const boardResponse = await api.get(`/api/boards/${boardId}`);
      setBoard(boardResponse.data);

      const commentResponse = await api.get(`/api/boards/${boardId}/comments`);
      setComments(commentResponse.data);
    } catch (error) {
      console.error(error);
      setMessage("게시글 상세 정보를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const fetchAll = async () => {
    await fetchMyInfo();
    await fetchBoardDetail();
  };

  useEffect(() => {
    fetchAll();
  }, [boardId]);

  const handleCommentSubmit = async () => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        setCommentMessage("로그인 후 댓글을 작성할 수 있습니다.");
        navigate("/login");
        return;
      }

      if (!commentContent.trim()) {
        setCommentMessage("댓글 내용을 입력해주십시오.");
        return;
      }

      await api.post(
        `/api/boards/${boardId}/comments`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setCommentContent("");
      setCommentMessage("댓글이 등록되었습니다.");
      await fetchBoardDetail();
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "댓글 등록 중 오류가 발생했습니다.";

      setCommentMessage(errorMessage);
    }
  };

  const handleDeleteBoard = async () => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        navigate("/login");
        return;
      }

      const confirmed = window.confirm("정말 이 게시글을 삭제하시겠습니까?");
      if (!confirmed) return;

      await api.delete(`/api/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      navigate("/boards");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "게시글 삭제 중 오류가 발생했습니다.";

      setMessage(errorMessage);
    }
  };

  const startCommentEdit = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
    setCommentMessage("");
  };

  const cancelCommentEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent("");
  };

  const handleCommentUpdate = async (commentId) => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        navigate("/login");
        return;
      }

      if (!editingCommentContent.trim()) {
        setCommentMessage("댓글 내용을 입력해주십시오.");
        return;
      }

      await api.put(
        `/api/comments/${commentId}`,
        { content: editingCommentContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setEditingCommentId(null);
      setEditingCommentContent("");
      setCommentMessage("댓글이 수정되었습니다.");
      await fetchBoardDetail();
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "댓글 수정 중 오류가 발생했습니다.";

      setCommentMessage(errorMessage);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        navigate("/login");
        return;
      }

      const confirmed = window.confirm("정말 이 댓글을 삭제하시겠습니까?");
      if (!confirmed) return;

      await api.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCommentMessage("댓글이 삭제되었습니다.");
      await fetchBoardDetail();
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "댓글 삭제 중 오류가 발생했습니다.";

      setCommentMessage(errorMessage);
    }
  };

  if (!board) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <button
            className="detail-back-button"
            onClick={() => navigate("/boards")}
          >
            ← 목록으로
          </button>

          {message ? (
            <p className="detail-message">{message}</p>
          ) : (
            <p>불러오는 중...</p>
          )}
        </div>
      </div>
    );
  }

  const isBoardOwner = myInfo && myInfo.id === board.userId;

  return (
    <div className="detail-page">
      <div className="detail-container">
        <button
          className="detail-back-button"
          onClick={() => navigate("/boards")}
        >
          ← 목록으로
        </button>

        <article className="detail-card">
          <div className="detail-top">
            <span className="detail-category">{board.category}</span>
            <span className="detail-date">
              {String(board.createdAt).replace("T", " ").slice(0, 16)}
            </span>
          </div>

          <h1 className="detail-title">{board.title}</h1>

          <div className="detail-meta">
            <span>작성자 {board.nickname}</span>
            <span>조회수 {board.viewCount}</span>
          </div>

          {isBoardOwner && (
            <div className="detail-action-row">
              <button
                className="detail-edit-button"
                onClick={() => navigate(`/boards/${boardId}/edit`)}
              >
                수정
              </button>
              <button
                className="detail-delete-button"
                onClick={handleDeleteBoard}
              >
                삭제
              </button>
            </div>
          )}

          <div className="detail-content">{board.content}</div>
        </article>

        <section className="comment-section">
          <h2 className="comment-title">댓글</h2>

          <div className="comment-form">
            <textarea
              className="comment-textarea"
              placeholder="댓글을 입력해주십시오."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button
              className="comment-submit-button"
              onClick={handleCommentSubmit}
            >
              댓글 등록
            </button>
          </div>

          {commentMessage && (
            <p className="comment-message">{commentMessage}</p>
          )}

          {comments.length === 0 ? (
            <div className="comment-empty">아직 댓글이 없습니다.</div>
          ) : (
            <div className="comment-list">
              {comments.map((comment) => {
                const isCommentOwner = myInfo && myInfo.id === comment.userId;
                const isEditing = editingCommentId === comment.id;

                return (
                  <div className="comment-card" key={comment.id}>
                    <div className="comment-header">
                      <span className="comment-writer">{comment.nickname}</span>
                      <span className="comment-date">
                        {String(comment.createdAt)
                          .replace("T", " ")
                          .slice(0, 16)}
                      </span>
                    </div>

                    {isEditing ? (
                      <>
                        <textarea
                          className="comment-edit-textarea"
                          value={editingCommentContent}
                          onChange={(e) =>
                            setEditingCommentContent(e.target.value)
                          }
                        />

                        <div className="comment-action-row">
                          <button
                            className="comment-save-button"
                            onClick={() => handleCommentUpdate(comment.id)}
                          >
                            저장
                          </button>
                          <button
                            className="comment-cancel-button"
                            onClick={cancelCommentEdit}
                          >
                            취소
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="comment-content">{comment.content}</p>

                        {isCommentOwner && (
                          <div className="comment-action-row">
                            <button
                              className="comment-edit-button"
                              onClick={() => startCommentEdit(comment)}
                            >
                              수정
                            </button>
                            <button
                              className="comment-delete-button"
                              onClick={() => handleCommentDelete(comment.id)}
                            >
                              삭제
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default BoardDetailPage;