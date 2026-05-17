import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

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
      navigate("/boards");
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
      <div className="login-card">
        <h1 className="login-logo">fitboard</h1>
        <p className="login-subtitle">로그인</p>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="login-bottom-actions">
          <button
            type="button"
            className="login-secondary-button"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;