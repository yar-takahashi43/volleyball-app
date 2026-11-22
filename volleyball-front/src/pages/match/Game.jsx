import React from 'react'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import "../../components/player/Player.css"
import api from '../../Api';
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Game({ match, date, opponentName }) {

    const [popup, setPopup] = useState(false)

    /**
     * 試合を削除する。
     */
    const handleDelete = async () => {
      try {
        await api.delete(`match/${match._id}`)
        window.location.reload()
      } catch (err) {
        console.log("削除中にエラーが発生しました。" ,err)
      }
      setPopup(false)
    }

  return (
    <li className="playerList" id={`match-list-item-${match._id}`}>
        <div className="playerListContainer">
            <div className="eachplayer">
                <Link
                  id={`match-link-${match._id}`}
                  to={`/match/${match._id}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1 }}
                >
                  <span className="playerNum">
                      日付：{date}
                  </span>
                  <span className="playerName">
                      対戦相手：{opponentName}
                  </span>
                </Link>
                <div className="changePlayer">
                    <PersonRemoveIcon
                        className='deletePlayer'
                        id={`match-delete-icon-${match._id}`}
                        htmlColor='green'
                        onClick={() => setPopup(true)}
                      />
                    {popup && (
                      <div className="modalOverlay" id={`match-delete-overlay-${match._id}`} onClick={() => setPopup(false)}>
                          <div className="popup" onClick={(e) => e.stopPropagation()}>
                              <div className="alert">
                                <p className="popupTitle">本当に削除しますか？</p>
                                <p className="popupMessage">削除したら元に戻せません。</p>
                              </div>
                              <div className="popupActions">
                                <button type="button" className="popupButton popupButtonDanger" id={`match-delete-ok-${match._id}`} onClick={handleDelete}>削除する</button>
                                <button type="button" className="popupButton popupButtonSecondary" id={`match-delete-cancel-${match._id}`} onClick={() => setPopup(false)}>キャンセル</button>
                              </div>
                          </div>
                      </div>
                    )}
                    <span className='playerListText'>削除</span>
                </div>
            </div>
        </div>
    </li>
  )
}
