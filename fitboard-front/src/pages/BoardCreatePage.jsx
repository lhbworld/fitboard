import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./BoardCreatePage.css";

function BoardCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("헬스");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setMessage("로그인 후 글을 작성할 수 있습니다.");
        navigate("/login");
        return;
      }

      const response = await api.post(
        "/api/boards",
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

      setMessage("게시글이 등록되었습니다.");
      navigate(`/boards/${response.data.id}`);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "게시글 등록 중 오류가 발생했습니다.";

      setMessage(errorMessage);
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <button
          className="create-back-button"
          onClick={() => navigate("/boards")}
        >
          ← 목록으로
        </button>

        <div className="create-card">
          <h1 className="create-title">게시글 작성</h1>
          <p className="create-subtitle">
            운동 루틴, 식단, 질문, 기록을 자유롭게 작성해보십시오.
          </p>

          <div className="create-form-group">
            <label className="create-label">카테고리</label>
            <select
              className="create-select"
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

          <div className="create-form-group">
            <label className="create-label">제목</label>
            <input
              className="create-input"
              type="text"
              placeholder="제목을 입력해주십시오."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="create-form-group">
            <label className="create-label">내용</label>
            <textarea
              className="create-textarea"
              placeholder="내용을 입력해주십시오."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <button className="create-submit-button" onClick={handleSubmit}>
            등록하기
          </button>

          {message && <p className="create-message">{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default BoardCreatePage;