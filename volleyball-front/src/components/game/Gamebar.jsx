import React, { useState, useEffect } from 'react'
import { Players } from '../../dummyData'
import "./Gamebar.css"
import GameHead from './GameHead'
import GameSubHead from "./GameSubHead"
import ScoreDetail from './ScoreDetail'

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

//   const incrementScore = (id, player) => {
//     setMyScore(prevScore => prevScore.map(item => 
//         item.id === id ? {...item, value: {...item.value, [player]: item.value[player] + 1}} : item
//     ));
//     setDisplayScores(prevDisplayScores => prevDisplayScores.map((item, index) => 
//         index === id - 1 ? {...item, [player]: myScore[id - 1].value[player] + 1} : item
//     ));
//     // 現在の合計スコアを表示する。
//     setCurrentScores(prevDisplayScores => prevDisplayScores.map((item, index) => 
//       index === id - 1 ? {...item, [player]: totalScore[player] - myScore[id -1].value[player] +1}: item
//     ));
//   };

//   const totalScore = myScore.reduce((total, item) => (
//     {my: total.my + item.value.my, 
//       opponent: total.opponent + item.value.opponent}), {my: 0, opponent: 0});  

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
  };

const decrementScore = (id, player) => {
    const newMyScore = myScore.map(item =>
      item.id === id ? { ...item, score: { ...item.score, [player]: item.score[player] - 1 } } : item
    );
    setMyScore(newMyScore);
  
    const newTotalScore = newMyScore.reduce((total, item) => (
      {my: total.player + item.score.player, 
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
  };  

  const myScoreChange = (id, incrementPlayer, decrementPlayer) => {
    const newMyScore = myScore.map(item =>
      item.id === id ? { ...item, score: { ...item.score, [incrementPlayer]: item.score[incrementPlayer] + 1, [decrementPlayer]: item.score[decrementPlayer] - 1 } } : item
    );
    setMyScore(newMyScore);
  
    const newTotalScore = newMyScore.reduce((total, item) => (
      {my: total.my + item.score.my, 
        opponent: total.opponent + item.score.opponent}), {my: 0, opponent: 0});
  
    const newDisplayScores = displayScores.map((item, index) =>
      index === id - 1 ? { ...item, [incrementPlayer]: newMyScore[id - 1].score[incrementPlayer] + 1, [decrementPlayer]: newMyScore[id - 1].score[decrementPlayer] - 1 } : item
    );
    setDisplayScores(newDisplayScores);
  
    // 現在の合計スコアを表示する。
    const newCurrentScores = currentScores.map((item, index) =>
      index === id - 1 ? { ...item, [incrementPlayer]: newTotalScore[incrementPlayer] - newMyScore[id - 1].score[incrementPlayer] + 1, [decrementPlayer]: newTotalScore[decrementPlayer] - newMyScore[id - 1].score[decrementPlayer] - 1 } : item
    );
    setCurrentScores(newCurrentScores);
  };
  
  

//   const times = Array.from({ length: 10 }, (_, i) => i + 1);

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
            myScoreChange={(player) => myScoreChange(set.id, player, player)}
            displayMyScore={displayScores[index].my} 
            displayOpponentScore={displayScores[index].opponent} 
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
