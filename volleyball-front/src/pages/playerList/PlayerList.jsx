import React, { useEffect, useState } from 'react'
import "./PlayerList.css"
import Player from '../../components/player/Player'
import PlayerListTop from './PlayerListTop'
import "../home/Container.css"
import axios from 'axios'

export default function PlayerList() {

  const[players, setPlayers] = useState([])

  useEffect(() => {
    const fetchPlayers = async() => {
      try {
        const res = await axios.get("player/players")
        setPlayers(res.data)
      } catch(err) {
        console.error(err)
      }
    }
  fetchPlayers()
}, [])
  
  return (
    <div className="container">
      <div className='bar'>
        <PlayerListTop />
            <div className="playerList">
                {players.map((player) => (
                  <Player player={player} number={player.num}/>
                ))}
            </div>
        </div>
    </div>
  )
}
