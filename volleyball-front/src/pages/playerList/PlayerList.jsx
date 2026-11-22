import React, { useEffect, useState } from 'react'
import "./PlayerList.css"
import Player from '../../components/player/Player'
import PlayerListTop from './PlayerListTop'
import "../home/Container.css"
import api from '../../Api';

export default function PlayerList() {
  const[players, setPlayers] = useState([])

  useEffect(() => {
    const fetchPlayers = async() => {
      try {
        const res = await api.get("player/players")
        setPlayers(res.data)
      } catch(err) {
        console.error(err)
      }
    }
  fetchPlayers()
}, [])
  
  const handleDeletePlayer = async (id) => {
    try {
      await api.delete(`/opponent/${id}`);
      console.log("削除が完了しました。")
      setPlayers(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.log("削除中にエラーが発生しました。" ,err)
    }
  };

  const handleUpdatePlayer = (updated) => {
    try {
      setPlayers(prev => 
        prev.map(p => p._id === updated._id ? updated : p));
    } catch (err) {
      console.log("更新中にエラーが発生しました。" ,err)
    }
  };

  return (
    <div className="container">
      <div className='bar'>
        <PlayerListTop />
            <div className="playerList">
                {players.map((player) => (
                  <Player 
                    key={player._id + player.num + player.name + player.nickname}
                    player={player} 
                    number={player.num}
                    onDelete={handleDeletePlayer}
                    onUpdate={handleUpdatePlayer}/>
                ))}
            </div>
        </div>
    </div>
  )
}
