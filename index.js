const dotenv = require("dotenv")
const express = require("express")
const mongoose = require("mongoose")
const http = require("http")



const app = require('./utils/url')
const { initBlocked } = require("./utils/blockedUsers")
dotenv.config()


mongoose.connect(process.env.ISPRODUCTION === "false" ? process.env.MONGO_URL_LOCAL : process.env.MONGO_URL_PRODUCTION, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
}).then(() => console.log("connection secured")).catch((e) => console.log(`connection unsucessful: ${e}`))

app.use("/static/", express.static("./static/"))



var httpserver = http.createServer(app)



httpserver.listen(process.env.PORT, function () {
    console.log("server started")
    initBlocked()
})
