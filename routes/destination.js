
const router = require("express").Router()
const destinationController = require("../controllers/destinationController")
const { auth } = require("../middlewares/authMiddle")
// GET method on endpoint /users with paramater id /users/userId
// to get detail of the user with specific id
router.get("/:id",auth, destinationController.fetchOneDestination)

//Get method on endpoint/ get destination on the basis of category
router.get("/category/:id",auth, destinationController.fetchDestinationByCategory)

// GET method on endpoint /users to get all or list of users
router.get("/",auth, destinationController.fetchDestinations)

// PUT method on endpoint /users with paramater id /users/id
// to update detail of the user with specific id
// router.put("/:id",async(req,res,next)=>{

// })

// POST method on endpoint /users to add a user
router.post("/",auth, destinationController.create)

module.exports = router