const router = require("express").Router();
const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const SALT = 12;

//Update user
router.put(":/id", async(req, res, next) => {
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        if (req.body.password) {
            try {
                req.body.password = await bcrypt.hash(req.body.password, SALT)
            } catch (err) {
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id,
                {$set: req.body} //set all input inside body
             )
             res.status(200).json({message: "Account has been updated"})
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json({message: "You can only update your account !"})
    }
})

//Delete user
//Get user
//follow a user
//unfollow a user

router.get("/", (req, res, next) => {
    res.status(200).json({ message : "Welcome to users page" })
})

module.exports = router