import React, { useState } from 'react'
import "./Score.css"
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
import { Opponents, Players, Matches } from '../../dummyData'
import Gamebar from '../../components/game/Gamebar'

export default function Score({match, setMatch}) {
    // 相手データを保持する。
    const [opponent, setOpponent] = useState(Opponents)
    
    // 試合IDを定める。
    const [matchId, setMatchId] = useState(1)
    const matchData = matchId ? match.find(match => match.matchId === matchId) : null
    // 試合のデータを使用してTableコンポーネントをレンダリング
    //   return <Table actions={matchData.sets[0].actions} />;

    console.log(Array.isArray(Opponents));
    console.log(Array.isArray(opponent));

  return (
    <>
        <Topbar opponent={opponent} key={opponent.id} setOpponent={setOpponent} />
        <div className="scoreContainer">
            <Sidebar 
                match={matchData}
                key={matchId.id} 
                // playerData={getPlayerData}
                />
            <Gamebar 
                matchData={matchData}
                key={matchId.id}
            />
        </div>
    </>
  )
}
