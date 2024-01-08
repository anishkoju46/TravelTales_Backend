const express = require("express")
const app = express()
const compression = require("compression")
const cors = require("cors")
const errorController = require("../controllers/errorController")

app.use(compression())
app.use(express.json())
app.use(cors({ origin: "*" }))

// auth endpoint
app.use("/auth",require("../routes/auth"))
// user endpoint
app.use("/users",require("../routes/user"))
// destination endpoint
app.use("/destinations",require("../routes/destination"))
// review endpoint
app.use("/reviews",require("../routes/review"))
// category endpoint
app.use("/categories",require("../routes/category"))


app.use(errorController)

module.exports = app