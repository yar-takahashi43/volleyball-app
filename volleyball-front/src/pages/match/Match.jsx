import React from 'react'
import Score from '../score/Score';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../Api';

export default function Match() {

    // ルーティングパラメータから試合のIDを取得
    const { id: matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState(null)
    const [start, setStart] = useState([])
    const [bench, setBench] = useState([])
    const [opponent, setOpponent] = useState([])
    // const currentSet = match.sets[selectedSetId]

  useEffect(() => {
      const fetchMatch = async () => {
          try {
            // console.log("=== FETCH START ===");
              const res = await api.get(`/match/${matchId}`, {
                headers: {"Cache-Control": "no-cache"}
              });
              // console.log("RAW RESPONSE:", res.data);
              const match = res.data

      //         console.log("match.sets:", match.sets);
      // if (match.sets) {
      //   console.log("match.sets.length:", match.sets.length);
      //   console.log("match.sets[0]:", match.sets[0]);
      //   console.log("match.sets[0].benchMem:", match.sets[0]?.benchMem);
      //   console.log("match.sets[0].starPlayer:", match.sets[0]?.starPlayer);
      // } else {
      //   console.log("match.sets is undefined");
      // }

              // ★ sets が undefined の場合は state を更新しない
              if (!match.sets || match.sets.length === 0) {
                console.warn("sets がまだ取得できていないので待機:", match);
                return;
              }
              // const sets = await Promise.all(match.sets.map(async setObj =>{
              //   const setRes = await api.get(`/set/match/${matchId}/set/${setObj._id}`)
              //   return setRes.data
              // }))
              // match.sets = sets
              setMatch(match)
              // setSelectedSetId(sets[0]._id)
              // setBench(sets[0].benchMem)
              // setStart(sets[0].starPlayer)
              const firstSet = match.sets[0]
              setSelectedSetId(firstSet._id)
              setBench(firstSet.benchMem)
              setStart(firstSet.starPlayer)
              console.log(firstSet)
              console.log(firstSet.benchMem)
          } catch (err) {
              console.error(err);
          }
      }
      fetchMatch()
  }, [matchId])

  useEffect(() => {
    const fetchOpponents = async() => {
      try {
        const res = await api.get("/opponent/opponents")
        setOpponent(res.data)
      } catch(err) {
        console.error(err)
      }
    }
  fetchOpponents()
  }, [])


  // ① バッファ本体
  const [scoreBuffer, setScoreBuffer] = useState([]);

  // // ② タイマー管理（3秒ルール用）
  // const flushTimer = useRef(null);

  // ② flushBuffer：まとめてバックエンドへ送信
  const flushBuffer = async (buffer) => {
      if (!buffer || buffer.length === 0) return;   
      try {
          await api.post("/scores/batch", { scores: buffer });

          // Matchを再取得
          const res = await api.get(`/match/${matchId}`)
          const updatedMatch = res.data

          // Setを再取得
          // const sets = await Promise.all(
          //   updatedMatch.sets.map(async setObj => {
          //     const setRes = await api.get(`/set/match/${matchId}/set/${setObj._id}`)
          //     return setRes.data
          //   })
          // )

          // updatedMatch.sets = sets
          // setMatch(updatedMatch)

          // Memberも更新
          // const current = sets.find(s => s._id === selectedSetId)
          const current = updatedMatch.sets.find(s => s._id === selectedSetId)
          if (current) {
            setStart(current.starPlayer)
            setBench(current.benchMem)
          }

          console.log("Flushed:", buffer);
      } catch (err) {
          console.error("Flush failed:", err);
          // 失敗時はバッファに戻す（再送のため）
          setScoreBuffer((prev) => [...buffer, ...prev]);
      }
  };
    
  // ③ pushScore：UI から呼ばれる唯一の保存入口
  const pushScore = (action) => {
    setScoreBuffer((prev) => {
      const updated = [...prev, action];

      // 3件溜まったら即 flush
      if (updated.length >= 3) {
        flushBuffer([...updated]);
        return [];
      }

      // // タイマーが動いてなければ 5秒後に flush
      // if (!flushTimer.current) {
      //   flushTimer.current = setTimeout(() => {
      //     flushBuffer(updated);
      //     setScoreBuffer([]);
      //     flushTimer.current = null;
      //   }, 5000);
      // }
      return updated;
    });
  };

  // ④ 5秒ごとに自動 flush（残っていれば）
  useEffect(() => {
    const interval = setInterval(() => {
      if (scoreBuffer.length > 0) {
        flushBuffer(scoreBuffer);
        setScoreBuffer([]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [scoreBuffer]);

  // // ⑤ アンマウント時に flush
  // useEffect(() => {
  //   return () => {
  //     if (scoreBuffer.length > 0) {
  //       flushBuffer(scoreBuffer);
  //     }
  //   };
  // // 一度だけflush（依存配列を空にする）
  // }, []);
  
  if (!match) return <div>Loading...</div>;
  const currentSet = match.sets.find(s => s._id === selectedSetId);

  return (
    <div>
        {/* {match && <Score match={match} setMatch={setMatch} id={matchId} />} */}
        {/* {match && match.sets.map((set, index) => ( */}
        {match &&  (
          <Score 
            match={match}
            // setMatch={setMatch} 
            // id={matchId}
            selectedSetId={selectedSetId}
            setSelectedSetId={setSelectedSetId}
            start={start}
            setStart={setStart}
            bench={bench}
            setBench={setBench}
            opponent={opponent}
            setOpponent={setOpponent}
            pushScore={pushScore}
          />
          )}
    </div>
  )
}
