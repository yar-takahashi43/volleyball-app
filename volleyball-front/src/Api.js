import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api",
  headers: {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Expires": "0"
  }
});

/**
 * localStorage から JWT を取得する。
 */
function getStoredToken() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return parsed.token || null;
  } catch (err) {
    return null;
  }
}

/**
 * 認証情報を消し、ログイン画面へ戻す。
 */
function clearAuthAndRedirectToLogin() {
  localStorage.removeItem("auth");
  localStorage.removeItem("user");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

// リクエストに Bearer トークンを付与する
api.interceptors.request.use(
  function attachAuthHeader(config) {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function handleRequestError(error) {
    return Promise.reject(error);
  }
);

// 401 のときはセッションを破棄する
api.interceptors.response.use(
  function passThrough(response) {
    return response;
  },
  function handleResponseError(error) {
    if (error.response && error.response.status === 401) {
      clearAuthAndRedirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default api;
