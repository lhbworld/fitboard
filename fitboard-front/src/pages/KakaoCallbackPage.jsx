import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

function KakaoCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleKakaoCallback = async () => {
      const token = searchParams.get("token");

      if (token) {
        localStorage.setItem("accessToken", token);
        navigate("/", { replace: true });
        return;
      }

      await Swal.fire({
        icon: "error",
        title: "카카오 로그인 실패",
        text: "로그인 정보를 확인할 수 없습니다. 다시 시도해주십시오.",
        confirmButtonColor: "#ef4444",
      });

      navigate("/login", { replace: true });
    };

    handleKakaoCallback();
  }, [navigate, searchParams]);

  return null;
}

export default KakaoCallbackPage;
