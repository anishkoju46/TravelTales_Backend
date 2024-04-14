const express = require("express")
const app = express()
const compression = require("compression")
const cors = require("cors")
const errorController = require("../controllers/errorController")

app.use(compression())
app.use(express.json())
app.use(cors({ origin: "*" }))
app.use('/uploads' ,express.static('uploads'))
app.use('/gallery' ,express.static('gallery'))
app.use('/destination_images' ,express.static('destination_images'))

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
//emgergency number endpoint
app.use("/numbers",require("../routes/number"))


app.use(errorController)

module.exports = app


// The use of app in the url.js file is to configure and assemble an instance of the Express
// application by setting up middleware, defining routes, and handling errors, ultimately exporting
// the configured Express application for use in other parts of the codebase.