const mongoose = require("mongoose")

const OpponentSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            min: 2,
            max: 25,
            unique: true,
        },
        label:{
            type: String,
            required: true,
            min: 1,
            max: 10,
            unique: true,
        },
    },

    {timestamps: true}
)

module.exports = mongoose.model("Opponent", OpponentSchema)