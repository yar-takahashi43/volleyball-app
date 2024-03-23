const router = require("express").Router()

router.get("/", (req, res) => {
    res.send("opponent router")
})

module.exports = router