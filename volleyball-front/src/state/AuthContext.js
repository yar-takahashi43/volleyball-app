import { Children, createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer";

// 最初のユーザー状態の定義
const initialState = {
    user: null,
    isFetching: false,
    error: false,
}

//状態をグローバルに管理する
// 初期値のユーザー状態をどこでも使えるようにする
export const AuthContext = createContext(initialState)

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState)
    return (
        <AuthContext.Provider
            value={{
                user: state.user,
                isFetching: state.isFetching,
                error: state.error,
                dispatch,
            }}
        >
            { children }
        </AuthContext.Provider>
    )
}