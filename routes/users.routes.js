const router = require("express").Router();
const User = require("../models/user.model")
const Post = require("../models/post.model")

//Get user
router.get("/:id", async(req, res, next) => {
    try {
        const { id } = req.params
        const oneUser = await User.findOne({ _id: id })
        const relatedPosts = await Post.find({ userId: id })
        res.json({ user: oneUser, pets: relatedPosts })
        } catch (err) {
            console.log(err)
        }
})

//Delete user
//Get user
//follow a user
//unfollow a user

// router.get("/", (req, res, next) => {
//     res.status(200).json({ message : "Welcome to users page" })
// })

module.exports = router