import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./BoardDetailPage.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Swal from "sweetalert2";

function BoardDetailPage() {
  const requireLogin = async () => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    return true;
  }

  const result = await Swal.fire({
    icon: "warning",
    title: "로그인 필요",
    text: "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?",
    showCancelButton: true,
    confirmButtonColor: "#12805d",
    cancelButtonColor: "#9ca3af",
    confirmButtonText: "로그인하러 가기",
    cancelButtonText: "취소",
  });

  if (result.isConfirmed) {
    navigate("/login");
  }

  return false;
};
  const { boardId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = api.defaults.baseURL || "http://localhost:8081";

  const [board, setBoard] = useState(null);
  const [comments, setComments] = useState([]);
  const [myInfo, setMyInfo] = useState(null);

  const [message, setMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");

  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");

  const getAccessToken = () => localStorage.getItem("accessToken");

  const fetchMyInfo = useCallback(async () => {
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
  }, []);

  const fetchBoardDetail = useCallback(async () => {
    try {
      const boardResponse = await api.get(`/api/boards/${boardId}`);
      setBoard(boardResponse.data);

      const commentResponse = await api.get(`/api/boards/${boardId}/comments`);
      setComments(commentResponse.data);
    } catch (error) {
      console.error(error);
      setMessage("게시글 상세 정보를 불러오는 중 오류가 발생했습니다.");
    }
  }, [boardId]);

  const fetchAll = useCallback(async () => {
    await fetchMyInfo();
    await fetchBoardDetail();
  }, [fetchBoardDetail, fetchMyInfo]);

  useEffect(() => {
    const loadData = async () => {
      await fetchAll();
    };

    loadData();
  }, [fetchAll]);

  const handleCommentSubmit = async () => {
  const canProceed = await requireLogin();

  if (!canProceed) {
    return;
  }

  if (!commentContent.trim()) {
    await Swal.fire({
      icon: "warning",
      title: "입력 확인",
      text: "댓글 내용을 입력해주십시오.",
      confirmButtonColor: "#12805d",
    });
    return;
  }

  try {
    const accessToken = getAccessToken();

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

    await Swal.fire({
      icon: "success",
      title: "등록 완료",
      text: "댓글이 등록되었습니다.",
      confirmButtonColor: "#12805d",
      timer: 1000,
      showConfirmButton: false,
    });

    await fetchBoardDetail();
  } catch (error) {
    console.error(error);

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "댓글 등록 중 오류가 발생했습니다.";

    await Swal.fire({
      icon: "error",
      title: "등록 실패",
      text: errorMessage,
      confirmButtonColor: "#ef4444",
    });
  }
};

  const handleDeleteBoard = async () => {
    try {
      const accessToken = getAccessToken();

      if (!accessToken) {
        navigate("/login");
        return;
      }

      const result = await Swal.fire({
        icon: "warning",
        title: "게시글 삭제",
        text: "삭제한 게시글은 복구할 수 없습니다. 정말 삭제하시겠습니까?",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#9ca3af",
        confirmButtonText: "삭제하기",
        cancelButtonText: "취소",
      });

      if (!result.isConfirmed) return;

      await api.delete(`/api/boards/${boardId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      await Swal.fire({
        icon: "success",
        title: "삭제 완료",
        text: "게시글이 삭제되었습니다.",
        confirmButtonColor: "#12805d",
        timer: 1000,
        showConfirmButton: false,
      });

      navigate("/boards");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "게시글 삭제 중 오류가 발생했습니다.";

      await Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
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

      const result = await Swal.fire({
        icon: "warning",
        title: "댓글 삭제",
        text: "삭제한 댓글은 복구할 수 없습니다. 정말 삭제하시겠습니까?",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#9ca3af",
        confirmButtonText: "삭제하기",
        cancelButtonText: "취소",
      });

      if (!result.isConfirmed) return;

      await api.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCommentMessage("");
      await Swal.fire({
        icon: "success",
        title: "삭제 완료",
        text: "댓글이 삭제되었습니다.",
        confirmButtonColor: "#12805d",
        timer: 1000,
        showConfirmButton: false,
      });

      await fetchBoardDetail();
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "댓글 삭제 중 오류가 발생했습니다.";

      await Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (!board) {
    return (
       <div className="detail-page">
         <Header myInfo={myInfo} />
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
        <Footer />
      </div>
    );
  }

  const isBoardOwner = myInfo && myInfo.id === board.userId;
  const boardImageUrl = String(board.imageUrl || "").trim();
  const formattedDate = String(board.createdAt).replace("T", " ").slice(0, 16);

  return (
    <div className="detail-page">
      <Header myInfo={myInfo} />
      <main className="detail-container">
        <section className="detail-hero">
          <div>
            <span className="detail-kicker">BOARD</span>
            <h1 className="detail-title">{board.title}</h1>
            <div className="detail-meta">
              <span>작성자 {board.nickname}</span>
              <span>조회수 {board.viewCount}</span>
              <span>{formattedDate}</span>
            </div>
          </div>

          <button
            className="detail-back-button"
            onClick={() => navigate("/boards")}
          >
            목록으로
          </button>
        </section>

        <article className="detail-card">
          <div className="detail-top">
            <span className="detail-category">{board.category}</span>
            <span className="detail-date">{formattedDate}</span>
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

          {boardImageUrl && (
            <div className="detail-image-wrap">
              <img
                className="detail-image"
                src={`${API_BASE_URL}${boardImageUrl}`}
                alt="게시글 첨부 이미지"
              />
            </div>
          )}

          <div className="detail-content">{board.content}</div>
        </article>

        <section className="comment-section">
          <div className="comment-section-head">
            <div>
              <span className="detail-kicker">COMMENTS</span>
              <h2 className="comment-title">댓글 {comments.length}</h2>
            </div>
          </div>

          <div className="comment-form">
            <textarea
              className="comment-textarea"
              placeholder="댓글을 입력해주세요."
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
      </main>
      <Footer />
    </div>
  );
}

export default BoardDetailPage;
