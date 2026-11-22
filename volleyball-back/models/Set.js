const mongoose = require("mongoose")

const ActionSchema = new mongoose.Schema(
    {
        action: {
            type: String,
            required: true,
            enum: ["reception", "spike", "serve", "point"]
        },
        playerId: {
            type: String,
            default: null
        },
        point: {
            type: Number,
            default: 0
        },
        result: {
            type: String,
            default: null
        },
        reason: {
            type: String,
            default: null
        },
        timestamp: {
            type: Number,
            required: true
        }
    },
    {
        _id: false
    }
);

const SetSchema = new mongoose.Schema(
    {
        starPlayer: [
            {
                playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
                num: String,
                nickname: String
            }
        ],
        benchMem: [
            {
                playerId: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
                num: String,
                nickname: String
            }
        ],
        actions: {
            type: [ActionSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Set", SetSchema)
