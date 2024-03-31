const mongoose = require("mongoose")

const SetSchema = new mongoose.Schema(
    {
        myScore: {
            type: Number,
            default: 0,
        },
        opponentScore: {
            type: Number,
            default: 0,
        },
        starPlayer: [{
            playerId: String,
            num: String,
            nickname: String,
        }],        
        benchMem: [{
            playerId: String,
            num: String,
            nickname: String,
        }],
        reception : {
            A: {type: Number, default: 0},
            B: {type: Number, default: 0},
            C: {type: Number, default: 0},
            D: {type: Number, default: 0},
        },
        spike : [
            {playerId: {type: String, default: null}, spikeScore: {type: Number, default: 0}},
            {playerId: {type: String, default: null}, spikeScore: {type: Number, default: 0}},
            {playerId: {type: String, default: null}, spikeScore: {type: Number, default: 0}},
            {playerId: {type: String, default: null}, spikeScore: {type: Number, default: 0}},
            {playerId: {type: String, default: null}, spikeScore: {type: Number, default: 0}}
        ],
        actions: {
            type: Array,
            default: [],
            min: 0,
            max: 45,
            _id: {
                type: String,
                unique: true,
            },
            serve: {
                type: Array,
                default:["", "エース", "ミス"],
                playerId: {
                    type: String,
                    default: null
                },
                serveState:{
                    type: String,
                    enum: ['ace', 'miss', 'null'],
                    default: null,
                },
                // isAce: {
                //     type: Boolean,
                //     default: false,
                // },
                // isMiss: {
                //     type: Boolean,
                //     default: false,
                // },
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