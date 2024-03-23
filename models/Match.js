// Match.js
const mongoose = require("mongoose")
const Set = require("./Set")

const MatchSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            require: true,
        },
        opponentId: {
            type: String,
            required: true,
        },
        result:{
            type: Boolean,
            require: false,
        },
        matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Set' }],
    },

    {timestamps: true}
)

module.exports = mongoose.model("Match", MatchSchema)
