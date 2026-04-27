import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./LoginPage.css";

function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await api.post("/api/users/login", {
        loginId,
        password,
      });

      const accessToken = response.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      setMessage("로그인 성공, 토큰 저장 완료");

      navigate("/boards");
    } catch (error) {
      console.error(error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "로그인 중 오류가 발생했습니다.";

      setMessage(errorMessage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-brand">fitboard</h1>
        <p className="login-subtitle">로그인</p>

        <input
          className="login-input"
          type="text"
          placeholder="아이디"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>

        {message && <p className="login-message">{message}</p>}
      </div>
    </div>
  );
}

export default LoginPage;