import React, {useState, useEffect} from 'react'
import "./OpponentList.css"
import Opponent from './Opponent'
import OpponentListTop from './OpponentListTop'
import "../home/Container.css"
import axios from 'axios'

export default function OpponentList() {
  const[opponents, setOpponents] = useState([])

  useEffect(() => {
    const fetchOpponents = async() => {
      try {
        const res = await axios.get("opponent/opponents")
        setOpponents(res.data)
      } catch(err) {
        console.error(err)
      }
    }
  fetchOpponents()
}, [])
  return (
    <div className="container">
      <div className='bar'>
        <OpponentListTop />
            <div className="opponentList">
                {opponents.map((opponent) => (
                  <Opponent opponent={opponent} number={opponent.num}/>
                ))}
            </div>
      </div>
    </div>
  )
}
