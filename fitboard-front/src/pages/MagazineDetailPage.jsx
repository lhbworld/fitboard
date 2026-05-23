import { useNavigate, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { magazines } from "../data/homeContent";
import "./HomePage.css";
import "./HealthyDealsPage.css";

function MagazineDetailPage() {
  const navigate = useNavigate();
  const { magazineId } = useParams();
  const magazine = magazines.find((item) => item.id === magazineId);

  if (!magazine) {
    return (
      <div className="home-page">
        <Header />
        <main className="home-main healthy-page-main">
          <section className="healthy-page-hero">
            <h2>매거진을 찾을 수 없습니다</h2>
            <button className="home-primary-button" onClick={() => navigate("/magazines")}>
              매거진 목록으로 돌아가기
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
        <article className="magazine-detail">
          <img src={magazine.image} alt={magazine.title} />
          <div className="magazine-detail-body">
            <span className="home-kicker">전문가 다이어트 매거진</span>
            <h2>{magazine.title}</h2>
            <p className="magazine-detail-summary">{magazine.desc}</p>
            <p>{magazine.body}</p>
            <button className="home-primary-button" onClick={() => navigate("/magazines")}>
              다른 매거진 보기
            </button>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

export default MagazineDetailPage;
