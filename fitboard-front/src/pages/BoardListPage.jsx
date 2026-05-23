import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "./BoardListPage.css";
import Swal from "sweetalert2";

function BoardListPage() {
  const navigate = useNavigate();
  const API_BASE_URL = api.defaults.baseURL || "http://localhost:8081";

  const [boards, setBoards] = useState([]);
  const [myInfo, setMyInfo] = useState(null);
  const [message, setMessage] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [inputKeyword, setInputKeyword] = useState("");
  const [sortType, setSortType] = useState("latest");

  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [isFirst, setIsFirst] = useState(true);
  const [isLast, setIsLast] = useState(true);

  const categories = [
    { name: "전체", desc: "모든 이야기" },
    { name: "헬스", desc: "근력 운동" },
    { name: "식단", desc: "식사 기록" },
    { name: "유산소", desc: "러닝·걷기" },
    { name: "루틴", desc: "운동 계획" },
    { name: "질문", desc: "궁금한 점" },
  ];

  useEffect(() => {
    let isMounted = true;

    const loadMyInfo = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          return;
        }

        const response = await api.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (isMounted) {
          setMyInfo(response.data);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setMyInfo(null);
        }
      }
    };

    loadMyInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadBoards = async () => {
      try {
        let sortValue = "createdAt,desc";

        if (sortType === "oldest") {
          sortValue = "createdAt,asc";
        }

        if (sortType === "viewCount") {
          sortValue = "viewCount,desc";
        }

        const params = {
          page,
          size,
          sort: sortValue,
        };

        if (selectedCategory !== "전체") {
          params.category = selectedCategory;
        }

        if (searchKeyword.trim()) {
          params.keyword = searchKeyword.trim();
        }

        const response = await api.get("/api/boards", { params });

        if (isMounted) {
          setBoards(response.data.content || []);
          setTotalPages(response.data.totalPages || 0);
          setIsFirst(response.data.first);
          setIsLast(response.data.last);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setMessage("게시글 목록을 불러오는 중 오류가 발생했습니다.");
        }
      }
    };

    loadBoards();

    return () => {
      isMounted = false;
    };
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

  const handleClearSearch = () => {
    setInputKeyword("");
    setSearchKeyword("");
    setPage(0);
  };

  const getPreviewText = (content) => {
    const text = String(content || "").trim();

    if (text.length <= 80) {
      return text;
    }

    return `${text.slice(0, 80)}...`;
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index);

  const requireLogin = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      return true;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "로그인 필요",
      text: "로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?",
      showCancelButton: true,
      confirmButtonColor: "#35c5f0",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "로그인하러 가기",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      navigate("/login");
    }

    return false;
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
              onClick={async () => {
                const canProceed = await requireLogin();

                if (!canProceed) {
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
          <div className="board-search-panel">
            <div className="board-search-heading">
              <span className="board-search-kicker">fitboard 검색</span>
              <h3>찾고 싶은 운동 이야기를 검색해보세요</h3>
            </div>

            <div className="board-search-group">
              <input
                className="board-search-input"
                type="text"
                placeholder="제목 또는 내용으로 검색"
                value={inputKeyword}
                onChange={(e) => setInputKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              {searchKeyword && (
                <button
                  type="button"
                  className="board-search-clear-button"
                  onClick={handleClearSearch}
                >
                  초기화
                </button>
              )}
              <button className="board-search-button" onClick={handleSearch}>
                검색
              </button>
            </div>

            {searchKeyword && (
              <p className="board-search-state">
                <strong>{searchKeyword}</strong> 검색 결과를 보고 있습니다.
              </p>
            )}
          </div>

          <div className="board-category-panel">
            <div className="board-filter-top">
              <div>
                <span className="board-panel-kicker">카테고리</span>
                <h3 className="board-panel-title">관심 주제를 골라보세요</h3>
              </div>
            </div>

            <div className="board-category-group">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className={
                    selectedCategory === category.name
                      ? "board-category-button active"
                      : "board-category-button"
                  }
                  onClick={() => handleCategoryChange(category.name)}
                >
                  <span>{category.name}</span>
                  <small>{category.desc}</small>
                </button>
              ))}
            </div>
          </div>
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
          <div className="board-list-header">
            <div>
              <span className="board-panel-kicker">게시글</span>
              <h3 className="board-panel-title">관심 있는 글을 눌러 자세히 보기</h3>
            </div>
          </div>

          {boards.length === 0 ? (
            <div className="board-empty">조건에 맞는 게시글이 없습니다.</div>
          ) : (
            boards.map((board) => (
              <article
                className="board-card"
                key={board.id}
                onClick={() => navigate(`/boards/${board.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/boards/${board.id}`);
                  }
                }}
              >
                <div className="board-card-top">
                  <span className="board-category">{board.category}</span>
                  <span className="board-date">
                    {String(board.createdAt).replace("T", " ").slice(0, 16)}
                  </span>
                </div>

                {String(board.imageUrl || "").trim() && (
                  <div className="board-card-thumbnail">
                    <img
                      src={`${API_BASE_URL}${String(board.imageUrl).trim()}`}
                      alt="게시글 첨부 이미지 썸네일"
                    />
                  </div>
                )}

                <h3 className="board-title">{board.title}</h3>
                <p className="board-content">{getPreviewText(board.content)}</p>

                <div className="board-meta">
                  <div>
                    <span>작성자 {board.nickname}</span>
                    <span>조회수 {board.viewCount}</span>
                  </div>
                </div>
              </article>
            ))
          )}
        </section>

        {totalPages > 0 && (
          <section className="board-pagination">
            {!isFirst && (
              <button
                className="board-page-button"
                onClick={() => setPage((prev) => prev - 1)}
              >
                이전
              </button>
            )}

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

      <Footer />
    </div>
  );
}

export default BoardListPage;
