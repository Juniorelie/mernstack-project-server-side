const { v4: uuid } = require("uuid");

const HttpError = require("../models/error");

const DUMMY_USERS = [
    {
        id: "u1",
        name: "Elie",
        email: "email@mail.com",
        password: "test"
    }
];


function getUsers(req, res, next) {
    res.status(200).json({users: DUMMY_USERS});
}

function signup(req, res, next) {
    const {name, email, password} = req.body;

    const hasUser = DUMMY_USERS.find(u => u.email === email);
    if (hasUser) {
        throw new HttpError("User already exist, try logging in ?", 422);
    }

    const createdUser = {
        id: uuid(),
        name,
        email,
        password
    };

    DUMMY_USERS.push(createdUser);
    res.status(201).json({user: createdUser});
}

function login(req, res, next) {
    const { email, password } = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError("Could not identify user, email or password seems to be wrong", 401)
    }
    res.json({message: "Logged in"});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;