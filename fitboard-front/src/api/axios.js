import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
  baseURL: "http://localhost:8081",
});

let isAuthAlertOpen = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || "";

    const isAuthPageRequest =
      requestUrl.includes("/api/users/login") ||
      requestUrl.includes("/api/users/signup");

    if ((status === 401 || status === 403) && !isAuthPageRequest) {
      localStorage.removeItem("accessToken");

      if (!isAuthAlertOpen) {
        isAuthAlertOpen = true;

        await Swal.fire({
          icon: "warning",
          title: "로그인 필요",
          text: "로그인 정보가 만료되었거나 유효하지 않습니다. 다시 로그인해주십시오.",
          confirmButtonColor: "#12805d",
        });

        isAuthAlertOpen = false;
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
