const router = require("express").Router()
const User = require("../models/User")
const sanitizeUser = require("../utils/sanitizeUser")

/**
 * JWT の本人 / 管理者かどうかを判定する。
 */
function isSelfOrAdmin(req) {
    const requestUserId = String(req.user.id)
    const targetUserId = String(req.params.id)
    return requestUserId === targetUserId || req.user.isAdmin === true
}

// ユーザー情報の更新
router.put("/:id", async (req, res) => {
    if (!isSelfOrAdmin(req)) {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます")
    }

    try {
        // password / isAdmin のクライアント上書きを防ぐ
        const { password, isAdmin, ...safeUpdate } = req.body

        await User.findByIdAndUpdate(req.params.id, {
            $set: safeUpdate,
        })
        res.status(200).json("ユーザー情報が更新されました")
    } catch (err) {
        return res.status(500).json(err)
    }
})

// ユーザー情報の削除
router.delete("/:id", async (req, res) => {
    if (!isSelfOrAdmin(req)) {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を削除できます")
    }

    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("ユーザー情報が削除されました")
    } catch (err) {
        return res.status(500).json(err)
    }
})

// ユーザー情報の取得
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).json("ユーザーが見つかりません")
        }
        res.status(200).json(sanitizeUser(user))
    } catch (err) {
        return res.status(500).json(err)
    }
})

module.exports = router
