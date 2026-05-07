import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./BoardListPage.css";
import Header from "../components/Header";

function BoardListPage() {
  const [boards, setBoards] = useState([]);
  const [myInfo, setMyInfo] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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

        const boardResponse = await api.get("/api/boards");
        setBoards(boardResponse.data);
      } catch (error) {
        console.error(error);
        setMessage("게시글 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="board-page">
      <Header myInfo={myInfo} />

      <main className="board-main">
        <section className="board-top-section">
          <div className="board-top-row">
            <div>
              <h2 className="board-section-title">게시글 목록</h2>
              <p className="board-section-desc">
                운동 루틴, 식단, 질문, 기록을 자유롭게 공유해보십시오.
              </p>
            </div>

            <button
              className="board-write-button"
              onClick={() => navigate("/boards/new")}
            >
              글쓰기
            </button>
          </div>
        </section>

        {message && <p className="board-message">{message}</p>}

        <section className="board-list">
          {boards.length === 0 ? (
            <div className="board-empty">아직 게시글이 없습니다.</div>
          ) : (
            boards.map((board) => (
              <article
                className="board-card"
                key={board.id}
                onClick={() => navigate(`/boards/${board.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="board-card-top">
                  <span className="board-category">{board.category}</span>
                  <span className="board-date">
                    {String(board.createdAt).replace("T", " ").slice(0, 16)}
                  </span>
                </div>

                <h3 className="board-title">{board.title}</h3>
                <p className="board-content">{board.content}</p>

                <div className="board-meta">
                  <span>작성자 {board.nickname}</span>
                  <span>조회수 {board.viewCount}</span>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default BoardListPage;