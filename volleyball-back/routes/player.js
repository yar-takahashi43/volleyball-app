const router = require("express").Router()
const Player = require("../models/Player")

//選手の登録
router.post("/register", async (req, res) => {
    try{
        const newPlayer = await new Player({
            num: req.body.num,
            name: req.body.name,
            nickname: req.body.nickname,
        })

        const player = await newPlayer.save()
        return res.status(200).json(player)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//選手一覧取得
router.get("/players", async(req, res) => {
    try {
        const player = await Player.find({})
        const players = player.map(player =>{
            // 他のいらない情報を取り除くので分割代入の手法を用いる
            const { spike, score, serve, ...other } = player._doc
            return other
        })
            res.status(200).json(players)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//選手検索（フリーワード）
router.get("/search/:keyword", async(req, res) => {
    try {
        const keyword = req.params.keyword
        const player = await Player.find(
            { $or: [
                {num: new RegExp(keyword, 'i')},
                {name: new RegExp(keyword, 'i')},
                {nickname: new RegExp(keyword, 'i')}
            ]}
        )
        const players = player.map(player =>{
            // 他のいらない情報を取り除くので分割代入の手法を用いる
            const { spike, score, serve, ...other } = player._doc
            return other
        })
            res.status(200).json(players)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//選手詳細
router.get("/:id", async(req, res) => {
    try {
        const player = await Player.findById(req.params.id)
            res.status(200).json(player)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//選手の更新
router.put("/:id", async(req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        })
        res.status(200).json("ユーザー情報が更新されました")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//選手の削除
router.delete("/:id", async(req, res) => {
    try {
        const player = await Player.findByIdAndDelete(req.params.id)
        res.status(200).json("ユーザー情報が削除されました")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//以下追加項目
// スパイク成功率
// サーブ成功率

// router.get("/playerStats/:playerId", async(req, res) => {
//     try {
//         const playerId = req.params.playerId;
//         // プレイヤーが関与した全試合を取得
//         const matches = await Match.find({}).populate('matches');
//         let totalScore = 0;
//         let totalServes = 0;
//         let successfulServes = 0;
//         let totalSpikes = 0;
//         let successfulSpikes = 0;
//         matches.forEach(match => {
//             match.matches.forEach(set => {
//                 set.actions.forEach(action => {
//                     if (action.playerId === playerId) {
//                         totalScore += action.score;
//                         if (action.serve) {
//                             totalServes++;
//                             if (action.isAce) {
//                                 successfulServes++;
//                             }
//                         }
//                         if (action.getScore.includes("スパイク")) {
//                             totalSpikes++;
//                             if (action.score > 0) {
//                                 successfulSpikes++;
//                             }
//                         }
//                     }
//                 });
//             });
//         });
//         const serveSuccessRate = successfulServes / totalServes;
//         const spikeSuccessRate = successfulSpikes / totalSpikes;
//         res.status(200).json({ totalScore: totalScore, serveSuccessRate: serveSuccessRate, spikeSuccessRate: spikeSuccessRate });
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

module.exports = router