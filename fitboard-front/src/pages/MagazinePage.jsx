import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { magazines } from "../data/homeContent";
import "./HomePage.css";
import "./HealthyDealsPage.css";

function MagazinePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />

      <main className="home-main healthy-page-main">
        <section className="healthy-page-hero">
          <span className="home-kicker">놓치기 쉬운 다이어트 정보를 확인하세요</span>
          <h2>전문가 다이어트 매거진</h2>
          <p>운동, 식단, 습관 관리에 도움 되는 읽을거리를 모았습니다.</p>
        </section>

        <section className="home-section">
          <div className="home-magazine-grid healthy-magazine-list-grid">
            {magazines.map((magazine) => (
              <article
                className="home-magazine-card healthy-clickable-card"
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

export default MagazinePage;
