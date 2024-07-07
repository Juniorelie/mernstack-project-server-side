const HttpError = require("../models/error");
const User = require("../models/user.model");


async function getUsers(req, res, next) {
    let users
    try {
        users = await User.find({}, "-password");
    } catch (err) {
        const error = new HttpError(
            "Failed getting the users, please try again",
            500
        );
        return next(error);
    }
    
    res.status(200).json({users: users});
};

async function signup(req, res, next) {
    const { name, email, password } = req.body;

    let existingUser
    try{
        existingUser = await User.findOne({ email: email })
    }catch (err) {
        const error = new HttpError(
            "Signup failed, please try again later",
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            "User already exists, try logging in ?",
            422
        );
        return next(error)
    }
    

    const createdUser = new User ({
        name,
        email,
        password,
        image : "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            "Sign up failed, please try again.", 500
        );
        return next(error);
    }

    res.status(201).json({user: createdUser});
}

async function login(req, res, next) {
    const { email, password } = req.body;

    let existingUser
    try{
        existingUser = await User.findOne({ email: email })
    }catch (err) {
        const error = new HttpError(
            "Login failed, please try again later",
            500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            "Invalid informations, could not log in",
            400
        );
        return next(error)
    }
    
    res.json({message: "Logged in"});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;