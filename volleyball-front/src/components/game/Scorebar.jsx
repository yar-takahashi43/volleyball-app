import React, { useState, useEffect } from 'react'
import "./Scorebar.css"
import GameHead from './GameHead'
import GameSubHead from "./GameSubHead"
import ScoreDetail from './ScoreDetail'
import api from '../../Api';

// ここのコンポーネントでセットのIdを決めて、それぞれのセット内容を記載するようにする。
export default function Scorebar({ match, setId, start, bench, pushScore }) {

  const [selectedSet, setSelectedSet] = useState(null);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (match && setId) {
      const found = match.sets.find(s => s._id === setId);
      setSelectedSet(found);

      if (found?.actions) {
        setActions(found.actions)
      }
    }
  }, [match, setId]);

  const updateAction = (actionId, newValues) => {
    setActions(prev =>
      prev.map(a =>
        a._id === actionId ? { ...a, ...newValues } : a
      )
    );
  };

  const toggleAce = (actionId) => {
    setActions(prev =>
      prev.map(a =>{
        if (a._id !== actionId) return a

        const newAce = !a.isAce
        return {
          ...a,
          isAce: newAce,
          isMiss: newAce ? false : a.isMiss
        }
      })
    );
  };

  const toggleMiss = (actionId) => {
    setActions(prev =>
      prev.map(a =>{
        if (a._id !== actionId) return a

        const newMiss = !a.isMiss
        return {
          ...a,
          isMiss: newMiss,
          isAce: newMiss ? false : a.isAce
        }
      })
    );
  };

  // 行の動的追加関数
  const addNewAction = () => {
    setActions(prev => [
      ...prev,
      {
        _id: crypto.randomUUID(),
        servePlayer: null,
        scorePlayer: null,
        attack: null,
        lose: null,
        isAce: false,
        isMiss: false,
        myScore: 0,
        opponentScore: 0
      }
    ]);
  };

  if (!selectedSet) return <div className="gamebar">セットが選択されていません</div>;

//   // 選手データをidで検索できるようにオブジェクトに変換
//   const [playerMap, setPlayerMap] = useState({});
//   const [selectedSet, setSelectedSet] = useState(null)
//   const [players, setPlayers] = useState([])
//   const activePlayers = [...start, ...bench]; // 試合に出ている選手だけ

// 　useEffect(() => {
//     const fetchPlayers = async() => {
//       try {
//         const res = await api.get("player/players")
//         setPlayers(res.data)
//       } catch(err) {
//         console.error(err)
//       }
//     }
//     fetchPlayers()
//   }, [])
  
//   useEffect(() => {
//     const map = {};
//     players.forEach(player => {
//       map[player._id] = player;
//     });
//     setPlayerMap(map);
//   }, [players]);

//   useEffect(() => {
//     if (match && setId) {
//       setSelectedSet(match.sets.find(set => set._id === setId))
//     }
//   }, [match, setId])

//   const [myScore, setMyScore] = useState([])
//   const [displayScores, setDisplayScores] = useState([])
//   const [currentScores, setCurrentScores] = useState([])

//   useEffect(() => {
//     if(selectedSet) {
//       setMyScore(selectedSet.actions.map(item => ({...item, value:{...item.value}})))
//       setDisplayScores(Array(selectedSet.actions.length).fill({my:0, opponent:0}))
//       setCurrentScores(Array(selectedSet.actions.length).fill({my:0, opponent:0}))
//     }
//   }, [selectedSet])

//     const incrementScore = (id, player) => {
//       const newMyScore = myScore.map(item =>
//         item._id === id ? { ...item, score: { ...item.score, [player]: item.score[player] + 1 } } : item
//       );
//       setMyScore(newMyScore);

//       const newTotalScore = newMyScore.reduce((total, item) => (
//         {my: total.my + item.score.my, 
//           opponent: total.opponent + item.score.opponent}), {my: 0, opponent: 0});
    
//       const newDisplayScores = displayScores.map((item, index) =>
//         index === id - 1 ? { ...item, [player]: newMyScore[id - 1].score[player] + 1 } : item
//       );
      
//       setDisplayScores(newDisplayScores);
    
//       // 現在の合計スコアを表示する。
//       const newCurrentScores = currentScores.map((item, index) =>
//         index === id - 1 ? { ...item, [player]: newTotalScore[player] - newMyScore[id - 1].score[player] + 1 } : item
//       );
//       setCurrentScores(newCurrentScores);

//       // スコアが5の倍数になったら保存
//       if (newMyScore[id - 1].score[player] % 5 === 0) {
//         const actionId = uuidv4()
//         saveScore(actionId, player, newMyScore[id - 1].score[player]);
//       }
//     };
  
//   const decrementScore = (id, player) => {
//       const newMyScore = myScore.map(item =>
//         item._id === id && item.score[player] > 0 ? { ...item, score: { ...item.score, [player]: item.score[player] - 1 } } : item
//       );
//       setMyScore(newMyScore);
    
//       const newTotalScore = newMyScore.reduce((total, item) => (
//         {my: total.my + item.score.my, 
//           opponent: total.opponent + item.score.opponent}), {my: 0, opponent: 0});
    
//       const newDisplayScores = displayScores.map((item, index) =>
//         index === id - 1 ? { ...item, [player]: newMyScore[id - 1].score[player] - 1 } : item
//       );
//       setDisplayScores(newDisplayScores);
    
//       // 現在の合計スコアを表示する。
//       const newCurrentScores = currentScores.map((item, index) =>
//         index === id - 1 ? { ...item, [player]: newTotalScore[player] - newMyScore[id - 1].score[player] } : item
//       );
//       setCurrentScores(newCurrentScores);
        
//       // スコアが5の倍数になったら保存
//       if (newMyScore[id - 1].score[player] % 5 === 0) {
//         const actionId = uuidv4()
//         saveScore(id, player, newMyScore[id - 1].score[player]);
//       }
//     }

//   const saveScore = async (id, player, score) => {
//       const response = await api.put(`sets/${id}`, {
//         team: player,
//         change: score
//       });
    
//       // 必要に応じてレスポンスを処理します。
//     };

//     // actionsに関する設定
//     const [actions, setActions] = useState([])
//     const handleNewAction = (newAction) => {
//       setActions([...actions, newAction])
//     }
  return (
    <div className="gamebar">
      {/* 1段目（大ヘッダー） */}
      <div className="row headerRow">
        <div className="cell serveHeader">サーブ</div>
        <div className="cell reasonHeader">決定要因</div>
        <div className="cell scoreHeader">スコア</div>
      </div>

      {/* 2段目（小ヘッダー） */}
      <div className="row subHeaderRow">
        <div className="cell serveSub">
          <div>背番号</div>
          <div>エース</div>
          <div>ミス</div>
        </div>

        <div className="cell reasonSub">
          <div>背番号</div>
          <div>得点</div>
          <div>失点</div>
        </div>

        <div className="cell scoreSub">
          <div>自</div>
          <div>相</div>
        </div>
      </div>
        {actions.map((action, index) =>(
          <ScoreDetail
            key={action._id}
            action={action}
            index={index}
            actionsLength={actions.length}
            start = {start}
            bench = {bench}
            updateAction={updateAction}
            toggleAce={toggleAce}
            toggleMiss={toggleMiss}
            addNewAction={addNewAction}
          />
        ))}
    </div>
  )
}
