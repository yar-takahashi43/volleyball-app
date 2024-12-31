import React, { useEffect, useState } from 'react'
import "../playerList/PlayerList.css"
import MatchListTop from './MatchListTop'
import "../home/Container.css"
import axios from 'axios'
import { Link } from 'react-router-dom'

export default function MatchList() {

  const [dates, setDates] = useState([])

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await axios.get('match/matches')
        setDates(Object.keys(res.data))
      } catch (err) {
        console.log(err)
      }
    }
    fetchDates()
  }, [])

  console.log(dates)

  return (
    <div className="container">
      <div className='bar'>
        <MatchListTop />
            <div className="playerList">
                {dates.map((date) => (
                    <Link to={`/matches/${date}`}>
                      <div
                        key={date}
                        // onClick={() => fetchMatches(date)}
                      >{date}</div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  )
}
