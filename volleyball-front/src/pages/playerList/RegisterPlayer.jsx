import React, {useState} from 'react'
import "./RegisterPlayer.css"
import "../home/Container.css"
import RegisterPlayerTop from "./PlayerRegisterTop"
import api from '../../Api';
import { useFlashMessage } from '../../hooks/useFlashMessage';

export default function RegisterPlayer() {
  const [num, setNum] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("")
  const {message, showMessage} = useFlashMessage(2000)

  const registerPlayer = async() => {
    try{
      await api.post("player/register", {
        num,
        name,
        nickname
      })
      showMessage("登録が完了しました！")
    } catch(err) {
      showMessage("登録に失敗しました。背番号、名前、表示名のいずれかが既に使われています。")
    }
  }

  return (
    <div className="register">
        <div className="registerTop">
            <RegisterPlayerTop />
        </div>   
        <div className="registerBox">
            <p className="registerMsg">※表示名にはニックネームを入れる</p>
            <input 
              type="text" 
              className="registerInput" 
              placeholder='背番号' 
              value={num}
              onChange={(e) => setNum(e.target.value)}
            />
            <input 
              type="text" 
              className="registerInput" 
              placeholder='選手名' 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input 
              type="text"
              className="registerInput"
              placeholder='表示名'
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <button className="registerButton" onClick={registerPlayer}>登録</button>
            <p>{message}</p>
        </div>
    </div>
  )
}
