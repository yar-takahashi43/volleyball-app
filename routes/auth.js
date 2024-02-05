// server.jsのapp変数と同じようにrouter変数を使用する。
const router = require("express").Router()

router.get("/", (req, res) => {
    res.send("auth router")
})

module.exports = router