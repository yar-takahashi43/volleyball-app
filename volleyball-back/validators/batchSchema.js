const RECEPTION_RESULTS = ["A", "B", "C", "D"];
const SERVE_RESULTS = ["ace", "miss", null];
const POINT_RESULTS = ["my", "opponent"];

const POINT_REASONS_MY = ["spike", "block", "attack"];
const POINT_REASONS_OPPONENT = [
    "receive",
    "toss",
    "spike_lose",
    "block_lose",
    "foul_serve",
    "foul_rotation",
    "foul_net",
    "foul_double",
    "foul_four_hits",
    "foul_other"
];
const POINT_REASONS = POINT_REASONS_MY.concat(POINT_REASONS_OPPONENT);

/**
 * point が ±1 かどうかを判定する。
 */
function isPlusOrMinusOne(value) {
    return value === 1 || value === -1;
}

/**
 * playerId が必須の string かどうかを判定する。
 */
function hasRequiredPlayerId(playerId) {
    if (playerId === null || playerId === undefined) {
        return false;
    }

    if (typeof playerId !== "string") {
        return false;
    }

    if (playerId.length === 0) {
        return false;
    }

    return true;
}

/**
 * 単一の Action を §4 の必須表に従って検証する。
 */
function validateAction(score, index) {
    const prefix = "scores[" + index + "]";

    if (!score || typeof score !== "object") {
        return prefix + " must be an object";
    }

    if (!score.action) {
        return prefix + ".action is required";
    }

    if (typeof score.timestamp !== "number") {
        return prefix + ".timestamp is required and must be a number";
    }

    if (score.action === "reception") {
        if (score.playerId !== null) {
            return prefix + ".playerId must be null for reception";
        }

        if (!isPlusOrMinusOne(score.point)) {
            return prefix + ".point must be 1 or -1 for reception";
        }

        if (RECEPTION_RESULTS.indexOf(score.result) === -1) {
            return prefix + ".result must be A, B, C, or D for reception";
        }

        return null;
    }

    if (score.action === "spike") {
        if (!hasRequiredPlayerId(score.playerId)) {
            return prefix + ".playerId is required for spike";
        }

        if (!isPlusOrMinusOne(score.point)) {
            return prefix + ".point must be 1 or -1 for spike";
        }

        return null;
    }

    if (score.action === "serve") {
        if (!hasRequiredPlayerId(score.playerId)) {
            return prefix + ".playerId is required for serve";
        }

        if (score.point !== 0) {
            return prefix + ".point must be 0 for serve";
        }

        // result は ace / miss / null（JSON の null または文字列 "null" は不可、null のみ）
        const isValidServeResult = score.result === "ace"
            || score.result === "miss"
            || score.result === null;

        if (!isValidServeResult) {
            return prefix + ".result must be ace, miss, or null for serve";
        }

        return null;
    }

    if (score.action === "point") {
        if (!hasRequiredPlayerId(score.playerId)) {
            return prefix + ".playerId is required for point";
        }

        if (!isPlusOrMinusOne(score.point)) {
            return prefix + ".point must be 1 or -1 for point";
        }

        if (POINT_RESULTS.indexOf(score.result) === -1) {
            return prefix + ".result must be my or opponent for point";
        }

        if (!score.reason || typeof score.reason !== "string") {
            return prefix + ".reason is required for point";
        }

        if (POINT_REASONS.indexOf(score.reason) === -1) {
            return prefix + ".reason is not a valid enum value";
        }

        return null;
    }

    return prefix + ".action must be reception, spike, serve, or point";
}

/**
 * POST /scores/batch のリクエストボディを検証する。
 * 成功時は { ok: true }、失敗時は { ok: false, error: string } を返す。
 */
function validateBatchRequest(body) {
    if (!body || typeof body !== "object") {
        return {
            ok: false,
            error: "Request body is required"
        };
    }

    if (!body.matchId || typeof body.matchId !== "string") {
        return {
            ok: false,
            error: "matchId is required"
        };
    }

    if (!body.setId || typeof body.setId !== "string") {
        return {
            ok: false,
            error: "setId is required"
        };
    }

    if (!Array.isArray(body.scores)) {
        return {
            ok: false,
            error: "scores must be an array"
        };
    }

    if (body.scores.length === 0) {
        return {
            ok: false,
            error: "scores must not be empty"
        };
    }

    for (let index = 0; index < body.scores.length; index++) {
        const actionError = validateAction(body.scores[index], index);

        if (actionError) {
            return {
                ok: false,
                error: actionError
            };
        }
    }

    return {
        ok: true
    };
}

module.exports = {
    validateBatchRequest,
    POINT_REASONS,
    SERVE_RESULTS,
    RECEPTION_RESULTS
};
