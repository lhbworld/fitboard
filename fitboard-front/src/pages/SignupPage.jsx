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
        confirmButtonColor: "#12805d",
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
        confirmButtonColor: "#12805d",
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
      <div className="signup-shell">
        <section className="signup-intro">
          <button
            type="button"
            className="signup-brand"
            onClick={() => navigate("/")}
          >
            fitboard
          </button>
          <p className="signup-kicker">운동 정보 공유 커뮤니티</p>
          <h1 className="signup-heading">나만의 운동 기록을 함께 나눠보세요</h1>
          <p className="signup-description">
            루틴, 식단, 질문을 기록하고 같은 목표를 가진 사람들과 이어집니다.
          </p>
        </section>

        <section className="signup-card">
          <div className="signup-card-header">
            <p className="signup-subtitle">회원가입</p>
            <h2 className="signup-title">fitboard 시작하기</h2>
          </div>

          <form onSubmit={handleSignup} className="signup-form">
            <label className="signup-field">
              <span>아이디</span>
              <input
                type="text"
                placeholder="아이디 입력"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="signup-input"
                autoComplete="off"
              />
            </label>

            <label className="signup-field">
              <span>비밀번호</span>
              <input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="signup-input"
                autoComplete="new-password"
              />
            </label>

            <label className="signup-field">
              <span>이메일</span>
              <input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="signup-input"
                autoComplete="email"
              />
            </label>

            <label className="signup-field">
              <span>닉네임</span>
              <input
                type="text"
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="signup-input"
                autoComplete="off"
              />
            </label>

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
        </section>
      </div>
    </div>
  );
}

export default SignupPage;
