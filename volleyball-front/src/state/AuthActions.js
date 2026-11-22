// ユーザー入力に応じたアクションの設定
export const LoginStart = () => ({
    type: "LOGIN_START",
});

export const LoginSuccess = (authPayload) => ({
    type: "LOGIN_SUCCESS",
    payload: authPayload,
});

export const LoginError = (error) => ({
    type: "LOGIN_ERROR",
    payload: error,
});

export const Logout = () => ({
    type: "LOGOUT",
});
