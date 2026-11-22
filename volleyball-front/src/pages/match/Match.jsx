import React from 'react'
import Score from '../score/Score';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../Api';
import { mergeSetIntoMatch } from '../../utils/mergeSetIntoMatch';
import { normalizeMembers } from '../../utils/normalizeMember';

/**
 * UI / buffer 用の action から batch 送信用フィールドだけを取り出す。
 */
function toBatchScore(action) {
  const score = {
    action: action.action,
    playerId: action.playerId,
    point: action.point,
    timestamp: action.timestamp
  };

  if (action.result !== undefined) {
    score.result = action.result;
  }

  if (action.reason !== undefined) {
    score.reason = action.reason;
  }

  return score;
}

/**
 * 楽観的に append した actions を、失敗した buffer 分だけ取り除く。
 */
function rollbackOptimisticActions(match, setId, failedBuffer) {
  if (!match || !setId || !failedBuffer || failedBuffer.length === 0) {
    return match;
  }

  const failedTimestamps = failedBuffer.map(function (item) {
    return item.timestamp;
  });

  const updatedSets = match.sets.map(function (setItem) {
    if (setItem._id !== setId) {
      return setItem;
    }

    const nextActions = [...(setItem.actions || [])];

    failedTimestamps.forEach(function (timestamp) {
      const removeIndex = nextActions.map(function (entry) {
        return entry.timestamp;
      }).lastIndexOf(timestamp);

      if (removeIndex !== -1) {
        nextActions.splice(removeIndex, 1);
      }
    });

    return {
      ...setItem,
      actions: nextActions
    };
  });

  return {
    ...match,
    sets: updatedSets
  };
}

/**
 * ローカル match の該当 set.actions に action を append する。
 */
function appendActionToMatch(match, setId, action) {
  if (!match || !setId) {
    return match;
  }

  const scoreToAppend = toBatchScore(action);

  const updatedSets = match.sets.map(function (setItem) {
    if (setItem._id !== setId) {
      return setItem;
    }

    return {
      ...setItem,
      actions: [...(setItem.actions || []), scoreToAppend]
    };
  });

  return {
    ...match,
    sets: updatedSets
  };
}

/**
 * セットのスタメン・ベンチを Sidebar 用 state に反映する。
 */
function applySetToSidebar(setItem, setStart, setBench) {
  if (!setItem) {
    return;
  }

  setStart(normalizeMembers(setItem.starPlayer));
  setBench(normalizeMembers(setItem.benchMem));
}

/**
 * match.sets から setId に一致するセットを探す。
 */
function findSetById(match, setId) {
  if (!match || !match.sets || !setId) {
    return null;
  }

  return match.sets.find(function (setItem) {
    return String(setItem._id) === String(setId);
  }) || null;
}

export default function Match() {

    // ルーティングパラメータから試合のIDを取得
    const { id: matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [selectedSetId, setSelectedSetId] = useState(null)
    const [start, setStart] = useState([])
    const [bench, setBench] = useState([])
    const [opponent, setOpponent] = useState([])
    const [, setScoreBuffer] = useState([]);
    const isFlushingRef = useRef(false);

  useEffect(() => {
      const fetchMatch = async () => {
          try {
              const res = await api.get(`/match/${matchId}`, {
                headers: {"Cache-Control": "no-cache"}
              });
              const match = res.data

              // ★ sets が undefined の場合は state を更新しない
              if (!match.sets || match.sets.length === 0) {
                console.warn("sets がまだ取得できていないので待機:", match);
                return;
              }
              setMatch(match)

              // リロード時は currentSetId を優先（なければ先頭セット）
              const initialSet =
                findSetById(match, match.currentSetId) || match.sets[0];
              setSelectedSetId(initialSet._id)
              applySetToSidebar(initialSet, setStart, setBench)
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

  /**
   * 表示中セットを切り替える。サーバーの最新 set を取り込み、currentSetId を保存する。
   */
  const selectSetById = async (setId) => {
    if (!matchId || !setId) {
      return;
    }

    try {
      await api.put(`/match/${matchId}`, {
        currentSetId: setId
      });

      const setRes = await api.get(`/set/match/${matchId}/set/${setId}`);
      const serverSet = setRes.data;

      setMatch(function (prevMatch) {
        const merged = mergeSetIntoMatch(prevMatch, serverSet);
        return {
          ...merged,
          currentSetId: setId
        };
      });
      setSelectedSetId(setId);
      applySetToSidebar(serverSet, setStart, setBench);
    } catch (err) {
      console.error("Failed to select set:", err);
    }
  };

  /**
   * 新しいセットを作成し、そのセットへ切り替える。
   * スタメンは空で始まり、セットごとに選び直す。
   */
  const createNextSet = async () => {
    if (!matchId) {
      return;
    }

    try {
      const createRes = await api.post(`/set/match/${matchId}`, {});
      const newSetId = createRes.data.setId;

      if (!newSetId) {
        console.error("新セットの setId が取得できませんでした。");
        return;
      }

      const matchRes = await api.get(`/match/${matchId}`, {
        headers: { "Cache-Control": "no-cache" }
      });
      const updatedMatch = matchRes.data;

      if (!updatedMatch.sets || updatedMatch.sets.length === 0) {
        console.warn("新セット作成後の match.sets が空です:", updatedMatch);
        return;
      }

      setMatch(updatedMatch);
      setSelectedSetId(newSetId);

      const newSet = findSetById(updatedMatch, newSetId);
      applySetToSidebar(newSet, setStart, setBench);
    } catch (err) {
      console.error("Failed to create next set:", err);
    }
  };

  /**
   * 次のセットへ移動する。最終セットなら新規作成する。
   */
  const selectNextSet = async () => {
    if (!match || !match.sets || !selectedSetId) {
      return;
    }

    const currentIndex = match.sets.findIndex(function (setItem) {
      return String(setItem._id) === String(selectedSetId);
    });

    if (currentIndex < 0) {
      return;
    }

    if (currentIndex < match.sets.length - 1) {
      const nextSet = match.sets[currentIndex + 1];
      await selectSetById(nextSet._id);
      return;
    }

    await createNextSet();
  };

  /**
   * 前のセットへ移動する（先頭なら何もしない）。
   */
  const selectPreviousSet = async () => {
    if (!match || !match.sets || !selectedSetId) {
      return;
    }

    const currentIndex = match.sets.findIndex(function (setItem) {
      return String(setItem._id) === String(selectedSetId);
    });

    if (currentIndex <= 0) {
      return;
    }

    const previousSet = match.sets[currentIndex - 1];
    await selectSetById(previousSet._id);
  };

  /**
   * scoreBuffer を batch API へ送り、成功時は set を match に merge する。
   */
  const flushBuffer = async (buffer) => {
      if (!buffer || buffer.length === 0) {
        return;
      }

      if (isFlushingRef.current) {
        setScoreBuffer(function (prev) {
          return [...buffer, ...prev];
        });
        return;
      }

      const setIdForFlush = buffer[0].setId || selectedSetId;

      if (!matchId || !setIdForFlush) {
        setScoreBuffer(function (prev) {
          return [...buffer, ...prev];
        });
        return;
      }

      isFlushingRef.current = true;

      try {
          const scores = buffer.map(toBatchScore);
          const res = await api.post("/scores/batch", {
            matchId: matchId,
            setId: setIdForFlush,
            scores: scores
          });

          const serverSet = res.data.set;
          setMatch(function (prevMatch) {
            return mergeSetIntoMatch(prevMatch, serverSet);
          });

          if (String(serverSet._id) === String(selectedSetId)) {
            applySetToSidebar(serverSet, setStart, setBench);
          }
      } catch (err) {
          console.error("Flush failed:", err);
          setScoreBuffer(function (prev) {
            return [...buffer, ...prev];
          });
          setMatch(function (prevMatch) {
            return rollbackOptimisticActions(prevMatch, setIdForFlush, buffer);
          });
      } finally {
          isFlushingRef.current = false;
      }
  };
    
  /**
   * UI から呼ばれる唯一の保存入口。ローカルへ楽観 append し、buffer に積む。
   */
  const pushScore = (action) => {
    const setIdForAction = action.setId || selectedSetId;

    setMatch(function (prevMatch) {
      return appendActionToMatch(prevMatch, setIdForAction, action);
    });

    setScoreBuffer((prev) => {
      const updated = [...prev, action];

      if (updated.length >= 3) {
        flushBuffer([...updated]);
        return [];
      }

      return updated;
    });
  };

  // 5秒ごとに自動 flush（残っていれば）
  useEffect(() => {
    const interval = setInterval(() => {
      setScoreBuffer(function (prev) {
        if (prev.length === 0) {
          return prev;
        }

        if (isFlushingRef.current) {
          return prev;
        }

        flushBuffer([...prev]);
        return [];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [matchId, selectedSetId]);
  
  if (!match) return <div>Loading...</div>;

  return (
    <div>
        {match &&  (
          <Score 
            match={match}
            selectedSetId={selectedSetId}
            setSelectedSetId={setSelectedSetId}
            start={start}
            setStart={setStart}
            bench={bench}
            setBench={setBench}
            opponent={opponent}
            setOpponent={setOpponent}
            pushScore={pushScore}
            onSelectNextSet={selectNextSet}
            onSelectPreviousSet={selectPreviousSet}
          />
          )}
    </div>
  )
}
