import React from 'react'
import "./RegisterPlayer.css"
import "../home/Container.css"
import RegisterPlayerTop from "./PlayerRegisterTop"

export default function RegisterPlayer() {
  return (
    <div className="register">
        <div className="registerTop">
            <RegisterPlayerTop />
        </div>   
        <div className="registerBox">
            <p className="registerMsg">※表示名にはニックネームを入れる</p>
            <input type="text" className="registerInput" placeholder='背番号' />
            <input type="text" className="registerInput" placeholder='選手名' />
            <input type="text" className="registerInput" placeholder='表示名' />
            <button className="registerButton">登録</button>
        </div>
    </div>
  )
}
