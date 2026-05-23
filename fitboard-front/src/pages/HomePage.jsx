import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { deals, magazines } from "../data/homeContent";
import "./HomePage.css";

const nutritionBanners = [
  {
    eyebrow: "fitboard에서 음식을 검색하고",
    title: "칼로리와 영양성분을 확인해 보세요",
    button: "식단 정보 보러가기",
    image:
      "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?auto=format&fit=crop&w=1800&q=85",
  },
  {
    eyebrow: "오늘 식단을 더 쉽게 기록하고",
    title: "단백질과 탄수화물 균형을 맞춰보세요",
    button: "식단 루틴 보기",
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1800&q=85",
  },
  {
    eyebrow: "운동 전후로 필요한 영양을",
    title: "내 루틴에 맞게 간편하게 챙겨보세요",
    button: "운동 정보 보기",
    image:
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&w=1800&q=85",
  },
  {
    eyebrow: "건강한 한 끼를 고르고",
    title: "나에게 맞는 식단 습관을 만들어보세요",
    button: "커뮤니티 둘러보기",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1800&q=85",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [myInfo, setMyInfo] = useState(null);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  const categories = [
    { title: "헬스", desc: "오늘의 근력 운동 기록과 팁" },
    { title: "식단", desc: "식사 관리와 건강한 메뉴 공유" },
    { title: "유산소", desc: "러닝, 걷기, 사이클 루틴" },
    { title: "루틴", desc: "나에게 맞는 운동 계획" },
    { title: "질문", desc: "궁금한 점을 커뮤니티에 묻기" },
  ];

  const activeBanner = nutritionBanners[activeBannerIndex];

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
    const timerId = window.setInterval(() => {
      setActiveBannerIndex((current) => (current + 1) % nutritionBanners.length);
    }, 4500);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  const handlePrevBanner = () => {
    setActiveBannerIndex((current) =>
      current === 0 ? nutritionBanners.length - 1 : current - 1
    );
  };

  const handleNextBanner = () => {
    setActiveBannerIndex((current) => (current + 1) % nutritionBanners.length);
  };

  return (
    <div className="home-page">
      <Header myInfo={myInfo} />

      <main className="home-main">
        <section className="home-nutrition-banner">
          <img
            className="home-nutrition-image"
            src={activeBanner.image}
            alt={activeBanner.title}
          />

          <div className="home-nutrition-copy" key={activeBanner.title}>
            <span>{activeBanner.eyebrow}</span>
            <h2>{activeBanner.title}</h2>
            <button
              className="home-nutrition-button"
              onClick={() => navigate("/boards")}
            >
              {activeBanner.button}
            </button>
          </div>

          <div className="home-banner-controls" aria-label="배너 슬라이드">
            <button
              type="button"
              className="home-banner-arrow"
              onClick={handlePrevBanner}
              aria-label="이전 배너"
            >
              ‹
            </button>
            <span>
              {activeBannerIndex + 1}/{nutritionBanners.length}
            </span>
            <button
              type="button"
              className="home-banner-arrow"
              onClick={handleNextBanner}
              aria-label="다음 배너"
            >
              ›
            </button>
          </div>
        </section>

        <section className="home-hero">
          <div className="home-hero-content">
            <span className="home-kicker">fitboard community</span>
            <h2>운동 루틴과 식단을 한곳에서 가볍게 관리하세요</h2>
            <p>
              매일의 운동 기록, 식단 고민, 루틴 질문을 커뮤니티에서 나누고
              나에게 맞는 건강한 습관을 찾아보세요.
            </p>

            <div className="home-hero-actions">
              <button
                className="home-primary-button"
                onClick={() => navigate("/boards")}
              >
                게시글 보러가기
              </button>
              <button
                className="home-secondary-button"
                onClick={() => navigate("/boards/new")}
              >
                글쓰기
              </button>
            </div>
          </div>

          <div className="home-hero-panel" aria-label="fitboard 요약">
            <div>
              <strong>오늘의 주제</strong>
              <span>루틴 · 식단 · 질문</span>
            </div>
            <div>
              <strong>커뮤니티</strong>
              <span>게시글에서 자세히 보기</span>
            </div>
            <div>
              <strong>기록 습관</strong>
              <span>운동과 식단을 꾸준히</span>
            </div>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-heading">
            <span className="home-kicker">카테고리</span>
            <h3>관심 있는 주제로 바로 이동하세요</h3>
          </div>

          <div className="home-category-grid">
            {categories.map((category) => (
              <button
                key={category.title}
                className="home-category-card"
                onClick={() => navigate("/boards")}
              >
                <strong>{category.title}</strong>
                <span>{category.desc}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="home-community-band">
          <div>
            <span className="home-kicker">커뮤니티 게시판</span>
            <h3>게시글은 게시판에서 따로 확인할 수 있어요</h3>
            <p>
              메인에서는 서비스를 둘러보고, 게시판으로 이동하면 글 목록과 상세
              내용을 확인할 수 있습니다.
            </p>
          </div>
          <button className="home-primary-button" onClick={() => navigate("/boards")}>
            게시판으로 이동
          </button>
        </section>

        <section className="home-section home-deal-section">
          <div className="home-section-heading home-section-heading-row">
            <div>
              <span className="home-kicker">이번 주만 이 가격, 놓치면 끝</span>
              <h3>단 7일간의 파격 특가</h3>
            </div>
            <button
              className="home-text-button"
              onClick={() => navigate("/healthy-deals")}
            >
              헬시딜 상품 더보기
            </button>
          </div>

          <div className="home-deal-grid">
            {deals.map((deal, index) => (
              <article
                className="home-deal-card"
                key={deal.id}
                onClick={() => navigate(`/healthy-deals/${deal.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/healthy-deals/${deal.id}`);
                  }
                }}
              >
                <div className="home-deal-image-wrap">
                  <img src={deal.image} alt={deal.title} />
                  <span className="home-rank-badge">{index + 1}</span>
                </div>
                <h4>{deal.title}</h4>
                <p className="home-original-price">{deal.originalPrice}</p>
                <div className="home-price-row">
                  <strong>{deal.discount}</strong>
                  <span>{deal.price}</span>
                </div>
                <div className="home-deal-tags">
                  <span>{deal.point}</span>
                  <span>무료배송</span>
                </div>
                <div className="home-deal-meta">
                  <span>{deal.buyers}</span>
                  <span>★ {deal.rating}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section home-magazine-section">
          <div className="home-section-heading home-section-heading-row">
            <div>
              <span className="home-kicker">놓치기 쉬운 다이어트 정보를 확인하세요</span>
              <h3>전문가 다이어트 매거진</h3>
            </div>
            <button
              className="home-text-button"
              onClick={() => navigate("/magazines")}
            >
              더보기
            </button>
          </div>

          <div className="home-magazine-grid">
            {magazines.map((magazine) => (
              <article
                className="home-magazine-card"
                key={magazine.id}
                onClick={() => navigate(`/magazines/${magazine.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate(`/magazines/${magazine.id}`);
                  }
                }}
              >
                <img src={magazine.image} alt={magazine.title} />
                <h4>{magazine.title}</h4>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HomePage;
