/**
 * serve 1 件分の得点加算を計算する（phase0 §3-5）。
 */
function getScoreDeltaFromServe(serveResult) {
  if (serveResult === "ace") {
    return { my: 1, opponent: 0 };
  }

  if (serveResult === "miss") {
    return { my: 0, opponent: 1 };
  }

  return { my: 0, opponent: 0 };
}

/**
 * point 1 件分の得点加算を計算する（phase0 §3-5）。
 */
function getScoreDeltaFromPoint(pointResult) {
  if (pointResult === "my") {
    return { my: 1, opponent: 0 };
  }

  if (pointResult === "opponent") {
    return { my: 0, opponent: 1 };
  }

  return { my: 0, opponent: 0 };
}

/**
 * Set.actions[] から Scorebar 行を derive する。
 * 1 行 = 1 点（serve で開始、次の serve まで）。reception / spike は無視する。
 */
export function deriveScoreRows(actions) {
  const rows = [];
  let myScore = 0;
  let opponentScore = 0;
  let currentRow = null;

  const actionList = actions || [];

  for (let index = 0; index < actionList.length; index++) {
    const event = actionList[index];

    if (!event || !event.action) {
      continue;
    }

    if (event.action === "serve") {
      if (currentRow) {
        rows.push(currentRow);
      }

      const serveResult = event.result === undefined ? null : event.result;
      const serveDelta = getScoreDeltaFromServe(serveResult);

      myScore = myScore + serveDelta.my;
      opponentScore = opponentScore + serveDelta.opponent;

      currentRow = {
        key: "serve-" + String(event.timestamp) + "-" + String(index),
        servePlayerId: event.playerId || null,
        serveResult: serveResult,
        pointPlayerId: null,
        pointResult: null,
        reason: null,
        myScore: myScore,
        opponentScore: opponentScore,
        committed: true
      };

      continue;
    }

    if (event.action === "point") {
      if (!currentRow) {
        continue;
      }

      // ace / miss 行には point を載せない（二重記録防止）
      if (currentRow.serveResult === "ace" || currentRow.serveResult === "miss") {
        continue;
      }

      const pointDelta = getScoreDeltaFromPoint(event.result);

      myScore = myScore + pointDelta.my;
      opponentScore = opponentScore + pointDelta.opponent;

      currentRow = {
        ...currentRow,
        pointPlayerId: event.playerId || null,
        pointResult: event.result || null,
        reason: event.reason || null,
        myScore: myScore,
        opponentScore: opponentScore
      };
    }
  }

  if (currentRow) {
    rows.push(currentRow);
  }

  return rows;
}
