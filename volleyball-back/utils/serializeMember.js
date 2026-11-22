/**
 * Member エントリの playerId を string に正規化する。
 * 解決順: entry.playerId._id → entry.playerId → entry._id
 */
function serializeMember(entry) {
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
 * Set ドキュメントを API 返却形式に変換する。
 * starPlayer / benchMem の playerId を string にする。
 */
function serializeSet(set) {
    if (!set) {
        return null;
    }

    let plainSet = set;

    if (typeof set.toObject === "function") {
        plainSet = set.toObject();
    }

    const starPlayer = (plainSet.starPlayer || []).map(serializeMember);
    const benchMem = (plainSet.benchMem || []).map(serializeMember);

    return {
        ...plainSet,
        starPlayer: starPlayer,
        benchMem: benchMem
    };
}

/**
 * Match ドキュメントを API 返却形式に変換する。
 * 各 set に serializeSet を適用する。
 */
function serializeMatch(match) {
    if (!match) {
        return null;
    }

    let plainMatch = match;

    if (typeof match.toObject === "function") {
        plainMatch = match.toObject();
    }

    const sets = (plainMatch.sets || []).map(function (set) {
        if (!set || typeof set !== "object") {
            return String(set);
        }

        const hasSetFields = Array.isArray(set.actions)
            || Array.isArray(set.starPlayer)
            || Array.isArray(set.benchMem);

        if (hasSetFields) {
            return serializeSet(set);
        }

        if (set._id) {
            return String(set._id);
        }

        return String(set);
    });

    return {
        ...plainMatch,
        sets: sets
    };
}

module.exports = {
    serializeMember,
    serializeSet,
    serializeMatch
};
