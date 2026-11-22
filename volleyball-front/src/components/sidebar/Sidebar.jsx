import React, { useState } from 'react'
import "./Sidebar.css"
import Spike from "./Spike"
import Reception from "./Reception"
import Member from './Member'

export default function Sidebar({
  matchId, setId,
  // start, setStart, bench, setBench, 
  starPlayer, setStarPlayer, benchMem, setBenchMem, actions, pushScore
}) {

  // const [reception, setReception] = useState(match?.sets[0].reception || {
  //   A: 0,
  //   B: 0,
  //   C: 0,
  //   D: 0,
  // })

  // const [spike, setSpike] = useState(match?.sets[0].spike || [
  //   {playerId: null, spikeScore: 0},
  //   {playerId: null, spikeScore: 0},
  //   {playerId: null, spikeScore: 0},
  //   {playerId: null, spikeScore: 0},
  //   {playerId: null, spikeScore: 0}
  // ]);

  // // スパイク得点
  // const handleSpikePoint = (playerId) => {
  //   pushScore({
  //     matchId,
  //     setId,
  //     action: "spike",
  //     playerId,
  //     point: 1,
  //     timestamp: Date.now()
  //   });
  // };

  // // スパイク失点
  // const handleSpikeMiss = (playerId) => {
  //   pushScore({
  //     matchId,
  //     setId,
  //     action: "spike",
  //     playerId,
  //     point: -1,
  //     timestamp: Date.now()
  //   });
  // };

  
  return (
    <div className='Sidebar'>
        <Member 
            // member={match} 
            // matchId={matchId} 
            // setId={setId}
            // start={start}
            // setStart={setStart}
            // bench={bench}
            // setBench={setBench}
            start={starPlayer}
            setStart={setStarPlayer}
            bench={benchMem}
            setBench={setBenchMem}
            matchId={matchId}
            setId={setId}
        />
        <Reception 
            // reception={reception}
            // setReception={setReception}
            actions={actions}
            matchId={matchId} 
            setId={setId}
            pushScore={pushScore}
            />
        <Spike 
            actions={actions}
            // setSpike={setSpike}
            matchId={matchId} 
            setId={setId}
            start={starPlayer}
            bench={benchMem}
            pushScore={pushScore}
        />
    </div>
  )
}
