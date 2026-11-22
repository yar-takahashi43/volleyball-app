import React, { useContext, useRef } from 'react'
import "./Login.css"
import { Link } from 'react-router-dom'
import { loginCall } from '../../actionCalls'
import { AuthContext } from '../../state/AuthContext'

export default function Login() {
  const email = useRef()
  const password = useRef()
  const { isFetching, error, dispatch } = useContext(AuthContext)

  /**
   * ログインフォーム送信を処理する。
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    loginCall({
      email: email.current.value,
      password: password.current.value,
    }, dispatch)
  }

  return (
    <div className="login" id="loginPage">
        <div className='loginWrapper'>
            <div className="loginImg">
                <h3 className='loginLogo'>スコア管理シート</h3>
                <span className="loginDesc">試合のスコアを記録・管理</span>
                <form className="loginBox" id="loginForm" onSubmit={(e) => handleSubmit(e)}>
                    <p className="loginMsg">ログインはこちら</p>
                    <input
                      id="loginEmail"
                      type="email"
                      className="loginInput"
                      placeholder='Eメール'
                      required
                      ref={email}
                    />
                    <input
                      id="loginPassword"
                      type="password"
                      className="loginInput"
                      placeholder='パスワード'
                      required
                      minLength="6"
                      ref={password}
                    />
                    {error ? (
                      <p className="loginError" id="loginErrorMessage">ログインに失敗しました</p>
                    ) : null}
                    <button
                      id="loginSubmitButton"
                      className="loginButton"
                      type="submit"
                      disabled={isFetching}
                    >
                      {isFetching ? "ログイン中..." : "ログイン"}
                    </button>
                    <Link
                      to="/register"
                      id="loginToRegisterLink"
                      className="loginRegisterButton"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      アカウント作成
                    </Link>
                </form>
            </div>
        </div>
    </div>
  )
}
