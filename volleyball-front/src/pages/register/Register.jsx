import React, { useRef } from 'react'
import "./Register.css"
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()

  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordConfirmation = useRef()

  const handleSubmit =  async (e) => {
    // ログインボタンを押してもリロードされなくなる
    e.preventDefault()

    //パスワードと確認用があっているか
    if(password.current.value !== passwordConfirmation.current.value) {
      passwordConfirmation.current.setCustomValidity("パスワードが違います。")
    } else {
      try{
        const user = {
          username: username.current.value,
          email: email.current.value,
          password: password.current.value,
        }
        //registerAPIを叩く
        await axios.post("/auth/register", user)
        navigate("/login")
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <div className="login">
        <div className='loginWrapper'>
            <div className="loginImg">
                <h3 className='loginLogo'>スコア管理シート</h3>
                <span className="loginDesc">快適なチームマネジメントを支えますわよ</span>
                <form className="loginBox" onSubmit={(e) => handleSubmit(e)}>
                    <p className="loginMsg">新規登録はこちら</p>
                    <input 
                      type="text" 
                      className="loginInput" 
                      placeholder='ユーザー名'
                      required
                      ref={username}
                    />
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
                      minLength={6}
                      ref={password}
                    />
                    <input 
                      type="password" 
                      className="loginInput" 
                      placeholder='確認用パスワード' 
                      required
                      minLength={6}
                      ref={passwordConfirmation}
                    />
                    <button className="loginButton" type='submit'>サインアップ</button>
                    <button className="loginRegisterButton">ログイン</button>
                </form>
            </div>
        </div>
    </div>
  )
}
