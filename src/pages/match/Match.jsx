import React from 'react'
import Score from '../score/Score';
import { Matches } from '../../dummyData';
import { useState } from 'react';

export default function () {

    // Matchesテーブルから試合のデータを取得
    const [match, setMatch] = useState(Matches)

    // ↓のコードはおそらくScore.jsxの一個外側でスコア全体のことを動かすものとして定義する。
    // const updateMatches = match.map(m => m.matchId === matchId ? newData :m)
    // setMatch(updateMatches)

  return (
    <div>
        <Score 
            match={match}
            setMatch={setMatch}
        />
    </div>
  )
}
