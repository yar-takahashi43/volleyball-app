const jwt = require("jsonwebtoken")

/**
 * Authorization: Bearer <token> を検証し、req.user にペイロードを載せる。
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json("認証トークンが必要です")
    }

    const token = authHeader.slice(7)

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json("認証トークンが無効です")
    }
}

module.exports = verifyToken
