import React, { useContext, useRef } from 'react'
import "./Login.css"
import { loginCall } from '../../actionCalls'
import { AuthContext } from '../../state/AuthContext'

export default function Login() {
  const email = useRef()
  const password = useRef()
  const {user, isFetching, error, dispatch} = useContext(AuthContext)

  const handleSubmit = (e) => {
    // ログインボタンを押してもリロードされなくなる
    e.preventDefault()
    loginCall({
      email: email.current.value,
      password: password.current.value,
    }, dispatch)
  }

  console.log(user)

  return (
    <div className="login">
        <div className='loginWrapper'>
            <div className="loginImg">
                <h3 className='loginLogo'>スコア管理シート</h3>
                <span className="loginDesc">快適なチームマネジメントを支えますわよ</span>
                <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                    <p className="loginMsg">ログインはこちら</p>
                    <input 
                      type="email" 
                      className="loginInput" 
                      placeholder='Eメール' 
                      required
                      ref={email}
                    />
                    <input 
                      type="password" 
                      className="loginInput" 
                      placeholder='パスワード' 
                      required
                      minLength="6"
                      ref={password}
                    />
                    <button className="loginButton">ログイン</button>
                    <span className="loginForgot">パスワードを忘れた愚か者へ</span>
                    <button className="loginRegisterButton">アカウント作成</button>
                </form>
            </div>
        </div>
    </div>
  )
}
