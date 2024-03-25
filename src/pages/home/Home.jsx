import React, { useState } from 'react'
import "./Home.css"
import Topbar from '../../components/topbar/Topbar'
import Sidebar from "../../components/sidebar/Sidebar"
// import Menu from '../menu/Menu.jsx'
import PlayerList from '../playerList/PlayerList.jsx'
import RegisterOpponent from '../opponent/RegisterOpponent.jsx'
import OpponentList from '../opponent/OpponentList.jsx'
// import Opponent from '../opponent/Opponent.jsx'
import { Opponents } from '../../dummyData'
import Register from '../playerList/RegisterPlayer.jsx'
import OpponentDetails from '../opponent/OpponentDetails.jsx'
import PlayerDetails from '../playerList/PlayerDetails.jsx'
import MatchList from '../match/MatchList.jsx'
// import { Link } from 'react-router-dom'

export default function Home() {

  const [opponent, setOpponent] = useState(Opponents)

  return (
    <>  
        <div className="homeContainer">
            {/* <Menu /> */}
            {/* <PlayerList />
            <PlayerDetails />
            <Register />
            <RegisterOpponent/>
            <OpponentList/>
            <OpponentDetails />
            <MatchList /> */}
        </div>
    </>
  )
}