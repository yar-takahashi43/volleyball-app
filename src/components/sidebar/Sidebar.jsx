import React, { useState } from 'react'
import "./Sidebar.css"
import {Players, Users} from "../../dummyData"
import Spike from "../evaluation/Spike"
import Reception from "../evaluation/Reception"
import Member from '../member/Member'


export default function Sidebar({match}) {

    // レセプションのカウント
    const [addReception, setAddReception] = useState(match.reception.receptionNum)
    const [minusReception, setMinusReception] = useState(match.reception.receptionNum)

    // スパイクのカウント
    const [addSpike, setAddSpike] = useState(match.spike.spikeScore)
    const [minusSpike, setMinusSpike] = useState(match.spike.spikeScore)

  return (
    <div className='Sidebar'>
        <Member member={match}/>
        <Reception 
            reception={match.reception}
            addReception={addReception}
            setAddReception={setAddReception}
            minusReception={minusReception}
            setMinusReception={setMinusReception}
        />
        <Spike 
            spike={match.spike}
            addSpike={addSpike}
            setAddSpike={setAddSpike}
            minusSpike={minusSpike}
            setMinusSpike={setMinusSpike}
        />
    </div>
  )
}
