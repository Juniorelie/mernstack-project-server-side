const router = require("express").Router()

router.use("/users", require("./users.routes.js"))
router.use("/posts", require("./posts.routes.js"))

module.exports = router
