import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Swal from "sweetalert2";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!loginId.trim() || !password.trim() || !email.trim() || !nickname.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "입력 확인",
        text: "모든 항목을 입력해주십시오.",
        confirmButtonColor: "#35c5f0",
      });
      return;
    }

    try {
      const response = await api.post("/api/users/signup", {
        loginId,
        password,
        email,
        nickname,
      });

      await Swal.fire({
        icon: "success",
        title: "회원가입 완료",
        text: response.data?.message || "회원가입이 완료되었습니다. 로그인해주십시오.",
        confirmButtonColor: "#35c5f0",
      });

      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "회원가입 중 오류가 발생했습니다.";

      await Swal.fire({
        icon: "error",
        title: "회원가입 실패",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-logo">fitboard</h1>
        <p className="signup-subtitle">회원가입</p>

        <form onSubmit={handleSignup} className="signup-form">
          <input
            type="text"
            placeholder="아이디"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            className="signup-input"
            autoComplete="off"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
            autoComplete="new-password"
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
            autoComplete="email"
          />
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="signup-input"
            autoComplete="off"
          />

          <button type="submit" className="signup-button">
            회원가입
          </button>
        </form>

        <button
          type="button"
          className="signup-secondary-button"
          onClick={() => navigate("/login")}
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
}

export default SignupPage;