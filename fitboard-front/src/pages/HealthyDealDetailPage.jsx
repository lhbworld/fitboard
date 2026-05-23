import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { deals } from "../data/homeContent";
import "./HomePage.css";
import "./HealthyDealsPage.css";

function HealthyDealDetailPage() {
  const navigate = useNavigate();
  const { dealId } = useParams();
  const deal = deals.find((item) => item.id === dealId);

  if (!deal) {
    return (
      <div className="home-page">
        <Header />
        <main className="home-main healthy-page-main">
          <section className="healthy-page-hero">
            <h2>상품을 찾을 수 없습니다</h2>
            <button className="home-primary-button" onClick={() => navigate("/healthy-deals")}>
              특가 목록으로 돌아가기
            </button>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home-page">
      <Header />

      <main className="home-main healthy-page-main">
        <section className="healthy-detail">
          <div className="healthy-detail-image">
            <img src={deal.image} alt={deal.title} />
          </div>

          <div className="healthy-detail-info">
            <span className="home-kicker">헬시딜 특가</span>
            <h2>{deal.title}</h2>
            <p>{deal.desc}</p>

            <div className="healthy-detail-price">
              <span>{deal.originalPrice}</span>
              <strong>
                {deal.discount} {deal.price}
              </strong>
            </div>

            <div className="healthy-detail-meta">
              <span>{deal.point}</span>
              <span>무료배송</span>
              <span>{deal.buyers}</span>
              <span>★ {deal.rating}</span>
            </div>

            <button className="home-primary-button" onClick={() => navigate("/healthy-deals")}>
              다른 특가 보기
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default HealthyDealDetailPage;
