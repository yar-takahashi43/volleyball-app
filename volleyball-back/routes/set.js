const router = require("express").Router()
const Player = require("../models/Player")
const Set = require("../models/Set")
const Match = require("../models/Match")
const { serializeSet } = require("../utils/serializeMember")

// 選手全員のIDを取得する
async function getAllPlayerId(){
    const players = await Player.find({}, '_id num nickname')
    return players.map(player => ({
        playerId: player._id,
        num: player.num,
        nickname: player.nickname
    }))
}

/**
 * 新規セットを作成する。
 * スタメンは空、ベンチは全選手（セットごとにスタメンを選び直す）。
 */
router.post('/match/:id', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: "Match not found" })
        }

        const players = await Player.find({}, "_id num nickname");
        const newSet = new Set({
            starPlayer: [],
            benchMem: players.map(function (player) {
                return {
                    playerId: player._id,
                    num: player.num,
                    nickname: player.nickname
                };
            }),
            actions: []
        })
        await newSet.save()

        match.sets.push(newSet._id)
        match.currentSetId = newSet._id
        await match.save()
        
        return res.status(200).json(
            {
                message: "New set created",
                setId: newSet._id,
                match
            }
        )
    } catch (err) {
        return res.status(500).json(err)
    }
})

// スコアの詳細表示
router.get("/match/:matchId/set/:setId", async(req, res) => {
    try {
        const match = await Match.findById(req.params.matchId)

        if (!match) {
            return res.status(404).json({ message: "match not found" })
        }

        const setBelongsToMatch = match.sets.some(function (id) {
            return id.toString() === req.params.setId
        })

        if (!setBelongsToMatch) {
            return res.status(404).json({ message: "Set not found" })
        }

        const set = await Set.findById(req.params.setId)

        if (!set) {
            return res.status(404).json({ message: "Set not found" })
        }

        res.status(200).json(serializeSet(set))
    } catch (err) {
        return res.status(500).json(err)
    }
})

// スコアの削除
router.delete("/match/:matchId/set/:setId", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId)
        if (!match) {
            return res.status(404).json({ message: "Match not found" })
        }
        match.sets = match.sets.filter(set => set._id.toString() !== req.params.setId)
        const updatedMatch = await match.save()
        return res.status(200).json(updatedMatch)
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})

/**
 * 先発・ベンチメンバーを更新する。
 * レスポンスは GET と同じ serializeSet 形式で返す。
 */
router.put("/match/:matchId/set/:setId/starPlayer", async (req, res) => {
    try {
        const { starPlayerIds, benchMemIds} = req.body

        // Set を直接取得（populate しない）
        const set = await Set.findById(req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" })
        }

        // 更新対象の Player をまとめて取得
        const players = await Player.find({
            _id: { $in: [...starPlayerIds, ...benchMemIds] }
        });

        // Player → Set 用オブジェクトに変換
        const toObj = (p) => ({
            playerId: p._id.toString(),
            num: p.num,
            nickname: p.nickname
        });

        // starPlayer 更新
        set.starPlayer = players
            .filter(p => starPlayerIds.includes(p._id.toString()))
            .map(toObj);

        // benchMem 更新
        set.benchMem = players
            .filter(p => benchMemIds.includes(p._id.toString()))
            .map(toObj);

        await set.save()

        return res.status(200).json(serializeSet(set))
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})

// スコアの更新
router.put("/match/:matchId/set/:setId", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId)

        if (!match) {
            return res.status(404).json({ message: "match not found" })
        }

        const setBelongsToMatch = match.sets.some(function (id) {
            return id.toString() === req.params.setId
        })

        if (!setBelongsToMatch) {
            return res.status(404).json({ message: "Set not found" })
        }

        const set = await Set.findById(req.params.setId)

        if (!set) {
            return res.status(404).json({ message: "Set not found" })
        }

        // スコアの更新
        set.actions = req.body.actions
        const updatedSet = await set.save()
        return res.status(200).json(serializeSet(updatedSet))
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})

module.exports = router
