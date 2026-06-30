import React, { useState, useEffect, useParams,useRef } from 'react'
import "./Score.css"
import Topbar from '../../components/topbar/Topbar'
import Sidebar from '../../components/sidebar/Sidebar'
// import { Opponents} from '../../dummyData'
import { Players, Matches } from '../../dummyData'
import Scorebar from '../../components/game/Scorebar'
import api from '../../Api';

export default function Score({
    // match, setMatch, id, 
    selectedSetId, setSelectedSetId,
    match, setId,
    start, setStart,bench, setBench,
    opponent, setOpponent, pushScore
}) {
    // const [opponent, setOpponent] = useState([])
    // const [selectedSet, setSelectedSet] = useState(null)

    // const { matchId, setId } = useParams();
    // const [ match, setMatch] = useState(null);
    // const [ currentSet, setCurrentSet] = useState(null);

    // // UI 用の state
    // const [starPlayer, setStarPlayer] = useState([]);
    // const [benchMem, setBenchMem] = useState([]);


    // useEffect(() => {
    //   if (match && selectedSetId) {
    //       setSelectedSet(match.sets.find(set => set._id === selectedSetId))
    //   }
    // }, [match, selectedSetId])

    // // 試合データ取得
    // useEffect(() => {
    //     const fetchMatch = async() => {
    //         const res = await api.get(`/match/${matchId}`)
    //         setCurrentSet(res.data)
    //     }
    //     fetchMatch()
    // }, [matchId])
    
    // // セットデータ取得
    // useEffect(() => {
    //     const fetchSet = async() => {
    //         const res = await api.get(`/set/match/${matchId}/set/${setId}`)
    //         setCurrentSet(res.data)

    //         // UI用のStateに反映
    //         setStarPlayer(res.data.starPlayer)
    //         setBenchMem(res.data.benchMem)
    //     }
    //     fetchSet()
    // },[matchId, setId])

    // 親から渡された match から currentSet を決定
    const currentSet = match.sets.find(s => s._id === selectedSetId);

    if (!currentSet) return <div>Loading...</div>;

  return (
    <>
        <Topbar 
            match={match} 
            opponent={opponent} 
            key={opponent ? opponent.id : 'default-key'} 
            setOpponent={setOpponent}
            setId={selectedSetId}
            setSetId={setSelectedSetId}
            starPlayer={start}
            benchMem={bench}
            setCurrentSetId={setSelectedSetId}
        />
        <div className="scoreContainer">
            <Sidebar 
                // match={match}
                matchId={match ? match._id : 'default-key'}
                setId={selectedSetId}
                starPlayer={start}
                setStarPlayer={setStart}
                benchMem={bench}
                setBenchMem={setBench}
                actions={currentSet.actions}
                pushScore={pushScore}
            />
            <Scorebar 
                // match={match}
                matchId={match ? match._id : 'default-key'}
                setId={selectedSetId}
                // start={start}
                // setStart={setStart}
                // bench={bench}
                // setBench={setBench}
                // starPlayer={current}
                starPlayer={start}
                setStarPlayer={setStart}
                benchMem={bench}
                setBenchMem={setBench}
                actions={currentSet.actions}
                pushScore={pushScore}
            />
        </div>
    </>
  )
}
