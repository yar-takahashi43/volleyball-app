const router = require("express").Router()
const Player = require("../models/Player");
const Set = require("../models/Set")
const Match = require("../models/Match")

// 選手全員のIDを取得する
async function getAllPlayerId(){
    const players = await Player.find({}, '_id num nickname')
    return players.map(player => ({
        playerId: player._id,
        num: player.num,
        nickname: player.nickname
    }))
}

// スコアの作成
router.post('/match/:id/set', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id).populate('sets')
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }

        // 新しいSetを作成し、Matchのsetsに追加
        const allPlayerId = await getAllPlayerId()
        const newSet = new Set({
            benchMem: allPlayerId
        })
        await newSet.save()
        match.sets.push(newSet);

         const updatedMatch = await match.save();
          return res.status(200).json(updatedMatch);
        } catch (err) {
        return res.status(500).json(err);
    }
  });

// スコアの詳細表示
router.get("/match/:matchId/set/:setId", async(req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('sets')
        if (!match) {
            return res.status(404).json({ message: "match not found" });
        }
        const set = match.sets.find(set => set._id.toString() === req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" });
        }
            res.status(200).json(set)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// スコアの削除
router.delete("/match/:matchId/set/:setId", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId)
        if (!match) {
            return res.status(404).json({ message: "Match not found" });
        }
        match.sets = match.sets.filter(set => set._id.toString() !== req.params.setId)
        const updatedMatch = await match.save();
        return res.status(200).json(updatedMatch);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// 先発を決める
router.put("/match/:matchId/set/:setId/starPlayer", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('sets')
        if (!match) {
            return res.status(404).json({ message: "match not found" });
        }
        const set = match.sets.find(set => set._id.toString() === req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" });
        }
        // ベンチメンバーから選ばれた選手を選び、starPlayerに設定
        set.starPlayer = req.body.starPlayerId.map(id => set.benchMem.find(player => player.playerId === id));
        // 選ばれたメンバーをベンチから除く
        set.benchMem = set.benchMem.filter(player => !req.body.starPlayerId.includes(player.playerId));
        await set.save()

        const updatedMatch = await match.save();
        return res.status(200).json(updatedMatch);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// レセプションの更新
router.put("/match/:matchId/set/:setId/reception", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('sets')
        if (!match) {
            return res.status(404).json({ message: "match not found" });
        }
        const set = match.sets.find(set => set._id.toString() === req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" });
        }
        // レセプションの更新
        set.reception = req.body.reception;
        await set.save()
        const updatedSet = await match.save();
        return res.status(200).json(updatedSet);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// スパイクの更新
router.put("/match/:matchId/set/:setId/spike", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('sets')
        if (!match) {
            return res.status(404).json({ message: "match not found" });
        }
        const set = match.sets.find(set => set._id.toString() === req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" });
        }
        set.spike = req.body.spike
        await set.save()
        const updatedSet = await match.save();
        return res.status(200).json(updatedSet);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// スコアの更新
router.put("/:id", async (req, res) => {
    try {
        const set = await Set.findById(req.params.id);
        if (!set) {
            return res.status(404).json({ message: "Set not found" });
        }

        if (req.body.team === "my") {
            set.myScore += req.body.change;
        } else if (req.body.team === "opponent") {
            set.opponentScore += req.body.change;
        }

        const updatedSet = await set.save();
        return res.status(200).json(updatedSet);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});


module.exports = router