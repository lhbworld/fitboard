import "./Footer.css";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div>
          <h2 className="app-footer-logo">fitboard</h2>
          <p>
            운동 루틴, 식단 관리, 건강 정보를 함께 나누는 커뮤니티입니다.
          </p>
        </div>

        <div className="app-footer-info">
          <span>주소: 경기도 용인시 기흥구 기흥로</span>
          <span>대표이사: 이현빈</span>
        </div>
      </div>

      <div className="app-footer-bottom">
        <span>© 2026 fitboard. All rights reserved.</span>
        <span>건강한 습관은 작은 기록에서 시작됩니다.</span>
      </div>
    </footer>
  );
}

export default Footer;
