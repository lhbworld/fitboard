import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import "./BoardListPage.css";

function BoardListPage() {
  const [boards, setBoards] = useState([]);
  const [myInfo, setMyInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortType, setSortType] = useState("latest");
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
          try {
            const meResponse = await api.get("/api/users/me", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setMyInfo(meResponse.data);
          } catch (error) {
            setMyInfo(null);
          }
        } else {
          setMyInfo(null);
        }

        const boardResponse = await api.get("/api/boards");
        setBoards(boardResponse.data);
      } catch (error) {
        console.error(error);
        setMessage("게시글 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, []);

  const categories = ["전체", "헬스", "식단", "유산소", "루틴", "질문"];

  const filteredBoards = useMemo(() => {
  let result = boards.filter((board) => {
    const matchesCategory =
      selectedCategory === "전체" || board.category === selectedCategory;

    const keyword = searchKeyword.trim().toLowerCase();
    const matchesKeyword =
      keyword === "" ||
      board.title?.toLowerCase().includes(keyword) ||
      board.content?.toLowerCase().includes(keyword);

    const matchesMine =
      !showOnlyMine || (myInfo && board.userId === myInfo.id);

    return matchesCategory && matchesKeyword && matchesMine;
  });

  result = [...result].sort((a, b) => {
    if (sortType === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortType === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortType === "viewCount") {
      return (b.viewCount || 0) - (a.viewCount || 0);
    }

    return 0;
  });

  return result;
}, [boards, selectedCategory, searchKeyword, showOnlyMine, sortType, myInfo]);

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

        <section className="board-filter-section">
  <div className="board-filter-top">
    <div className="board-category-group">
      {categories.map((category) => (
        <button
          key={category}
          className={
            selectedCategory === category
              ? "board-category-button active"
              : "board-category-button"
          }
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>

    <button
      className="board-search-toggle-button"
      onClick={() => {
  if (isSearchOpen) {
    setSearchKeyword("");
  }
  setIsSearchOpen((prev) => !prev);
}}
    >
      {isSearchOpen ? "검색 닫기" : "검색"}
    </button>
  </div>

  {isSearchOpen && (
    <div className="board-search-group">
      <input
        className="board-search-input"
        type="text"
        placeholder="제목 또는 내용으로 검색해주십시오."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
    </div>
  )}
</section>

<section className="board-option-section">
  <div className="board-option-left">
    <label className="board-sort-label">정렬</label>
    <select
      className="board-sort-select"
      value={sortType}
      onChange={(e) => setSortType(e.target.value)}
    >
      <option value="latest">최신순</option>
      <option value="oldest">오래된순</option>
      <option value="viewCount">조회수 높은순</option>
    </select>
  </div>

  <div className="board-option-right">
    <label className="board-mine-check">
      <input
        type="checkbox"
        checked={showOnlyMine}
        onChange={(e) => setShowOnlyMine(e.target.checked)}
      />
      내가 쓴 글만 보기
    </label>
  </div>
</section>

        {message && <p className="board-message">{message}</p>}

        <section className="board-list">
          {filteredBoards.length === 0 ? (
            <div className="board-empty">
              조건에 맞는 게시글이 없습니다.
            </div>
          ) : (
            filteredBoards.map((board) => (
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