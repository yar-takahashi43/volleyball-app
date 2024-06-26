const mongoose = require("mongoose")
const Set = require("./Set")

const MatchSchema = new mongoose.Schema(
    {
        // date: {
        //     type: String,
        //     require: true,
        // },
        opponentId: {
            type: String,
            required: true,
        },
        result:{
            type: Boolean,
            require: false,
        },
        matches: [{ 
            type: mongoose.Schema.Types.ObjectId, ref: 'Set' 
        }],
        starPlayer: [
            { playerId: {type: String, default: null}, num: {type: String, default: null}, nickname: {type: String, default: null}},
            { playerId: {type: String, default: null}, num: {type: String, default: null}, nickname: {type: String, default: null}},
            { playerId: {type: String, default: null}, num: {type: String, default: null}, nickname: {type: String, default: null}},
            { playerId: {type: String, default: null}, num: {type: String, default: null}, nickname: {type: String, default: null}},
            { playerId: {type: String, default: null}, num: {type: String, default: null}, nickname: {type: String, default: null}},
            { playerId: {type: String, default: null}, num: {type: String, default: null}, nickname: {type: String, default: null}},
            { playerId: {type: String, default: null}, num: {type: String, default: null}, nickname: {type: String, default: null}}
        ],        
        benchMem: [{
            playerId: String,
            num: String,
            nickname: String,
        }],
    },

    {timestamps: true}
)

module.exports = mongoose.model("Match", MatchSchema)
