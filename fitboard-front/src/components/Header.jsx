import { useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ myInfo }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-logo-wrap" onClick={() => navigate("/boards")}>
          <h1 className="app-logo">fitboard</h1>
          <p className="app-subtitle">운동 정보 공유 커뮤니티</p>
        </div>

        <div className="app-header-right">
          {myInfo ? (
            <>
              <span className="app-user">{myInfo.nickname}님</span>
              <button className="app-logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button
              className="app-login-button"
              onClick={() => navigate("/login")}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;