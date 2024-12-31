import React, { useState } from 'react'
import "./Sidebar.css"
import {Players, Users} from "../../dummyData"
import Spike from "../evaluation/Spike"
import Reception from "../evaluation/Reception"
import Member from '../member/Member'


export default function Sidebar({
  match, matchId, setId,
  start, setStart, bench, setBench
}) {

    const [reception, setReception] = useState(match?.sets[0].reception || {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    })

    const [spike, setSpike] = useState(match?.sets[0].spike || [
      {playerId: null, spikeScore: 0},
      {playerId: null, spikeScore: 0},
      {playerId: null, spikeScore: 0},
      {playerId: null, spikeScore: 0},
      {playerId: null, spikeScore: 0}
  ]);
  
console.log(spike)
  return (
    <div className='Sidebar'>
        <Member 
            member={match} 
            matchId={matchId} 
            setId={setId}
            start={start}
            setStart={setStart}
            bench={bench}
            setBench={setBench}
        />
        <Reception 
            reception={reception}
            setReception={setReception}
            matchId={matchId} 
            setId={setId}
        />
        <Spike 
            spike={spike}
            setSpike={setSpike}
            matchId={matchId} 
            setId={setId}
            start={start}
            bench={bench}
        />
    </div>
  )
}
