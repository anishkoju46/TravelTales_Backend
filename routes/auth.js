const authController = require("../controllers/authController")
const otpController = require("../controllers/otpController")


const router = require("express").Router()

//post method on endpoint /auth route /login 
router.post("/login",authController.login)
//post method on endpoint /auth route /signup
router.post("/signup",authController.signUp)
//post method on endpoint /auth route /otp to send email OTP
router.post("/otp",otpController.sendOTP)

module.exports = router