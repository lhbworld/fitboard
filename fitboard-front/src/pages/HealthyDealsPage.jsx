import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { deals } from "../data/homeContent";
import "./HomePage.css";
import "./HealthyDealsPage.css";

function HealthyDealsPage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <Header />

      <main className="home-main healthy-page-main">
        <section className="healthy-page-hero">
          <span className="home-kicker">이번 주만 이 가격, 놓치면 끝</span>
          <h2>단 7일간의 파격 특가</h2>
          <p>운동과 식단 관리에 필요한 상품을 한눈에 둘러보세요.</p>
        </section>

        <section className="home-section">
          <div className="home-deal-grid healthy-deal-list-grid">
            {deals.map((deal, index) => (
              <article
                className="home-deal-card healthy-clickable-card"
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
      </main>

      <Footer />
    </div>
  );
}

export default HealthyDealsPage;
