import React from 'react'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import "../../components/player/Player.css"
import api from '../../Api';
import { useState } from 'react';

export default function Game({match, date}) {

    const[popup, setPopup] = useState(false)
    const[updatePopup, setUpdatePopup] = useState(false)
    const[updatedOpponent, setUpdatedOpponent] = useState(false)

    const handleDelete = async () => {
      try {
        await api.delete(`match/${match._id}`)
        console.log("削除が完了しました。")
      } catch (err) {
        console.log("削除中にエラーが発生しました。" ,err)
      }
      setPopup(false)
    }

    const handleUpdate = async () => {
      try {
        await api.put(`match/${match._id}`, updatedOpponent)
        console.log("更新が完了しました。")
      } catch (err) {
        console.log("更新中にエラーが発生しました。" ,err)
      }
      setUpdatePopup(false)
    }
    console.log(match)

  return (
    <li className="playerList">
        <div className="playerListContainer">
            <div className="eachplayer">
                <span className="playerNum">
                    日付：{date}
                </span>
                <span className="playerName">
                    対戦相手：{match.opponentId}
                </span>
                <div className="changePlayer">
                    <PersonRemoveIcon 
                        className='deletePlayer' 
                        htmlColor='green'
                        onClick={() => setPopup(true)}
                      />{popup && (
                          <div className="popup">
                              <p>本当に削除しますか？</p>
                              <p>削除したら戻れませんよ？</p>
                              <button className="delete" onClick={handleDelete}>OK</button>
                              <button className="cancel" onClick={() => setPopup(false)}>キャンセル</button>
                          </div>
                      )}
                    <span className='playerListText'>削除</span>

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
                    <span className='playerListText'>更新</span>
                </div>
            </div>
        </div>
    </li>
  )
}
