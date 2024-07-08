const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const isAuth = require("../middlewares/isAuthenticated");
const SALT = 12

//Signup
router.post("/signup", async (req, res, next) => {
    
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
			return res
				.status(400)
				.json({ message: "username, email and password are mandatory." })
		}
        
        const foundUser = await User.findOne({$or: [{username}, {email}]})
        if (foundUser) {
            return res
            .status(400)
            .json({message: "User already exist with this email / username"})
        } 
        //generate hashed password in db
        const hashedPassword = await bcrypt.hash(password, SALT)

        //create new user
        const createdUser = await User.create({
        username,
        email,
        password: hashedPassword,
        })
        
        res.status(201).json({
            message: `Created user ${createdUser.username} with id ${createdUser._id}`,
        })
    } catch (error) {
        console.log(error)
    }
});

//Login
router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body       
        if (!email || !password) {
            return res.status(400).json({message: "Fill all your informations"});
        } 

        const foundUser = await User.findOne({ email }, { email: 1, password: 1 });
        if (!foundUser) {
            return res.status(400).json({message: "Wrong email or password"});
        }
        
        const correctPassword = await bcrypt.compare(password, foundUser.password)
        if (!correctPassword) {
            return res.status(400).json({ message: "Wrong email or password"})
        }

        const payload = { id: foundUser._id}
        const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: "1d",
            algorithm: "HS256",
        })

        res.json({ accessToken: token})
    } catch (err) {
        console.log(err)
    }  
})

//Verify
router.get('/verify', isAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.userId)
        res.json(user)
    } catch (err) {
        next(err)
    }
})

module.exports = router