const router = require("express").Router()
const Player = require("../models/Player")
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
// router.post('/match/:id/set', async (req, res) => {
//     try {
//         const match = await Match.findById(req.params.id).populate('sets')
//         if (!match) {
//             return res.status(404).json({ message: "Match not found" })
//         }

//         // 新しいSetを作成し、Matchのsetsに追加
//         const allPlayerId = await getAllPlayerId()
//         const newSet = new Set({
//             benchMem: allPlayerId
//         })
//         await newSet.save()
//         match.sets.push(newSet)

//          const updatedMatch = await match.save()
//           return res.status(200).json(updatedMatch)
//         } catch (err) {
//         return res.status(500).json(err)
//     }
//   })

//新規セット作成＆最終セット更新
router.post('/match/:id', async (req, res) => {
    try {
        // const match = await Match.findById(req.params.id).populate('sets')
        const match = await Match.findById(req.params.id);
        if (!match) {
            return res.status(404).json({ message: "Match not found" })
        }
        // // 現在のセット（最後のセット）を取得
        // const currentSet = match.sets[match.sets.length - 1]
        // if (currentSet) {
        //     // 現在のセットの最終状態を保存
        //     await currentSet.save()
        // }
        // // 新しいSetを作成し、Matchのsetsに追加
        // const allPlayerId = await getAllPlayerId()
        // 新しいセットを作成
        const players = await Player.find({}, "_id num nickname");
        const newSet = new Set({
            starPlayer: req.body.starPlayer || [],
            benchMem: players.map(p => ({
                playerId: p._id,
                num: p.num,
                nickname: p.nickname
            })),
            actions: []
        })
        await newSet.save()

        //マッチに追加する
        // match.sets.push(newSet)
        match.sets.push(newSet._id)
        // 現在のセットを更新する
        match.currentSetId = newSet._id
        await match.save()
        
        // const updatedMatch = await match.save()
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
            .populate({
                path: "sets",
                populate: [
                    {path: "starPlayer.playerId", model: "Player" },
                    {path: "benchMem.playerId", model: "Player" }
                ]
            })
        if (!match) {
            return res.status(404).json({ message: "match not found" })
        }
        const set = match.sets.find(set => set._id.toString() === req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" })
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

// 先発を決める
// router.put("/match/:matchId/set/:setId/starPlayer", async (req, res) => {
//     try {
//         const match = await Match.findById(req.params.matchId).populate('sets')
//         if (!match) {
//             return res.status(404).json({ message: "match not found" })
//         }
//         const set = match.sets.find(set => set._id.toString() === req.params.setId)
//         if (!set) {
//             return res.status(404).json({ message: "Set not found" })
//         }
//         // ベンチメンバーから選ばれた選手を選び、starPlayerに設定
//         set.starPlayer = req.body.starPlayerId.map(id => set.benchMem.find(player => player.playerId === id))
//         // 選ばれたメンバーをベンチから除く
//         set.benchMem = set.benchMem.filter(player => !req.body.starPlayerId.includes(player.playerId))
//         await set.save()

//         const updatedMatch = await match.save()
//         return res.status(200).json(updatedMatch)
//     } catch (err) {
//         console.error(err)
//         return res.status(500).json(err)
//     }
// })

router.put("/match/:matchId/set/:setId/starPlayer", async (req, res) => {
    try {
        const { starPlayerIds, benchMemIds} = req.body

        // Set を直接取得（populate しない）
        const set = await Set.findById(req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" })
        }
        // const match = await Match.findById(req.params.matchId).populate('sets')
        // if (!match) {
        //     return res.status(404).json({ message: "match not found" })
        // }
        // const set = match.sets.find(set => set._id.toString() === req.params.setId)
        // if (!set) {
        //     return res.status(404).json({ message: "Set not found" })
        // }
        // // リクエストボディから受け取った選手のID
        // const newStarPlayerId = req.body.starPlayerId
        // const newBenchMemId = req.body.benchMemId
        // set.starPlayer = newStarPlayerId
        // set.benchMem = newBenchMemId

        // const starPlayers = await Player.find({ _id: { $in: req.body.starPlayerIds } });
        // const benchPlayers = await Player.find({ _id: { $in: req.body.benchMemIds } });

        // set.starPlayer = starPlayers.map(p => ({
        //     playerId: p._id,
        //     num: p.num,
        //     nickname: p.nickname
        // }));

        // set.benchMem = benchPlayers.map(p => ({
        //     playerId: p._id,
        //     num: p.num,
        //     nickname: p.nickname
        // }));

        // ★ 更新対象の Player をまとめて取得
        const players = await Player.find({
            _id: { $in: [...starPlayerIds, ...benchMemIds] }
        });

        // ★ Player → Set 用オブジェクトに変換
        const toObj = (p) => ({
            playerId: p._id.toString(),
            num: p.num,
            nickname: p.nickname
        });

        // ★ starPlayer 更新
        set.starPlayer = players
            .filter(p => starPlayerIds.includes(p._id.toString()))
            .map(toObj);

        // ★ benchMem 更新
        set.benchMem = players
            .filter(p => benchMemIds.includes(p._id.toString()))
            .map(toObj);
        console.log(players)

        await set.save()

        // // その選手が現在のスターティングメンバーの中に存在するか確認
        // const isStarting = set.starPlayer.some(player => player && player.playerId === playerId);
        // if (isStarting) {
        //     // 存在する場合はその選手をスターティングから削除
        //     set.starPlayer = set.starPlayer.filter(player => player.playerId !== playerId);
        //     set.benchMem.push(playerId);
        // } else {
        //     // 存在しない場合はその選手をスターティングに追加
        //     set.starPlayer.push(playerId);
        //     set.benchMem = set.benchMem.filter(player => player.playerId !== playerId);
        // }
        // await set.save()

        // const updatedMatch = await match.save()
        // return res.status(200).json(updatedMatch)
        return res.status(200).json(set)
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})


// レセプションの更新
router.put("/match/:matchId/set/:setId/reception", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('sets')
        if (!match) {
            return res.status(404).json({ message: "match not found" })
        }
        const set = match.sets.find(set => set._id.toString() === req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" })
        }
        // レセプションの更新
        set.reception = req.body.reception
        await set.save()
        const updatedSet = await match.save()
        return res.status(200).json(updatedSet)
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})

// スパイクの更新
router.put("/match/:matchId/set/:setId/spike", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('sets')
        if (!match) {
            return res.status(404).json({ message: "match not found" })
        }
        const set = match.sets.find(set => set._id.toString() === req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" })
        }
        set.spike = req.body.spike
        await set.save()
        const updatedSet = await match.save()
        return res.status(200).json(updatedSet)
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})

// スコアの更新
router.put("/match/:matchId/set/:setId", async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('sets')
        if (!match) {
            return res.status(404).json({ message: "match not found" })
        }
        const set = match.sets.find(set => set._id.toString() === req.params.setId)
        if (!set) {
            return res.status(404).json({ message: "Set not found" })
        }
        // スコアの更新
        set.actions = req.body.actions
        const updatedSet = await set.save()
        return res.status(200).json(updatedSet)
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})

module.exports = router