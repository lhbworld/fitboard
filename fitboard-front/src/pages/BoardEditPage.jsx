import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "./BoardEditPage.css";

function BoardEditPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("헬스");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await api.get(`/api/boards/${boardId}`);
        const board = response.data;

        setTitle(board.title || "");
        setCategory(board.category || "헬스");
        setContent(board.content || "");
      } catch (error) {
        console.error(error);
        setMessage("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [boardId]);

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      await api.put(
        `/api/boards/${boardId}`,
        {
          title,
          category,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      navigate(`/boards/${boardId}`);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "게시글 수정 중 오류가 발생했습니다.";

      setMessage(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="edit-page">
        <div className="edit-container">
          <p>불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-page">
      <div className="edit-container">
        <button
          className="edit-back-button"
          onClick={() => navigate(`/boards/${boardId}`)}
        >
          ← 상세로
        </button>

        <div className="edit-card">
          <h1 className="edit-title">게시글 수정</h1>
          <p className="edit-subtitle">게시글 내용을 수정해주십시오.</p>

          <div className="edit-form-group">
            <label className="edit-label">카테고리</label>
            <select
              className="edit-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="헬스">헬스</option>
              <option value="식단">식단</option>
              <option value="유산소">유산소</option>
              <option value="루틴">루틴</option>
              <option value="질문">질문</option>
            </select>
          </div>

          <div className="edit-form-group">
            <label className="edit-label">제목</label>
            <input
              className="edit-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="edit-form-group">
            <label className="edit-label">내용</label>
            <textarea
              className="edit-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button className="edit-submit-button" onClick={handleSubmit}>
            수정 완료
          </button>

          {message && <p className="edit-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default BoardEditPage;