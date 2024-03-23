const router = require("express").Router()

router.get("/", (req, res) => {
    res.send("match router")
})

module.exports = router