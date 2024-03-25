import React from 'react'
import "./Login.css"

export default function Login() {
  return (
    <div className="login">
        <div className='loginWrapper'>
            <div className="loginImg">
                <h3 className='loginLogo'>スコア管理シート</h3>
                <span className="loginDesc">快適なチームマネジメントを支えますわよ</span>
                <div className="loginBox">
                    <p className="loginMsg">ログインはこちら</p>
                    <input type="text" className="loginInput" placeholder='利用者ID' />
                    <input type="text" className="loginInput" placeholder='パスワード' />
                    <button className="loginButton">ログイン</button>
                    <span className="loginForgot">パスワードを忘れた愚か者へ</span>
                    <button className="loginRegisterButton">アカウント作成</button>
                </div>
            </div>
        </div>
    </div>
  )
}
