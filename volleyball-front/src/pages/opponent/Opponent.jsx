import React, {useState} from 'react'
import "./Opponent.css"
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import axios from 'axios';

export default function Opponent({opponent}) {
    
  const[popup, setPopup] = useState(false)
  const[updatePopup, setUpdatePopup] = useState(false)
  const[updatedOpponent, setUpdatedOpponent] = useState(false)

  const handleDelete = async () => {
    try {
      await axios.delete(`opponent/${opponent._id}`)
      console.log("削除が完了しました。")
    } catch (err) {
      console.log("削除中にエラーが発生しました。" ,err)
    }
    setPopup(false)
  }

  const handleUpdate = async () => {
    try {
      await axios.put(`opponent/${opponent._id}`, updatedOpponent)
      console.log("更新が完了しました。")
    } catch (err) {
      console.log("更新中にエラーが発生しました。" ,err)
    }
    setUpdatePopup(false)
  }

  return (
    <li className="opponentList">
        <div className="opponentListContainer">
            <div className="eachopponent">
                <span className="opponentName">
                    名前：{opponent.name}
                </span>
                <span className="opponentNickname">
                    表示名：{opponent.label}
                </span>
                <div className="changeOpponent">
                   <PersonRemoveIcon 
                        className='deleteOpponent' 
                        htmlColor='green'
                        onClick={() => setPopup(true)}
                      />{popup && (
                          <div className="popup">
                            <div className="alert">
                              <p>本当に削除しますか？</p>
                              <p>削除したら戻れませんよ？</p>
                            </div>
                              <button className="delete" onClick={handleDelete}>OK</button>
                              <button className="cancel" onClick={() => setPopup(false)}>キャンセル</button>
                          </div>
                      )}
                    <span className='opponentListText'>削除</span>

                    <ReplayCircleFilledIcon className='updateOpponent' 
                          htmlColor='blue'
                          onClick={() => setUpdatePopup(true)}
                      />{updatePopup && (
                          <div className="popup">
                              <p>対戦相手情報を更新します。</p>
                                <input 
                                  type="text" 
                                  className="opponentInfo"
                                  value={updatedOpponent.name}
                                  placeholder='名前'
                                  onChange={(e) => setUpdatedOpponent({...updatedOpponent, name: e.target.value})}
                                />
                                <input 
                                  type="text" 
                                  className="opponentInfo"
                                  value={updatedOpponent.label}
                                  placeholder='表示名'
                                  onChange={(e) => setUpdatedOpponent({...updatedOpponent, label: e.target.value})}
                                />
                              <button className="update" onClick={handleUpdate}>OK</button>
                              <button className="updateCancel" onClick={() => setUpdatePopup(false)}>キャンセル</button>
                          </div>
                      )}
                          <span className='opponentListText'>変更</span>
                </div>
            </div>
        </div>
    </li>
  )
}
