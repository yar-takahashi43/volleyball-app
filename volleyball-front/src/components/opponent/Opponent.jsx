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


  const handleDelete = async () => {
    try {
      await api.delete(`opponent/${opponent._id}`)
      // 親に削除依頼を渡す
      onDelete(opponent._id)
    } catch (err) {
      console.log("削除中にエラーが発生しました。" ,err)
    }
    setPopup(false)
  }

  const handleUpdate = async () => {
    try {
      const res = await api.put(`opponent/${opponent._id}`, updatedOpponent)
      // 更新後を親に渡す
      onUpdate(res.data)
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
