const mongoose = require("mongoose")
const Set = require("./Set")

const MatchSchema = new mongoose.Schema(
    {
        opponentId: {
            type: String,
            required: true,
        },
        result:{
            type: Boolean,
            require: false,
        },
        sets: [{ 
            type: mongoose.Schema.Types.ObjectId, ref: 'Set' 
        }],
    },

    {timestamps: true}
)

module.exports = mongoose.model("Match", MatchSchema)
