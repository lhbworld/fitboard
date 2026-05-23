import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleKakaoLogin = () => {
    window.location.href = "http://localhost:8081/api/auth/kakao/login";
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginId.trim() || !password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "입력 확인",
        text: "아이디와 비밀번호를 모두 입력해주십시오.",
        confirmButtonColor: "#35c5f0",
      });
      return;
    }

    try {
      const response = await api.post("/api/users/login", {
        loginId,
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";

      await Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="login-page">
      <section className="login-shell">
        <div className="login-intro">
          <button
            type="button"
            className="login-brand"
            onClick={() => navigate("/")}
          >
            fitboard
          </button>
          <p className="login-kicker">운동 정보 공유 커뮤니티</p>
          <h1 className="login-heading">
            운동 기록과 식단 노하우를 함께 나누세요.
          </h1>
          <p className="login-description">
            루틴, 식단, 헬스 정보를 게시글과 댓글로 공유하고 나만의 활동을
            관리할 수 있습니다.
          </p>

          <div className="login-topic-list" aria-label="fitboard 주요 주제">
            <span>운동 루틴</span>
            <span>식단 관리</span>
            <span>헬스 정보</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <p className="login-subtitle">로그인</p>
            <h2 className="login-title">다시 만나서 반가워요</h2>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <label className="login-field">
              <span>아이디</span>
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="login-input"
                autoComplete="username"
              />
            </label>
            <label className="login-field">
              <span>비밀번호</span>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="login-button">
              로그인
            </button>
            <button
              type="button"
              className="kakao-login-button"
              onClick={handleKakaoLogin}
            >
              카카오로 로그인
            </button>
          </form>

          <div className="login-bottom-actions">
            <span>아직 계정이 없으신가요?</span>
            <button
              type="button"
              className="login-secondary-button"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
