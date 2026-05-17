import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Header from "../components/Header";
import "./BoardListPage.css";

function BoardListPage() {
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [myInfo, setMyInfo] = useState(null);
  const [message, setMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sortType, setSortType] = useState("latest");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(true);

  const categories = ["전체", "헬스", "식단", "유산소", "루틴", "질문"];

  const getSortValue = () => {
    if (sortType === "latest") return "createdAt,desc";
    if (sortType === "oldest") return "createdAt,asc";
    if (sortType === "viewCount") return "viewCount,desc";
    return "createdAt,desc";
  };

  const fetchBoards = async () => {
    try {
      const params = {
        page,
        size,
        sort: getSortValue(),
      };

      if (selectedCategory !== "전체") {
        params.category = selectedCategory;
      }

      if (searchKeyword.trim()) {
        params.keyword = searchKeyword.trim();
      }

      const response = await api.get("/api/boards", { params });

      setBoards(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
      setIsFirst(response.data.first);
      setIsLast(response.data.last);
    } catch (error) {
      console.error(error);
      setMessage("게시글 목록을 불러오는 중 오류가 발생했습니다.");
    }
  };

  const fetchMyInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setMyInfo(null);
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
      setMyInfo(null);
    }
  };

  useEffect(() => {
    fetchMyInfo();
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [page, size, selectedCategory, searchKeyword, sortType]);

  const handleSearch = () => {
    setPage(0);
    setSearchKeyword(inputKeyword);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setPage(0);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
    setPage(0);
  };

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      setInputKeyword("");
      setSearchKeyword("");
      setPage(0);
    }
    setIsSearchOpen((prev) => !prev);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

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
  onClick={() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    navigate("/boards/new");
  }}
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
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              className="board-search-toggle-button"
              onClick={handleToggleSearch}
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
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button className="board-search-button" onClick={handleSearch}>
                검색
              </button>
            </div>
          )}
        </section>

        <section className="board-option-section">
          <div className="board-option-left">
            <label className="board-sort-label">정렬</label>
            <select
              className="board-sort-select"
              value={sortType}
              onChange={handleSortChange}
            >
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="viewCount">조회수 높은순</option>
            </select>
          </div>
        </section>

        {message && <p className="board-message">{message}</p>}

        <section className="board-list">
          {boards.length === 0 ? (
            <div className="board-empty">조건에 맞는 게시글이 없습니다.</div>
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

        {totalPages > 0 && (
          <section className="board-pagination">
            <button
              className="board-page-button"
              disabled={isFirst}
              onClick={() => setPage((prev) => prev - 1)}
            >
              이전
            </button>

            <div className="board-page-number-group">
              {pageNumbers.map((pageNumber) => (
                <button
                  key={pageNumber}
                  className={
                    page === pageNumber
                      ? "board-page-number active"
                      : "board-page-number"
                  }
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber + 1}
                </button>
              ))}
            </div>

            <button
              className="board-page-button"
              disabled={isLast}
              onClick={() => setPage((prev) => prev + 1)}
            >
              다음
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

export default BoardListPage;