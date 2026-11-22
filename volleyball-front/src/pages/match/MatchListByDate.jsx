import React, { useEffect, useState } from 'react'
import Game from './Game'
import MatchByDateTop from './MatchByDateTop'
import { useParams } from 'react-router-dom'
import api from '../../Api'
import "../playerList/PlayerList.css"
import "../home/Container.css"

export default function MatchListByDate() {
  const [matches, setMatches] = useState([])
  const [opponentMap, setOpponentMap] = useState({})
  const { date } = useParams()

  useEffect(() => {
    /**
     * 指定日付の試合と対戦相手一覧を取得する。
     */
    const fetchMatchesAndOpponents = async () => {
      try {
        const [matchRes, opponentRes] = await Promise.all([
          api.get(`/match/matches/${date}`),
          api.get("/opponent/opponents"),
        ])

        const nextOpponentMap = {}
        ;(opponentRes.data || []).forEach(function (opponent) {
          nextOpponentMap[opponent._id] = opponent.label || opponent.name || "未設定"
        })

        setOpponentMap(nextOpponentMap)
        setMatches(matchRes.data || [])
      } catch (err) {
        console.log(err)
      }
    }

    fetchMatchesAndOpponents()
  }, [date])

  return (
    <div className="container" id="match-list-by-date-page">
      <div className="bar">
        <MatchByDateTop date={date} />
        <ul className="playerList" id="match-list-by-date">
          {matches.map((match) => (
            <Game
              key={match._id}
              match={match}
              date={date}
              opponentName={opponentMap[match.opponentId] || "未選択"}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
