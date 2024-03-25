import React from 'react'
import "../playerList/PlayerList.css"
import { Matches } from '../../dummyData'
import MatchListTop from './MatchListTop'
import "../home/Container.css"
import Game from './Game'

export default function PlayerList() {
  return (
    <div className="container">
      <div className='bar'>
        <MatchListTop />
            <div className="playerList">
                {Matches.map((match) => (
                    <Game match={match} id={match.id} date={match.date}/>
                ))}
            </div>
        </div>
    </div>
  )
}
