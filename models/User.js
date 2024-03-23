const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            min: 3,
            max: 25,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        password:{
            type: String,
            required: true,
            max: 6,
            min: 50,
        },
        // 権限に関するもの。ログインしているかどうか。
        isAdmin:{
            type: Boolean,
            default: false,
        },
    },

    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema)