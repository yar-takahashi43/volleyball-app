import React, {useState} from 'react'
import "./RegisterOpponent.css"
import "../home/Container.css"
import RegisterOpponentTop from "./RegisterOpponentTop"
import axios from 'axios'

export default function RegisterOpponent() {
    const [name, setName] = useState("");
    const [label, setLabel] = useState("")
    const [message, setMessage] = useState("")

    const registerOpponent = async() => {
        try{
            const res = await axios.post("opponent/register", {
                name,
                label
            })
            setMessage("登録が完了しました！")
        } catch(err) {
            setMessage("登録に失敗しました。名前か表示名が既に使われています。")
        }
    }

    return (
        <div className="register">
            <div className="registerTop">
                <RegisterOpponentTop/>
            </div> 
            <div className="registerBox">
                <p className="registerMsg">※表示名には通称を入れる</p>
                <input 
                    type="text" 
                    className="registerInput" 
                    placeholder='対戦相手名（学校）'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    type="text"
                    className="registerInput" 
                    placeholder='表示名'
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
                <button className="registerButton" onClick={registerOpponent}>登録</button>
                <p>{message}</p>
            </div>
        </div>
      )
    }
    