import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();

  const [myInfo, setMyInfo] = useState(null);
  const [boards, setBoards] = useState([]);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("boards");

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

        const commentResponse = await api.get("/api/comments/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setComments(commentResponse.data);
      } catch (error) {
        console.error(error);
        setMessage("마이페이지 정보를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [navigate]);

  const myBoards = useMemo(() => {
    if (!myInfo) return [];
    return boards.filter((board) => board.userId === myInfo.id);
  }, [boards, myInfo]);

  return (
    <div className="mypage">
      <Header myInfo={myInfo} />

      <main className="mypage-main">
        <section className="mypage-profile-card">
          <h2 className="mypage-title">마이페이지</h2>

          {myInfo ? (
            <div className="mypage-profile-info">
              <p><strong>아이디</strong> {myInfo.loginId}</p>
              <p><strong>이메일</strong> {myInfo.email}</p>
              <p><strong>닉네임</strong> {myInfo.nickname}</p>
            </div>
          ) : (
            <p>내 정보를 불러오는 중입니다.</p>
          )}
        </section>

        <section className="mypage-board-section">
          <div className="mypage-board-top">
            <h3 className="mypage-board-title">내 활동</h3>
          </div>

          <div className="mypage-tab-group">
            <button
              className={activeTab === "boards" ? "mypage-tab active" : "mypage-tab"}
              onClick={() => setActiveTab("boards")}
            >
              내가 쓴 글 ({myBoards.length})
            </button>
            <button
              className={activeTab === "comments" ? "mypage-tab active" : "mypage-tab"}
              onClick={() => setActiveTab("comments")}
            >
              내가 쓴 댓글 ({comments.length})
            </button>
          </div>

          {message && <p className="mypage-message">{message}</p>}

          {activeTab === "boards" && (
            <>
              {myBoards.length === 0 ? (
                <div className="mypage-empty">아직 작성한 게시글이 없습니다.</div>
              ) : (
                <div className="mypage-board-list">
                  {myBoards.map((board) => (
                    <article
                      key={board.id}
                      className="mypage-board-card"
                      onClick={() => navigate(`/boards/${board.id}`)}
                    >
                      <div className="mypage-board-card-top">
                        <span className="mypage-category">{board.category}</span>
                        <span className="mypage-date">
                          {String(board.createdAt).replace("T", " ").slice(0, 16)}
                        </span>
                      </div>

                      <h4 className="mypage-board-card-title">{board.title}</h4>
                      <p className="mypage-board-card-content">{board.content}</p>

                      <div className="mypage-board-meta">
                        <span>조회수 {board.viewCount}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "comments" && (
            <>
              {comments.length === 0 ? (
                <div className="mypage-empty">아직 작성한 댓글이 없습니다.</div>
              ) : (
                <div className="mypage-comment-list">
                  {comments.map((comment) => (
                    <article
                      key={comment.id}
                      className="mypage-comment-card"
                      onClick={() => navigate(`/boards/${comment.boardId}`)}
                    >
                      <div className="mypage-comment-top">
                        <span className="mypage-comment-board">
                          {comment.boardTitle}
                        </span>
                        <span className="mypage-date">
                          {String(comment.createdAt).replace("T", " ").slice(0, 16)}
                        </span>
                      </div>

                      <p className="mypage-comment-content">{comment.content}</p>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

export default MyPage;