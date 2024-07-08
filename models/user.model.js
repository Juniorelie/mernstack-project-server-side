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
            minLength: 6,
        },
        image: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        },
        coverImage: {
            type: String,
            default: ""
        },
        followers: {
            type: [Schema.Types.Mixed],
            default: []
        },
        following: {
            type: [Schema.Types.Mixed],
            default: []
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            maxLength: 100
        },
        city: {
            type: String,
            maxLength: 50
        },
        from: {
            type: String,
            maxLength: 50
        },
        relationship: {
            type: Number,
            enum: [1, 2, 3]
        }
    },
    { timestamps : true }
)

const User = model("User", userSchema)
module.exports = User;