const router = require("express").Router()
const Match = require("../models/Match")

// 新規試合登録
router.post("/register", async (req, res) => {
    try {
        const newMatch = new Match({
            opponentId: req.body.opponentId,
        });
        const savedMatch = await newMatch.save();
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
            .populate('matches')
            .exec();
        res.status(200).json(match);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


// 対戦相手ごとに試合詳細を取得する。
router.get("/matches/:opponentId", async (req, res) => {
    try {
        const matches = await Match.find({ opponentId: req.params.opponentId })
            .populate('matches')
            .exec()
        res.status(200).json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


module.exports = router