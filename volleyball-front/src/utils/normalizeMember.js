/**
 * Member エントリの playerId を string に正規化する。
 * 解決順: entry.playerId._id → entry.playerId → entry._id
 */
export function normalizeMember(entry) {
  if (!entry) {
    return null;
  }

  let playerIdValue = null;

  if (entry.playerId && entry.playerId._id) {
    playerIdValue = entry.playerId._id;
  } else if (entry.playerId) {
    playerIdValue = entry.playerId;
  } else if (entry._id) {
    playerIdValue = entry._id;
  }

  let playerIdString = null;

  if (playerIdValue !== null && playerIdValue !== undefined) {
    playerIdString = String(playerIdValue);
  }

  return {
    playerId: playerIdString,
    num: entry.num,
    nickname: entry.nickname
  };
}

/**
 * Member 配列を正規化する。null 要素は除外する。
 */
export function normalizeMembers(list) {
  if (!list || !Array.isArray(list)) {
    return [];
  }

  return list.map(normalizeMember).filter(function (member) {
    return member !== null;
  });
}
