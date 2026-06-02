import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./BoardEditPage.css";

function BoardEditPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = api.defaults.baseURL || "http://localhost:8081";
  const previewUrlRef = useRef("");

  const [myInfo, setMyInfo] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("헬스");
  const [content, setContent] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleLength = title.trim().length;
  const contentLength = content.trim().length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          navigate("/login");
          return;
        }

        const meResponse = await api.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMyInfo(meResponse.data);

        const boardResponse = await api.get(`/api/boards/${boardId}`);
        const board = boardResponse.data;

        setTitle(board.title || "");
        setCategory(board.category || "헬스");
        setContent(board.content || "");
        setExistingImageUrl(board.imageUrl || "");
      } catch (error) {
        console.error(error);
        setMessage("게시글 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [boardId, navigate]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const clearSelectedImage = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (!file) {
      clearSelectedImage();
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      clearSelectedImage();
      setMessage("jpg, jpeg, png, webp 이미지 파일만 첨부할 수 있습니다.");
      e.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;

    setMessage("");
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveImage = () => {
    clearSelectedImage();
    setExistingImageUrl("");
  };

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        navigate("/login");
        return;
      }

      let imageUrl = existingImageUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const uploadResponse = await api.post("/api/files/images", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = uploadResponse.data?.imageUrl || "";
      }

      await api.put(
        `/api/boards/${boardId}`,
        {
          title,
          category,
          content,
          imageUrl,
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-page">
        <Header myInfo={myInfo} />
        <div className="edit-container">
          <p>불러오는 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="edit-page">
      <Header myInfo={myInfo} />

      <main className="edit-container">
        <section className="edit-hero">
          <div>
            <span className="edit-kicker">EDIT</span>
            <h1 className="edit-title">게시글 수정</h1>
            <p className="edit-subtitle">작성한 내용을 다듬고 이미지를 관리하세요.</p>
          </div>

          <button
            className="edit-back-button"
            onClick={() => navigate(`/boards/${boardId}`)}
          >
            상세로
          </button>
        </section>

        <div className="edit-card">
          <div className="edit-form-main">
            <div className="edit-form-group">
              <div className="edit-label-row">
                <label className="edit-label">카테고리</label>
              </div>
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
              <div className="edit-label-row">
                <label className="edit-label">제목</label>
                <span className="edit-counter">{titleLength}자</span>
              </div>
              <input
                className="edit-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="edit-form-group">
              <div className="edit-label-row">
                <label className="edit-label">내용</label>
                <span className="edit-counter">{contentLength}자</span>
              </div>
              <textarea
                className="edit-textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="edit-submit-row">
              {message && <p className="edit-message">{message}</p>}

              <button
                className="edit-submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "수정 중..." : "수정 완료"}
              </button>
            </div>
          </div>

          <aside className="edit-side-panel">
            <div className="edit-upload-head">
              <span className="edit-kicker">IMAGE</span>
              <h2>이미지 관리</h2>
            </div>

            <label className="edit-upload-box">
              <input
                className="edit-file-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />

              {previewUrl || existingImageUrl ? (
                <img
                  className="edit-preview-image"
                  src={previewUrl || `${API_BASE_URL}${existingImageUrl}`}
                  alt="게시글 첨부 이미지 미리보기"
                />
              ) : (
                <div className="edit-upload-empty">
                  <strong>이미지 선택</strong>
                  <span>jpg, jpeg, png, webp</span>
                </div>
              )}
            </label>

            {(selectedFile || existingImageUrl) && (
              <div className="edit-file-meta">
                <span>{selectedFile?.name || "현재 첨부 이미지"}</span>
                <button type="button" onClick={handleRemoveImage}>
                  삭제
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BoardEditPage;
