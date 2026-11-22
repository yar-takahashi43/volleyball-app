import api from "./Api"

/**
 * ログイン API を呼び、AuthContext を更新する。
 */
export const loginCall = async (user, dispatch) => {
    dispatch({ type: "LOGIN_START" })
    try {
        const response = await api.post("/auth/login", user)
        dispatch({
            type: "LOGIN_SUCCESS",
            payload: {
                token: response.data.token,
                user: response.data.user,
            },
        })
    } catch (err) {
        dispatch({ type: "LOGIN_ERROR", payload: err })
    }
}
