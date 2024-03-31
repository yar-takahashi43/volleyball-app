import React, { useState, useEffect } from 'react'
import { Players } from '../../dummyData'
import "./Gamebar.css"
import GameHead from './GameHead'
import GameSubHead from "./GameSubHead"
import ScoreDetail from './ScoreDetail'
import axios from 'axios'

// ここのコンポーネントでセットのIdを決めて、それぞれのセット内容を記載するようにする。

export default function Gamebar({matchData, matchId}) {
  // 選手データをidで検索できるようにオブジェクトに変換
  const [playerMap, setPlayerMap] = useState({});

  useEffect(() => {
    const map = {};
    Players.forEach(player => {
      map[player.id] = player;
    });
    setPlayerMap(map);
  }, []);

  const [matchSet, setMatchSet] = useState(1)
  const [setDatas, setSetDatas] = useState(matchData.sets.map(set => set));
  const set1Data = matchData.sets.find(set => set.setId === 1);

  // カウントアップを実現するため
  const [myScore, setMyScore] = useState(set1Data.actions.map(item => ({...item, value:
    {...item.value}})));
    const [displayScores, setDisplayScores] = useState(Array(set1Data.actions.length).fill({my:0, opponent:0}));
    const [currentScores, setCurrentScores] = useState(Array(set1Data.actions.length).fill({my:0, opponent:0}));

    const incrementScore = (id, player) => {
      const newMyScore = myScore.map(item =>
        item.id === id ? { ...item, score: { ...item.score, [player]: item.score[player] + 1 } } : item
      );
      setMyScore(newMyScore);

      const newTotalScore = newMyScore.reduce((total, item) => (
        {my: total.my + item.score.my, 
          opponent: total.opponent + item.score.opponent}), {my: 0, opponent: 0});
    
      const newDisplayScores = displayScores.map((item, index) =>
        index === id - 1 ? { ...item, [player]: newMyScore[id - 1].score[player] + 1 } : item
      );
      
      setDisplayScores(newDisplayScores);
    
      // 現在の合計スコアを表示する。
      const newCurrentScores = currentScores.map((item, index) =>
        index === id - 1 ? { ...item, [player]: newTotalScore[player] - newMyScore[id - 1].score[player] + 1 } : item
      );
      setCurrentScores(newCurrentScores);

      // スコアが5の倍数になったら保存
      if (newMyScore[id - 1].score[player] % 5 === 0) {
        saveScore(id, player, newMyScore[id - 1].score[player]);
      }
    };
  
  const decrementScore = (id, player) => {
      const newMyScore = myScore.map(item =>
        item.id === id && item.score[player] > 0 ? { ...item, score: { ...item.score, [player]: item.score[player] - 1 } } : item
      );
      setMyScore(newMyScore);
    
      const newTotalScore = newMyScore.reduce((total, item) => (
        {my: total.my + item.score.my, 
          opponent: total.opponent + item.score.opponent}), {my: 0, opponent: 0});
    
      const newDisplayScores = displayScores.map((item, index) =>
        index === id - 1 ? { ...item, [player]: newMyScore[id - 1].score[player] - 1 } : item
      );
      setDisplayScores(newDisplayScores);
    
      // 現在の合計スコアを表示する。
      const newCurrentScores = currentScores.map((item, index) =>
        index === id - 1 ? { ...item, [player]: newTotalScore[player] - newMyScore[id - 1].score[player] } : item
      );
      setCurrentScores(newCurrentScores);
        
      // スコアが5の倍数になったら保存
      if (newMyScore[id - 1].score[player] % 5 === 0) {
        saveScore(id, player, newMyScore[id - 1].score[player]);
      }
    };

  const saveScore = async (id, player, score) => {
      // ここでバックエンドにリクエストを送信してスコアを保存します。
      // この部分は、使用しているフレームワークやライブラリによります。
      // 例えば、axiosを使用している場合、以下のようになります：
    
      // const response = await axios.put(`/api/sets/${id}`, {
      //   team: player,
      //   change: score
      // });
    
      // 必要に応じてレスポンスを処理します。
    };

  return (
    <div className="gamebar">
      <div className="gameTitle">
        <GameHead />
        <GameSubHead />
      </div>
        {myScore.map((set, index) =>(
          <ScoreDetail
            key={set.id}
            playerMap={playerMap}
            myScore={set} 
            incrementScore={(player) => incrementScore(set.id, player)} 
            decrementScore={(player) => decrementScore(set.id, player)}
            currentScores={currentScores}
            setCurrentScores={setCurrentScores}
            currentMyScores={currentScores[index].my} 
            currentOpponentScores={currentScores[index].opponent} 
            setSetData={(newData) => {
              setSetDatas(prevSetDatas => {
                const newSetDatas = [...prevSetDatas];
                newSetDatas[index] = newData;
                return newSetDatas;
              });
            }}
          />
        ))}
    </div>
  )
}
