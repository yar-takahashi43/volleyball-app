import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Game from './Game'
import { useParams } from 'react-router-dom'

export default function MatchListByDate() {
  const [matches, setMatches] = useState([])
  const {date} = useParams()

  useEffect(() => {
    const fetchMatches = async () => {
      const res = await axios.get(`match/matches/${date}`)
      setMatches(res.data)
    }

    fetchMatches()
  }, [date])

  return (
    <div>
      {matches.map((match) => (
        <div key={match._id}>
          <Game match={match} id={match._id} date={match.date}/>
        </div>
      ))}
    </div>
  )
}
