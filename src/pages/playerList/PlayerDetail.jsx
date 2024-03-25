import React from 'react';
// import { useParams } from 'react-router-dom';
import { Players } from '../../dummyData';

export default function PlayerDetail() {

  const player = Players.find(p => p.id === Number(1));

  return (
    <div>
      {player ? (
        <div>
          <h2>背番号　&nbsp; - &nbsp; 氏名 </h2>
          <h2>{player.num} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -　{player.name} ({player.nickname})</h2>
          <p>スパイク: {player.spike.join(', ')}</p>
          <p>スコア: {player.score.join(', ')}</p>
          <p>サーブ: {player.serve.join(', ')}</p>
        </div>
      ) : (
        <p>選手が見つかりませんでした。</p>
      )}
    </div>
  );
};
