import { createContext, useReducer, useEffect } from "react";
import AuthReducer from "./AuthReducer";

const AUTH_STORAGE_KEY = "auth";

/**
 * localStorage から安全な認証情報を読み込む。
 */
function loadAuthFromStorage() {
    try {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) {
            return { user: null, token: null };
        }
        const parsed = JSON.parse(raw);
        return {
            user: parsed.user || null,
            token: parsed.token || null,
        };
    } catch (err) {
        return { user: null, token: null };
    }
}

const storedAuth = loadAuthFromStorage();

// 最初のユーザー状態の定義
const initialState = {
    user: storedAuth.user,
    token: storedAuth.token,
    isFetching: false,
    error: false,
};

// 状態をグローバルに管理する
export const AuthContext = createContext(initialState);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    // token と password なし user だけを永続化する
    useEffect(() => {
        if (!state.user || !state.token) {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            // 旧キーの掃除
            localStorage.removeItem("user");
            return;
        }

        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({
                user: state.user,
                token: state.token,
            })
        );
        localStorage.removeItem("user");
    }, [state.user, state.token]);

    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                token: state.token,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
