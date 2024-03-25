import React from 'react'
import "../home/Container.css"
import PlayerDetailsTop from './PlayerDetailsTop.jsx';
import PlayerDetail from './PlayerDetail.jsx';
import "./PlayerDetails.css"

export default function PlayerDetails() {
  return (
    <div className="details">
      <div className='container'>
        <PlayerDetailsTop />
      </div>
        <PlayerDetail />
    </div>
  )
}
