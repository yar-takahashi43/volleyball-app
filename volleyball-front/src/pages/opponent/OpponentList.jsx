import React from 'react'
import "./OpponentList.css"
import { Opponents } from '../../dummyData'
import Opponent from './Opponent'
import OpponentListTop from './OpponentListTop'
import "../home/Container.css"

export default function OpponentList() {
  return (
    <div className="container">
      <div className='bar'>
        <OpponentListTop />
            <div className="opponentList">
                {Opponents.map((opponent) => (
                  <Opponent opponent={opponent} number={opponent.num}/>
                ))}
            </div>
      </div>
    </div>
  )
}
