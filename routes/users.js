// server.jsのapp変数と同じようにrouter変数を使用する。
const router = require("express").Router()
const User = require("../models/User")

//CRUD処理を実装する
//ユーザー情報の更新
router.put("/:id", async(req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            })
            res.status(200).json("ユーザー情報が更新されました")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます")
    }
})

//ユーザー情報の削除
router.delete("/:id", async(req, res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("ユーザー情報が削除されました")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を削除できます")
    }
})

//ユーザー情報の取得
router.get("/:id", async(req, res) => {
    try {
            const user = await User.findById(req.params.id)
            // 他のいらない情報を取り除くので分割代入の手法を用いる
            const { password, updatedAt, ...other } = user._doc
            res.status(200).json(other)
        } catch (err) {
            return res.status(500).json(err)
        }
    })

// //ユーザーのフォロー（一番難しい内容かも）
// router.put("/:id/follow", async(req, res) => {
//     if(req.body.userId !== req.params.id) {
//         try{
//             const user = await User.findById(req.params.id)
//             const currentUser = await User.findById(req.body.userId)
//             // フォロワーに自分がいなかったらフォローできる
//             if (!user.followers.includes(req.body.userId)) {
//                 await user.updateOne({
//                     $push: {
//                         followers: req.body.userId,
//                     },
//                 })
//                 // 自分がフォローした後に反映される箇所について記載していく
//                 await currentUser.updateOne({
//                     $push: {
//                         followings: req.params.id
//                     }
//                 })
//                 return res.status(200).json("フォローに成功しました")
//             } else {
//                 return res.status(403).json("あなたはすでにこのユーザーをフォローしています")
//             }
//         } catch (err) {
//             return res.status(500).json(err)
//         }
//     } else {
//         return res.status(500).json("自分自身をフォローできません")
//     }
// })

// //ユーザーのフォローを外す
// router.put("/:id/unfollow", async(req, res) => {
//     if(req.body.userId !== req.params.id) {
//         try{
//             const user = await User.findById(req.params.id)
//             const currentUser = await User.findById(req.body.userId)
//             // フォロワーに存在したらフォローを外せる
//             if (user.followers.includes(req.body.userId)) {
//                 await user.updateOne({
//                     $pull: {
//                         followers: req.body.userId,
//                     },
//                 })
//                 // 自分がフォローした後に反映される箇所について記載していく
//                 await currentUser.updateOne({
//                     $pull: {
//                         followings: req.params.id
//                     }
//                 })
//                 return res.status(200).json("フォローを解除しました")
//             } else {
//                 return res.status(403).json("このユーザーはフォロー解除できません")
//             }
//         } catch (err) {
//             return res.status(500).json(err)
//         }
//     } else {
//         return res.status(500).json("自分自身をフォロー解除できません")
//     }
// })

module.exports = router