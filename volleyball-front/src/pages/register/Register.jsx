import React, { useRef } from 'react'
import "./Register.css"
import api from '../../Api'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordConfirmation = useRef()

  /**
   * 新規登録フォーム送信を処理する。
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    passwordConfirmation.current.setCustomValidity("")

    if (password.current.value !== passwordConfirmation.current.value) {
      passwordConfirmation.current.setCustomValidity("パスワードが違います。")
      passwordConfirmation.current.reportValidity()
      return
    }

    try {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      }
      await api.post("/auth/register", user)
      navigate("/login")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="login" id="registerPage">
        <div className='loginWrapper'>
            <div className="loginImg">
                <h3 className='loginLogo'>スコア管理シート</h3>
                <span className="loginDesc">試合のスコアを記録・管理</span>
                <form className="loginBox" id="registerForm" onSubmit={(e) => handleSubmit(e)}>
                    <p className="loginMsg">新規登録はこちら</p>
                    <input
                      id="registerUsername"
                      type="text"
                      className="loginInput"
                      placeholder='ユーザー名'
                      required
                      ref={username}
                    />
                    <input
                      id="registerEmail"
                      type="email"
                      className="loginInput"
                      placeholder='Eメール'
                      required
                      ref={email}
                    />
                    <input
                      id="registerPassword"
                      type="password"
                      className="loginInput"
                      placeholder='パスワード'
                      required
                      minLength={6}
                      ref={password}
                    />
                    <input
                      id="registerPasswordConfirmation"
                      type="password"
                      className="loginInput"
                      placeholder='確認用パスワード'
                      required
                      minLength={6}
                      ref={passwordConfirmation}
                    />
                    <button id="registerSubmitButton" className="loginButton" type='submit'>サインアップ</button>
                    <Link
                      to="/login"
                      id="registerToLoginLink"
                      className="loginRegisterButton"
                      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      ログイン
                    </Link>
                </form>
            </div>
        </div>
    </div>
  )
}
