const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            minlength: 3,
            maxlength: 25,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            maxlength: 50,
            unique: true,
        },
        password:{
            type: String,
            required: true,
            minlength: 6,
            maxlength: 100,
        },
        // 管理者フラグ
        isAdmin:{
            type: Boolean,
            default: false,
        },
    },

    {timestamps: true}
)

module.exports = mongoose.model("User", UserSchema)
