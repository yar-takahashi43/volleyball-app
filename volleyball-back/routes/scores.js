const router = require("express").Router()

// バッチでスコア更新
router.post("/batch", (req, res) => {
    console.log("Received batch:", req.body);
    res.status(200).json({ message: "OK" });
});

module.exports = router