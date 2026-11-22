import React, { useState, useEffect } from 'react'
import "./Scorebar.css"
import ScoreDetail from './ScoreDetail'
import { deriveScoreRows } from '../../utils/deriveScoreRows'

const POINT_REASONS_MY = ["spike", "block", "attack"];

/**
 * 空の下書き行を作る。
 */
function createEmptyDraft() {
  return {
    key: "draft",
    servePlayerId: null,
    serveResult: null,
    pointPlayerId: null,
    pointResult: null,
    reason: null,
    myScore: null,
    opponentScore: null,
    committed: false
  };
}

/**
 * 下書きがエース/ミスとして確定できるか判定する。
 */
function canCommitAceOrMiss(draft) {
  if (!draft.servePlayerId) {
    return false;
  }

  if (draft.serveResult !== "ace" && draft.serveResult !== "miss") {
    return false;
  }

  return true;
}

/**
 * 下書きがラリー決着として確定できるか判定する。
 */
function canCommitRally(draft) {
  if (!draft.servePlayerId) {
    return false;
  }

  if (draft.serveResult === "ace" || draft.serveResult === "miss") {
    return false;
  }

  if (!draft.pointPlayerId) {
    return false;
  }

  if (!draft.reason) {
    return false;
  }

  return true;
}

/**
 * Scorebar: actions から行を derive し、下書き確定時に pushScore する。
 */
export default function Scorebar({ match, setId, start, bench, pushScore }) {
  const [draft, setDraft] = useState(createEmptyDraft);

  const selectedSet = match && setId
    ? match.sets.find(function (setItem) {
        return String(setItem._id) === String(setId);
      })
    : null;

  useEffect(function () {
    setDraft(createEmptyDraft());
  }, [setId]);

  if (!selectedSet) {
    return <div className="gamebar" id="scorebar-no-set">セットが選択されていません</div>;
  }

  const committedRows = deriveScoreRows(selectedSet.actions);
  const lastCommitted = committedRows.length > 0
    ? committedRows[committedRows.length - 1]
    : null;

  const draftDisplayScores = {
    myScore: lastCommitted ? lastCommitted.myScore : 0,
    opponentScore: lastCommitted ? lastCommitted.opponentScore : 0
  };

  /**
   * 下書きを確定し、serve / point を pushScore する。
   */
  function commitDraft(nextDraft) {
    if (!pushScore || !match || !setId) {
      return false;
    }

    const matchId = match._id;
    const baseTimestamp = Date.now();

    if (canCommitAceOrMiss(nextDraft)) {
      pushScore({
        matchId: matchId,
        setId: setId,
        action: "serve",
        playerId: nextDraft.servePlayerId,
        point: 0,
        result: nextDraft.serveResult,
        timestamp: baseTimestamp
      });
      setDraft(createEmptyDraft());
      return true;
    }

    if (canCommitRally(nextDraft)) {
      const isMyPoint = POINT_REASONS_MY.indexOf(nextDraft.reason) !== -1;
      const pointResult = isMyPoint ? "my" : "opponent";
      const pointValue = isMyPoint ? 1 : -1;

      pushScore({
        matchId: matchId,
        setId: setId,
        action: "serve",
        playerId: nextDraft.servePlayerId,
        point: 0,
        result: null,
        timestamp: baseTimestamp
      });

      pushScore({
        matchId: matchId,
        setId: setId,
        action: "point",
        playerId: nextDraft.pointPlayerId,
        point: pointValue,
        result: pointResult,
        reason: nextDraft.reason,
        timestamp: baseTimestamp + 1
      });

      setDraft(createEmptyDraft());
      return true;
    }

    return false;
  }

  /**
   * 下書き行のフィールドを更新し、確定可能なら commit する。
   */
  function updateDraft(newValues) {
    const nextDraft = {
      ...draft,
      ...newValues
    };

    setDraft(nextDraft);
    commitDraft(nextDraft);
  }

  const displayRows = committedRows.concat([
    {
      ...draft,
      myScore: draftDisplayScores.myScore,
      opponentScore: draftDisplayScores.opponentScore
    }
  ]);

  return (
    <div className="gamebar" id="scorebar">
      <div className="row headerRow" id="scorebar-header">
        <div className="cell serveHeader">サーブ</div>
        <div className="cell reasonHeader">決定要因</div>
        <div className="cell scoreHeader">スコア</div>
      </div>

      <div className="row subHeaderRow" id="scorebar-subheader">
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

      {displayRows.map(function (row, index) {
        return (
          <ScoreDetail
            key={row.key}
            row={row}
            start={start}
            bench={bench}
            onUpdateDraft={updateDraft}
          />
        );
      })}
    </div>
  )
}
