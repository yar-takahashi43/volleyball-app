/**
 * API レスポンス用に password など機密フィールドを除いたユーザーオブジェクトを返す。
 */
function sanitizeUser(user) {
    const userObject = user._doc ? user._doc : user
    const { password, updatedAt, ...safeUser } = userObject
    return safeUser
}

module.exports = sanitizeUser
