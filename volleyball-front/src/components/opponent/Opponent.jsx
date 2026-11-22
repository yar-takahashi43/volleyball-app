import React, {useState, useEffect} from 'react'
import "./Opponent.css"
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import api from '../../Api';

export default function Opponent({opponent, onDelete, onUpdate}) {
    
  const[popup, setPopup] = useState(false)
  const[updatePopup, setUpdatePopup] = useState(false)
  const[updatedOpponent, setUpdatedOpponent] = useState({
    name: opponent.name,
    label: opponent.label
  })
  useEffect(() => {
    setUpdatedOpponent({
      name: opponent.name,
      label: opponent.label
    });
  }, [opponent]);

  /**
   * 対戦相手を削除する。
   */
  const handleDelete = async () => {
    try {
      await api.delete(`opponent/${opponent._id}`)
      onDelete(opponent._id)
    } catch (err) {
      console.log("削除中にエラーが発生しました。" ,err)
    }
    setPopup(false)
  }

  /**
   * 対戦相手情報を更新する。
   */
  const handleUpdate = async () => {
    try {
      const res = await api.put(`opponent/${opponent._id}`, updatedOpponent)
      onUpdate(res.data)
    } catch (err) {
      console.log("更新中にエラーが発生しました。" ,err)
    }
    setUpdatePopup(false)
  }

  return (
    <li className="opponentList" id={`opponent-list-item-${opponent._id}`}>
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
                        id={`opponent-delete-icon-${opponent._id}`}
                        htmlColor='green'
                        onClick={() => setPopup(true)}
                      />
                    {popup && (
                      <div className="modalOverlay" id={`opponent-delete-overlay-${opponent._id}`} onClick={() => setPopup(false)}>
                          <div className="popup" onClick={(e) => e.stopPropagation()}>
                            <div className="alert">
                              <p className="popupTitle">本当に削除しますか？</p>
                              <p className="popupMessage">削除したら元に戻せません。</p>
                            </div>
                            <div className="popupActions">
                              <button type="button" className="popupButton popupButtonDanger" id={`opponent-delete-ok-${opponent._id}`} onClick={handleDelete}>削除する</button>
                              <button type="button" className="popupButton popupButtonSecondary" id={`opponent-delete-cancel-${opponent._id}`} onClick={() => setPopup(false)}>キャンセル</button>
                            </div>
                          </div>
                      </div>
                    )}
                    <span className='opponentListText'>削除</span>

                    <ReplayCircleFilledIcon
                          className='updateOpponent'
                          id={`opponent-update-icon-${opponent._id}`}
                          htmlColor='blue'
                          onClick={() => setUpdatePopup(true)}
                      />
                    {updatePopup && (
                      <div className="modalOverlay" id={`opponent-update-overlay-${opponent._id}`} onClick={() => setUpdatePopup(false)}>
                          <div className="popup" onClick={(e) => e.stopPropagation()}>
                              <p className="popupTitle">対戦相手情報を更新します</p>
                                <input
                                  id={`opponent-update-name-${opponent._id}`}
                                  type="text"
                                  className="opponentInfo"
                                  value={updatedOpponent.name}
                                  placeholder='名前'
                                  onChange={(e) => setUpdatedOpponent({...updatedOpponent, name: e.target.value})}
                                />
                                <input
                                  id={`opponent-update-label-${opponent._id}`}
                                  type="text"
                                  className="opponentInfo"
                                  value={updatedOpponent.label}
                                  placeholder='表示名'
                                  onChange={(e) => setUpdatedOpponent({...updatedOpponent, label: e.target.value})}
                                />
                              <div className="popupActions">
                                <button type="button" className="popupButton popupButtonPrimary" id={`opponent-update-ok-${opponent._id}`} onClick={handleUpdate}>更新する</button>
                                <button type="button" className="popupButton popupButtonSecondary" id={`opponent-update-cancel-${opponent._id}`} onClick={() => setUpdatePopup(false)}>キャンセル</button>
                              </div>
                          </div>
                      </div>
                    )}
                          <span className='opponentListText'>変更</span>
                </div>
            </div>
        </div>
    </li>
  )
}
