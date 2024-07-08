const { Schema, model } = require("mongoose");

const postSchema = new Schema(
    {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        title : {
          type: String,
          required: true,
          maxLength: 50
        },
        description: {
          type: String,
          max: 500,
        },
        image: {
          type: String
        },
        likes:[{
          type: Schema.Types.ObjectId,
          ref: "User"
        }],
      },
      { timestamps: true }
)

const Post = model("Post", postSchema)
module.exports = Post;