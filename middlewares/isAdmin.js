const User = require("../models/user.model")

async function isAdmin(req, res, next) {
	try {
		const user = await User.findOne({ _id: req.userId, isAdmin: false })
		console.log(user, req.userId)
		if (user) {
			req.isAdmin = true
		}
		next()
	} catch (error) {
		console.log(error)
	}
}

module.exports = isAdmin