import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import "./BoardCreatePage.css";

function BoardCreatePage() {
  const navigate = useNavigate();
  const previewUrlRef = useRef("");

  const [myInfo, setMyInfo] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("헬스");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentLength = content.trim().length;
  const titleLength = title.trim().length;

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          navigate("/login");
          return;
        }

        const response = await api.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setMyInfo(response.data);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    fetchMyInfo();
  }, [navigate]);

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

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setMessage("로그인 후 글을 작성할 수 있습니다.");
        navigate("/login");
        return;
      }

      let imageUrl = "";

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

      const response = await api.post(
        "/api/boards",
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

      navigate(`/boards/${response.data.id}`);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "게시글 등록 중 오류가 발생했습니다.";

      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-page">
      <Header myInfo={myInfo} />

      <main className="create-container">
        <section className="create-hero">
          <div>
            <span className="create-kicker">WRITE</span>
            <h1 className="create-title">게시글 작성</h1>
            <p className="create-subtitle">
              운동 루틴, 식단, 질문, 기록을 자유롭게 공유해보세요.
            </p>
          </div>

          <button
            className="create-back-button"
            onClick={() => navigate("/boards")}
          >
            목록으로
          </button>
        </section>

        <div className="create-card">
          <div className="create-form-main">
            <div className="create-form-group">
              <div className="create-label-row">
                <label className="create-label">카테고리</label>
              </div>
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
              <div className="create-label-row">
                <label className="create-label">제목</label>
                <span className="create-counter">{titleLength}자</span>
              </div>
              <input
                className="create-input"
                type="text"
                placeholder="제목을 입력해주세요."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="create-form-group">
              <div className="create-label-row">
                <label className="create-label">내용</label>
                <span className="create-counter">{contentLength}자</span>
              </div>
              <textarea
                className="create-textarea"
                placeholder="운동 루틴, 식단 기록, 질문을 자유롭게 작성해주세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="create-submit-row">
              {message && <p className="create-message">{message}</p>}

              <button
                className="create-submit-button"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </div>

          <aside className="create-side-panel">
            <div className="create-upload-head">
              <span className="create-kicker">IMAGE</span>
              <h2>이미지 첨부</h2>
            </div>

            <label className="create-upload-box">
              <input
                className="create-file-input"
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
              />

              {previewUrl ? (
                <img
                  className="create-preview-image"
                  src={previewUrl}
                  alt="선택한 게시글 첨부 이미지 미리보기"
                />
              ) : (
                <div className="create-upload-empty">
                  <strong>이미지 선택</strong>
                  <span>jpg, jpeg, png, webp</span>
                </div>
              )}
            </label>

            {selectedFile && (
              <div className="create-file-meta">
                <span>{selectedFile.name}</span>
                <button type="button" onClick={clearSelectedImage}>
                  삭제
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

export default BoardCreatePage;
