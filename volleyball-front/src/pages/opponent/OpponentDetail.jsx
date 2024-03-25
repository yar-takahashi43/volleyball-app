import React from 'react'
import { Opponents } from '../../dummyData'
import { Matches } from '../../dummyData';

export default function OpponentDetail() {
  
  const opp = Opponents.find(p => p.id === Number(1));

  // 試合データをmatchIdをキーとするオブジェクトに変換
  const MatchesById = Matches.reduce((acc, match) => {
    acc[match.matchId] = match;
    return acc;
  }, {});

  // 選ばれたOpponentの試合情報を取得
  const selectedMatches = Object.values(MatchesById).filter(match => match.opponentId === opp.id);

  // 選ばれたOpponentの試合情報を取得
  // const selectedMatches = Matches.filter(match => match.opponentId === opp.id);

  return (
    <div>
      {opp ? (
        <div>
          <h2>学校名　&nbsp; - &nbsp;</h2>
          <h2>{opp.name} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -　{opp.label}</h2>
          <p>勝敗: {selectedMatches[0].result}</p>
          {/* <p>スコア: {player.score.join(', ')}</p> */}
          {/* <p>サーブ: {player.serve.join(', ')}</p> */}
        </div>
      ) : (
        <p>選手が見つかりませんでした。</p>
      )}
    </div>
  );
}
