import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import BoardListPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import BoardCreatePage from "./pages/BoardCreatePage";
import BoardEditPage from "./pages/BoardEditPage";
import HealthyDealsPage from "./pages/HealthyDealsPage";
import HealthyDealDetailPage from "./pages/HealthyDealDetailPage";
import MagazinePage from "./pages/MagazinePage";
import MagazineDetailPage from "./pages/MagazineDetailPage";
import MyPage from "./pages/MyPage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage />} />

      <Route path="/boards" element={<BoardListPage />} />
      <Route path="/boards/:boardId" element={<BoardDetailPage />} />
      <Route path="/healthy-deals" element={<HealthyDealsPage />} />
      <Route path="/healthy-deals/:dealId" element={<HealthyDealDetailPage />} />
      <Route path="/magazines" element={<MagazinePage />} />
      <Route path="/magazines/:magazineId" element={<MagazineDetailPage />} />

      <Route
        path="/boards/new"
        element={
          <ProtectedRoute>
            <BoardCreatePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/boards/:boardId/edit"
        element={
          <ProtectedRoute>
            <BoardEditPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
