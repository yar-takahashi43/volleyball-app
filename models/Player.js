const mongoose = require("mongoose")

const PlayerSchema = new mongoose.Schema(
    {
        // id:{
        //     type: String,
        //     require: true,
        // },
        num:{
            type: String,
            require: true,
            unique: true
        },
        name:{
            type: String,
            require: true,
            min: 3,
            max: 25,
            unique: true,
        },
        nickname:{
            type: String,
            require: true,
            min: 1,
            max: 10,
            unique: true,
        },
        // 以下項目は検討。
        spike:{
            type: Array,
            min: 0,
        },
        score:{
            type: Array,
            min: 0,
        },
        serve:{
            type: Array,
            min: 0,
        },
    },

    {timestamps: true}
)

module.exports = mongoose.model("Player", PlayerSchema)