import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BoardListPage from "./pages/BoardListPage";
import BoardDetailPage from "./pages/BoardDetailPage";
import BoardCreatePage from "./pages/BoardCreatePage";
import BoardEditPage from "./pages/BoardEditPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/boards" element={<BoardListPage />} />
      <Route path="/boards/new" element={<BoardCreatePage />} />
      <Route path="/boards/:boardId" element={<BoardDetailPage />} />
      <Route path="/boards/:boardId/edit" element={<BoardEditPage />} />
    </Routes>
  );
}

export default App;