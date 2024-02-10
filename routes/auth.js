// server.jsのapp変数と同じようにrouter変数を使用する。
const router = require("express").Router()
const User = require("../models/User")

//ユーザーの登録
router.post("/register", async (req, res) => {
    try{
        newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })

        const user = await newUser.save()
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json(err)
    }
})

//ログイン機能を実装する
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(404).send("ユーザーが見つかりません")

        const validPassword = req.body.password === user.password // 真偽を判別してvalidPasswordの変数に格納する。
        if (!validPassword) return res.status(400).json("パスワードが違います")

        return res.status(200).json(user)
    } catch(err) {
        return res.status(500).json(err)
    }
})

// router.get("/", (req, res) => {
//     res.send("auth router")
// })

module.exports = router