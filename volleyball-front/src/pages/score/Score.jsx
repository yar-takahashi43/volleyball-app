import React, { useState, useEffect } from 'react'
import "./Score.css"
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
// import { Opponents} from '../../dummyData'
import { Players, Matches } from '../../dummyData'
import Gamebar from '../../components/game/Gamebar'
import api from '../../Api';

export default function Score({
    match, setMatch, 
    id, selectedSetId, setSelectedSetId,
    start, setStart,
    bench, setBench,
    opponent, setOpponent
}) {
    // const [opponent, setOpponent] = useState([])
    const [selectedSet, setSelectedSet] = useState(null)

    // useEffect(() => {
    //     const fetchOpponents = async() => {
    //       try {
    //         const res = await api.get("/opponent/opponents")
    //         setOpponent(res.data)
    //       } catch(err) {
    //         console.error(err)
    //       }
    //     }
    //   fetchOpponents()
    // }, [])

    useEffect(() => {
      if (match && selectedSetId) {
          setSelectedSet(match.sets.find(set => set._id === selectedSetId))
      }
    }, [match, selectedSetId])

  return (
    <>
        <Topbar 
            match={match} 
            opponent={opponent} 
            key={opponent ? opponent.id : 'default-key'} 
            setOpponent={setOpponent}
            setId={selectedSetId}
            setSetId={setSelectedSetId}
        />
        <div className="scoreContainer">
            <Sidebar 
                match={match}
                matchId={match ? match._id : 'default-key'}
                setId={selectedSetId}
                start={start}
                setStart={setStart}
                bench={bench}
                setBench={setBench}
            />
            <Gamebar 
                match={match}
                matchId={match ? match._id : 'default-key'}
                setId={selectedSetId}
                start={start}
                setStart={setStart}
                bench={bench}
                setBench={setBench}
            />
        </div>
    </>
  )
}
