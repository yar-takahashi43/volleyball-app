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

  /**
   * 選手を削除する。
   */
  const handleDelete = async () => {
    try {
      await api.delete(`player/${player._id}`)
      onDelete(player._id)
    } catch (err) {
      console.log("削除中にエラーが発生しました。" ,err)
    }
    setPopup(false)
  }

  /**
   * 選手情報を更新する。
   */
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
      <li className="playerList" id={`player-list-item-${player._id}`}>
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
                          id={`player-delete-icon-${player._id}`}
                          htmlColor='green'
                          onClick={() => setPopup(true)}
                      />
                      {popup && (
                          <div className="modalOverlay" id={`player-delete-overlay-${player._id}`} onClick={() => setPopup(false)}>
                            <div className="popup" onClick={(e) => e.stopPropagation()}>
                              <div className="alert">
                                <p className="popupTitle">本当に削除しますか？</p>
                                <p className="popupMessage">削除したら元に戻せません。</p>
                              </div>
                              <div className="popupActions">
                                <button type="button" className="popupButton popupButtonDanger" id={`player-delete-ok-${player._id}`} onClick={handleDelete}>削除する</button>
                                <button type="button" className="popupButton popupButtonSecondary" id={`player-delete-cancel-${player._id}`} onClick={() => setPopup(false)}>キャンセル</button>
                              </div>
                            </div>
                          </div>
                      )}
                      <span className='playerListText'>削除</span>

                      <ReplayCircleFilledIcon
                          className='updatePlayer'
                          id={`player-update-icon-${player._id}`}
                          htmlColor='blue'
                          onClick={() => setUpdatePopup(true)}
                      />
                      {updatePopup && (
                          <div className="modalOverlay" id={`player-update-overlay-${player._id}`} onClick={() => setUpdatePopup(false)}>
                            <div className="popup" onClick={(e) => e.stopPropagation()}>
                              <p className="popupTitle">選手情報を更新します</p>
                              <input
                                  id={`player-update-num-${player._id}`}
                                  type="text"
                                  className="playerInfo"
                                  value={updatedPlayer.num}
                                  placeholder='背番号'
                                  onChange={(e) => setUpdatedPlayer({...updatedPlayer, num: e.target.value})}
                                />
                                <input
                                  id={`player-update-name-${player._id}`}
                                  type="text"
                                  className="playerInfo"
                                  value={updatedPlayer.name}
                                  placeholder='名前'
                                  onChange={(e) => setUpdatedPlayer({...updatedPlayer, name: e.target.value})}
                                />
                                <input
                                  id={`player-update-nickname-${player._id}`}
                                  type="text"
                                  className="playerInfo"
                                  value={updatedPlayer.nickname}
                                  placeholder='表示名'
                                  onChange={(e) => setUpdatedPlayer({...updatedPlayer, nickname: e.target.value})}
                                />
                              <div className="popupActions">
                                <button type="button" className="popupButton popupButtonPrimary" id={`player-update-ok-${player._id}`} onClick={handleUpdate}>更新する</button>
                                <button type="button" className="popupButton popupButtonSecondary" id={`player-update-cancel-${player._id}`} onClick={() => setUpdatePopup(false)}>キャンセル</button>
                              </div>
                            </div>
                          </div>
                      )}
                          <span className='playerListText'>変更</span>
                  </div>
              </div>
          </div>
      </li>
    )
  }
