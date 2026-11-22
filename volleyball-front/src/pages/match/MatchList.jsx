import React, { useEffect, useState } from 'react'
import "../playerList/PlayerList.css"
import MatchListTop from './MatchListTop'
import "../home/Container.css"
import { Link } from 'react-router-dom'
import api from '../../Api'

export default function MatchList() {

  const [dates, setDates] = useState([])

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await api.get('/match/matches')
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
                    <Link key={date} id={`match-date-link-${date}`} to={`/matches/${date}`}>
                      <div>{date}</div>
                    </Link>
                ))}
            </div>
        </div>
    </div>
  )
}
