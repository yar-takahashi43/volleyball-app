const router = require("express").Router()
const Match = require("../models/Match")
const Set = require("../models/Set")
const { validateBatchRequest } = require("../validators/batchSchema")
const { serializeSet } = require("../utils/serializeMember")

/**
 * 複数の Action を Set.actions に一括追記する。
 * レスポンスは更新後の Set を { set } 形式で返す。
 */
router.post("/batch", async (req, res) => {
    try {
        const validation = validateBatchRequest(req.body)

        if (!validation.ok) {
            return res.status(400).json({ message: validation.error })
        }

        const matchId = req.body.matchId
        const setId = req.body.setId
        const scores = req.body.scores

        const match = await Match.findById(matchId)

        if (!match) {
            return res.status(404).json({ message: "match not found" })
        }

        const setBelongsToMatch = match.sets.some(function (id) {
            return id.toString() === setId
        })

        if (!setBelongsToMatch) {
            return res.status(400).json({ message: "setId does not belong to match" })
        }

        const updatedSet = await Set.findByIdAndUpdate(
            setId,
            {
                $push: {
                    actions: {
                        $each: scores
                    }
                }
            },
            { new: true }
        )

        if (!updatedSet) {
            return res.status(404).json({ message: "Set not found" })
        }

        return res.status(200).json({
            set: serializeSet(updatedSet)
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }
})

module.exports = router
