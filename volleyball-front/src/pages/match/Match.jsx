import React from 'react'
import Score from '../score/Score';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Match() {

    // ルーティングパラメータから試合のIDを取得
    const { id: matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState(null)
    const [start, setStart] = useState([])
    const [bench, setBench] = useState([])
    const [opponent, setOpponent] = useState([])

  useEffect(() => {
      const fetchMatch = async () => {
          try {
              const res = await axios.get(`/match/${matchId}`);
              const match = res.data
              const sets = await Promise.all(match.sets.map(async setId =>{
                const setRes = await axios.get(`/set/match/${matchId}/set/${setId}`)
                return setRes.data
              }))
              match.sets = sets
              setMatch(match)
              setSelectedSetId(sets[0]._id)
              setBench(sets[0].benchMem)
              setStart(sets[0].starPlayer)
          } catch (err) {
              console.error(err);
          }
      }
      fetchMatch()
  }, [matchId])

  useEffect(() => {
    const fetchOpponents = async() => {
      try {
        const res = await axios.get("/opponent/opponents")
        setOpponent(res.data)
      } catch(err) {
        console.error(err)
      }
    }
  fetchOpponents()
  }, [])
  

  return (
    <div>
        {/* {match && <Score match={match} setMatch={setMatch} id={matchId} />} */}
        {match && match.sets.map((set, index) => (
          <Score 
            key={index} 
            match={match}
            setMatch={setMatch} 
            id={matchId}
            selectedSetId={selectedSetId}
            setSelectedSetId={setSelectedSetId}
            start={start}
            setStart={setStart}
            bench={bench}
            setBench={setBench}
            opponent={opponent}
            setOpponent={setOpponent}
          />
          ))}
    </div>
  )
}
