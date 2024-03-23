const router = require("express").Router()
const Opponent = require("../models/Opponent")
// const Match = require("../models/Match")
// const uuid = require('uuid')
const { default: mongoose } = require("mongoose")

//対戦相手の登録
router.post("/register", async (req, res) => {
    try{
        const newOpponent = await new Opponent({
            name: req.body.name,
            label: req.body.label,
        })

        const opponent = await newOpponent.save()
        return res.status(200).json(opponent)
    } catch (err) {
        return res.status(500).json(err)
    }
})



//対戦相手一覧取得
router.get("/opponents", async(req, res) => {
    try {
        const opponent = await Opponent.find({})
        const opponents = opponent.map(opponent =>{
            // 他のいらない情報を取り除くので分割代入の手法を用いる
            const { id, ...other } = opponent._doc
            return other
        })
            res.status(200).json(opponents)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//対戦相手検索（フリーワード）
router.get("/search/:keyword", async(req, res) => {
    try {
        const keyword = req.params.keyword
        const opponent = await Opponent.find(
            { $or: [
                {name: new RegExp(keyword, 'i')},
                {label: new RegExp(keyword, 'i')}
            ]}
        )
        const opponents = opponent.map(opponent =>{
            // 他のいらない情報を取り除くので分割代入の手法を用いる
            const { _id, ...other } = opponent._doc
            return other
        })
            res.status(200).json(opponents)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//対戦相手詳細
router.get("/:id", async(req, res) => {
    try {
        const opponent = await Opponent.findById(req.params.id)
            res.status(200).json(opponent)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//対戦相手の更新
router.put("/:id", async(req, res) => {
    try {
        const opponent = await Opponent.findByIdAndUpdate(req.params.id, {
            $set: req.body,
        })
        res.status(200).json("ユーザー情報が更新されました")
    } catch (err) {
        return res.status(500).json(err)
    }
})

//対戦相手の削除
router.delete("/:id", async(req, res) => {
    try {
        const opponent = await Opponent.findByIdAndDelete(req.params.id)
        res.status(200).json("ユーザー情報が削除されました")
    } catch (err) {
        return res.status(500).json(err)
    }
})

// //勝率の計算
// router.get("/winrate/:opponentId", async(req, res) => {
//     try {
//         const opponentId = req.params.opponentId;
//         // 対戦相手との全試合を取得
//         const matches = await Match.find({ opponentId: opponentId });
//         // 勝った試合の数を数える
//         const wins = matches.filter(match => match.result === true).length;
//         // 勝率を計算
//         const winRate = wins / matches.length;
//         res.status(200).json({ winRate: winRate });
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

module.exports = router