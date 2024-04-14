
const router = require("express").Router()
const reviewControler = require("../controllers/reviewController")
const { auth, isAdmin } = require("../middlewares/authMiddle")
// GET method on endpoint /users with paramater id /users/userId
// to get detail of the user with specific id
router.get("/:id",auth, reviewControler.fetchOneReview)

router.get("/destinations/:id",auth, reviewControler.fetchReviews)

// GET method on endpoint /users to get all or list of users
router.get("/",auth, reviewControler.fetchReviews)



// PUT method on endpoint /users with paramater id /users/id
// to update detail of the user with specific id
// router.put("/:id",async(req,res,next)=>{

// })

router.put("/:id", auth, reviewControler.editReview)

// // POST method on endpoint /users to add a user
router.post("/",auth, reviewControler.create)

router.delete("/:id", auth, isAdmin, reviewControler.deleteReview)

module.exports = router