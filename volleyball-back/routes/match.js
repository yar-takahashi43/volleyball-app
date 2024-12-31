const router = require("express").Router()
const Match = require("../models/Match")
const Set = require("../models/Set")
const Player = require("../models/Player");

// 選手全員のIDを取得する
async function getAllPlayerId(){
    const players = await Player.find({}, '_id num nickname')
    return players.map(player => ({
        playerId: player._id,
        num: player.num,
        nickname: player.nickname
    }))
}

// 新規試合登録(actionsに関しては要検討)
router.post("/register", async (req, res) => {
    try {
        // 新しいMatchを作成
        const newMatch = new Match({
            opponentId: null,
        });
        // 新しいSetを作成し、Matchのsetsに追加
        const allPlayerId = await getAllPlayerId()
        // 初期のSetを作成
        const initialSet = new Set({
            myScore: 0,
            opponentScore: 0,
            starPlayer: [],
            benchMem: allPlayerId,
            reception: {
                A: 0,
                B: 0,
                C: 0,
                D: 0,
            },
            spike: [
                {playerId: null, spikeScore: 0},
                {playerId: null, spikeScore: 0},
                {playerId: null, spikeScore: 0},
                {playerId: null, spikeScore: 0},
                {playerId: null, spikeScore: 0}
            ],
            actions: [{
                _id: null,
                serve: [{
                    playerId: null,
                    serveState: ['ace', 'miss', 'null'],
                    score: 0
                }],
                reason: [{
                    playerId: null,
                    getScore: ["", "スパイク", "アタック", "ブロック"],
                    loseScore: ["", "レシーブ", "トス", "スパイク", "ブロック"],
                    score: 0
                }],
                score: {
                    my: 0,
                    opponent: 0
                }
            }]
        });
        await initialSet.save();
        // 初期のSetをMatchのsetsに追加
        newMatch.sets.push(initialSet);
        // Matchを保存
        const savedMatch = await newMatch.save();
        // 新規作成したMatchのIDを取得
        const matchId = savedMatch._id
        res.status(200).json(savedMatch);
    } catch (err) {
        res.status(500).json(err);
    }
});


// 試合削除
router.delete("/:id", async (req, res) => {
    try {
        const deletedMatch = await Match.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedMatch);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// 試合全体の更新
router.put("/:id", async (req, res) => {
    try {
        const updatedMatch = await Match.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        )
        if(!updatedMatch) {
            return res.status(404).json({ message: "match not found" });
        }
        // 更新後の試合を返す
        res.status(200).json(updatedMatch);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// 日付ごとに試合をフォルダにまとめて試合を実施した日時フォルダを取得
router.get("/matches", async (req, res) => {
    try {
        const matches = await Match.find().sort({ createdAt: -1 });
        const groupedMatches = matches.reduce((grouped, match) => {
            const date = match.createdAt.toISOString().split('T')[0];
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(match);
            return grouped;
        }, {});
        res.status(200).json(groupedMatches);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// 特定の日付に実施した試合を取得
router.get("/matches/:date", async (req, res) => {
    try {
        const startDate = new Date(req.params.date);
        const endDate = new Date(req.params.date);
        endDate.setDate(endDate.getDate() + 1);

        const matches = await Match.find({
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        });

        res.status(200).json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// 試合の詳細を取得する
router.get("/:id", async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .exec();
        res.status(200).json(match);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


// 対戦相手ごとに試合詳細を取得する。
router.get("/opponent/:opponentId", async (req, res) => {
    try {
        const matches = await Match.find({ opponentId: req.params.opponentId })
            .exec()
        res.status(200).json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


module.exports = router