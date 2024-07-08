const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const SALT = 12

//Signup
router.post("/signup", async (req, res, next) => {
    

    try {
        //generate new password
        const hashedPassword = await bcrypt.hash(req.body.password, SALT)

        //create new user
        const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
        })

        //Save user and return response
        const user = await newUser.save()
        res.status(201).json(user)
    } catch (err) {
        console.log(err)
    }
});

//Login
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({email:req.body.email});
        if (!user) {
            return res.status(400).json({message: "Wrong credentials"});
        } 

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            return res.status(400).json({message: "Wrong credentials"});
        }
        
        res.status(200).json(user)
    } catch (err) {
        console.log(err)
    }  
})


module.exports = router