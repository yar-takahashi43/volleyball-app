const router = require("express").Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const sanitizeUser = require("../utils/sanitizeUser")

const BCRYPT_SALT_ROUNDS = 10

/**
 * JWT を発行する。
 */
function createAuthToken(user) {
    const payload = {
        id: String(user._id),
        isAdmin: user.isAdmin === true,
    }

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    })
}

// ユーザー登録
router.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })

        const user = await newUser.save()
        const token = createAuthToken(user)

        return res.status(200).json({
            token: token,
            user: sanitizeUser(user),
        })
    } catch (err) {
        return res.status(500).json(err)
    }
})

// ログイン
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).json("ユーザーが見つかりません")
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.status(400).json("パスワードが違います")
        }

        const token = createAuthToken(user)

        return res.status(200).json({
            token: token,
            user: sanitizeUser(user),
        })
    } catch (err) {
        return res.status(500).json(err)
    }
})

module.exports = router
