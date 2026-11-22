/**
 * batch レスポンスの set を既存 match.sets に差し替え、新しい match を返す。
 */
export function mergeSetIntoMatch(match, serverSet) {
  if (!match || !serverSet) {
    return match;
  }

  const updatedSets = match.sets.map(function (setItem) {
    if (String(setItem._id) === String(serverSet._id)) {
      return serverSet;
    }
    return setItem;
  });

  return {
    ...match,
    sets: updatedSets
  };
}
