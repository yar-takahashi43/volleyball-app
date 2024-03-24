const router = require("express").Router()
const Set = require("../models/Set")

// スコアの作成
router.post('/set', async (req, res) => {
    try {
        const newSet = await new Set(req.body)

        const set = await newSet.save();
        return res.status(200).json(set);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// スコアの詳細表示
router.get("/:id", async(req, res) => {
    try {
        const set = await Set.findById(req.params.id)
            res.status(200).json(set)
    } catch (err) {
        return res.status(500).json(err)
    }
})

// スコアの削除
router.delete("/:id", async (req, res) => {
    try {
        const deletedSet = await Match.findByIdAndDelete({_id: req.params.id});
        res.status(200).json(deletedSet);
    } catch (err) {
        res.status(500).json(err);
    }
});

// スコアの更新
router.put("/:id", async (req, res) => {
    try {
        const set = await Set.findById(req.params.id);
        if (!set) {
            return res.status(404).json({ message: "Set not found" });
        }

        if (req.body.team === "my") {
            set.myScore += req.body.change;
        } else if (req.body.team === "opponent") {
            set.opponentScore += req.body.change;
        }

        const updatedSet = await set.save();
        return res.status(200).json(updatedSet);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// レセプションの更新
router.put("/:id/reception", async (req, res) => {
    try {
        const set = await Set.findById(req.params.id);
        if (!set) {
            return res.status(404).json({ message: "Set not found" });
        }

        set.reception = req.body.reception;

        const updatedSet = await set.save();
        return res.status(200).json(updatedSet);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});

// スパイクの更新
router.put("/:id/spike", async (req, res) => {
    try {
        const set = await Set.findById(req.params.id);
        if (!set) {
            return res.status(404).json({ message: "Set not found" });
        }

        set.spike = req.body.spike;

        const updatedSet = await set.save();
        return res.status(200).json(updatedSet);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
});


module.exports = router