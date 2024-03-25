import React from 'react'
import "./PlayerList.css"
import { Players } from '../../dummyData'
import Player from '../../components/player/Player'
import PlayerListTop from './PlayerListTop'
import "../home/Container.css"

export default function PlayerList() {
  return (
    <div className="container">
      <div className='bar'>
        <PlayerListTop />
            <div className="playerList">
                {Players.map((player) => (
                  <Player player={player} number={player.num}/>
                ))}
            </div>
        </div>
    </div>
  )
}
