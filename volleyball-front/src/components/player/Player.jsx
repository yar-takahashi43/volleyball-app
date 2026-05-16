import React, { useState, useEffect } from 'react'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import "./Player.css"
import api from '../../Api';

export default function Player({player, onDelete, onUpdate}) {

  const[popup, setPopup] = useState(false)
  const[updatePopup, setUpdatePopup] = useState(false)
  const[updatedPlayer, setUpdatedPlayer] = useState({
      num: player.num,
      name: player.name,
      nickname: player.nickname
  })
  useEffect(() => {
    setUpdatedPlayer({
      num: player.num,
      name: player.name,
      nickname: player.nickname
    });
  }, [player]);

  const handleDelete = async () => {
    try {
      await api.delete(`player/${player._id}`)
      onDelete(player._id)
    } catch (err) {
      console.log("削除中にエラーが発生しました。" ,err)
    }
    setPopup(false)
  }

  const handleUpdate = async () => {
    try {
      const res = await api.put(`player/${player._id}`, updatedPlayer)
      onUpdate(res.data)
    } catch (err) {
      console.log("更新中にエラーが発生しました。" ,err)
    }
    setUpdatePopup(false)
  }

    return (
      <li className="playerList">
          <div className="playerListContainer">
              <div className="eachplayer">
                  <span className="playerNum">
                      背番号：{player.num}
                  </span>
                  <span className="playerName">
                      名前：{player.name}
                  </span>
                  <span className="playerNickname">
                      表示名：{player.nickname}
                  </span>
                  <div className="changePlayer">
                      <PersonRemoveIcon 
                          className='deletePlayer' 
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
                      <span className='playerListText'>削除</span>

                      <ReplayCircleFilledIcon 
                          className='updatePlayer' 
                          htmlColor='blue'
                          onClick={() => setUpdatePopup(true)}
                      />{updatePopup && (
                          <div className="popup">
                              <p>選手情報を更新します。</p>
                              <input 
                                  type="text" 
                                  className="playerInfo"
                                  value={updatedPlayer.num}
                                  placeholder='背番号'
                                  onChange={(e) => setUpdatedPlayer({...updatedPlayer, num: e.target.value})}
                                />
                                <input 
                                  type="text" 
                                  className="playerInfo"
                                  value={updatedPlayer.name}
                                  placeholder='名前'
                                  onChange={(e) => setUpdatedPlayer({...updatedPlayer, name: e.target.value})}
                                />
                                <input 
                                  type="text" 
                                  className="playerInfo"
                                  value={updatedPlayer.nickname}
                                  placeholder='表示名'
                                  onChange={(e) => setUpdatedPlayer({...updatedPlayer, nickname: e.target.value})}
                                />
                              <button className="update" onClick={handleUpdate}>OK</button>
                              <button className="updateCancel" onClick={() => setUpdatePopup(false)}>キャンセル</button>
                          </div>
                      )}
                          <span className='playerListText'>変更</span>
                  </div>
              </div>
          </div>
      </li>
    )
  }
  