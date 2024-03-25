import React from 'react'
import "./RegisterOpponent.css"
import "../home/Container.css"
import RegisterOpponentTop from "./RegisterOpponentTop"

export default function RegisterOpponent() {
    return (
        <div className="register">
            <div className="registerTop">
                <RegisterOpponentTop/>
            </div> 
            <div className="registerBox">
                <p className="registerMsg">※表示名には通称を入れる</p>
                <input type="text" className="registerInput" placeholder='対戦相手名（学校）' />
                <input type="text" className="registerInput" placeholder='表示名' />
                <button className="registerButton">登録</button>
            </div>
        </div>
      )
    }
    