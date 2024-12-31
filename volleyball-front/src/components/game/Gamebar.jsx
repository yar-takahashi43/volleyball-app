import React, { useState, useEffect } from 'react'
import { Players } from '../../dummyData'
import "./Gamebar.css"
import GameHead from './GameHead'
import GameSubHead from "./GameSubHead"
import ScoreDetail from './ScoreDetail'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

// ここのコンポーネントでセットのIdを決めて、それぞれのセット内容を記載するようにする。

export default function Gamebar({
  match, matchId, setId, setSelectedSetId,
}) {
  // 選手データをidで検索できるようにオブジェクトに変換
  const [playerMap, setPlayerMap] = useState({});
  const [selectedSet, setSelectedSet] = useState(null)

  useEffect(() => {
    const map = {};
    Players.forEach(player => {
      map[player.id] = player;
    });
    setPlayerMap(map);
  }, []);

  useEffect(() => {
    if (match && setId) {
      setSelectedSet(match.sets.find(set => set._id === setId))
    }
  }, [match, setId])

  // const [matchSet, setMatchSet] = useState(1)
  // const [setDatas, setSetDatas] = useState(match.sets.map(set => set));
  // const set1Data = match.sets.find(set => set.setId === 1);

  // カウントアップを実現するため
  // const [myScore, setMyScore] = useState(set1Data.actions.map(item => ({...item, value:
  //   {...item.value}})));
  //   const [displayScores, setDisplayScores] = useState(Array(set1Data.actions.length).fill({my:0, opponent:0}));
  //   const [currentScores, setCurrentScores] = useState(Array(set1Data.actions.length).fill({my:0, opponent:0}));

  const [myScore, setMyScore] = useState([])
  const [displayScores, setDisplayScores] = useState([])
  const [currentScores, setCurrentScores] = useState([])

  useEffect(() => {
    if(selectedSet) {
      setMyScore(selectedSet.actions.map(item => ({...item, value:{...item.value}})))
      setDisplayScores(Array(selectedSet.actions.length).fill({my:0, opponent:0}))
      setCurrentScores(Array(selectedSet.actions.length).fill({my:0, opponent:0}))
    }
  }, [selectedSet])

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
        const actionId = uuidv4()
        saveScore(actionId, player, newMyScore[id - 1].score[player]);
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
        const actionId = uuidv4()
        saveScore(id, player, newMyScore[id - 1].score[player]);
      }
    }

  const saveScore = async (id, player, score) => {
      const response = await axios.put(`/api/sets/${id}`, {
        team: player,
        change: score
      });
    
      // 必要に応じてレスポンスを処理します。
    };

    // actionsに関する設定
    const [actions, setActions] = useState([])
    const handleNewAction = (newAction) => {
      setActions([...actions, newAction])
    }
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
            onNewAction={handleNewAction}
            myScore={set} 
            incrementScore={(player) => incrementScore(set.id, player)} 
            decrementScore={(player) => decrementScore(set.id, player)}
            currentScores={currentScores}
            setCurrentScores={setCurrentScores}
            currentMyScores={currentScores[index].my} 
            currentOpponentScores={currentScores[index].opponent} 
          />
        ))}
    </div>
  )
}
