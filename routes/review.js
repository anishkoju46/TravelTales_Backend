
const router = require("express").Router()
const reviewControler = require("../controllers/reviewController")
const { auth } = require("../middlewares/authMiddle")
// GET method on endpoint /users with paramater id /users/userId
// to get detail of the user with specific id
router.get("/:id",auth, reviewControler.fetchOneReview)

// GET method on endpoint /users to get all or list of users
router.get("/",auth, reviewControler.fetchReviews)

// PUT method on endpoint /users with paramater id /users/id
// to update detail of the user with specific id
// router.put("/:id",async(req,res,next)=>{

// })

// // POST method on endpoint /users to add a user
router.post("/",auth, reviewControler.create)

module.exports = router