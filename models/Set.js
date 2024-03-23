const mongoose = require("mongoose")

const SetSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            require: true,
        },
        actions: {
            type: Array,
            default: [],
            _id: {
                type: String,
                unique: true,
            },
            min: 0,
            max: 45,
            serve: {
                type: Array,
                default:["", "エース", "ミス"],
                playerId: {
                    type: String,
                    default: null
                },
                isAce: {
                    type: Boolean,
                    default: false,
                },
                isMiss: {
                    type: Boolean,
                    default: false,
                },
                score: {
                    type: Number,
                    default: 0,
                    min: 0
                }
            },
            reason: {
                type: Array,
                default: [],
                playerId: {
                    type: String,
                },
                getScore: {
                    type: Array,
                    default:["", "スパイク", "アタック", "ブロック"]
                },
                loseScore: {
                    type: Array,
                    default:["", "レシーブ", "トス", "スパイク", "ブロック"]
                },
                score: {
                    type: Number,
                    default: 0,
                    min: 0
                }
            },
            score: {
                type: Array,
                my: {
                    type: Number,
                    default: 0,
                    min: 0
                },
                opponent: {
                    type: Number,
                    default: 0,
                    min: 0
                }
            }
        }
    }
)


module.exports = mongoose.model("Set", SetSchema)