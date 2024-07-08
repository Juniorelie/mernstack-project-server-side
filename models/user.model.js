const { Schema, model } = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            minLength: 3,
            maxLength: 20,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        },
        coverImage: {
            type: String,
            default: ""
        },
        // followers: {
        //     type: [Schema.Types.ObjectId],
        //     default: []
        // },
        // following: {
        //     type: [Schema.Types.ObjectId],
        //     default: []
        // },
        isAdmin: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            maxLength: 100
        }
    },
    { timestamps : true }
)

const User = model("User", userSchema)
module.exports = User;