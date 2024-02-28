
const router = require("express").Router()
const destinationController = require("../controllers/destinationController")
const { auth, isAdmin } = require("../middlewares/authMiddle")
// GET method on endpoint /users with paramater id /users/userId
// to get detail of the user with specific id
router.get("/near", destinationController.fetchDestinationNearBy)

router.get("/:id",auth, destinationController.fetchOneDestination)

//Get method on endpoint/ get destination on the basis of category
router.get("/category/:id",auth, destinationController.fetchDestinationByCategory)

// GET method on endpoint /users to get all or list of users
router.get("/",auth, destinationController.fetchDestinations)

router.post("/search", auth, destinationController.searchDestinations)
// PUT method on endpoint /users with paramater id /users/id
// to update detail of the user with specific id
// router.put("/:id",async(req,res,next)=>{

// })

router.put("/:id",auth, isAdmin, destinationController.editDestination)

// POST method on endpoint /users to add a user
router.post("/",auth, isAdmin, destinationController.create)

router.delete("/:id",auth, isAdmin, destinationController.deleteDestination)

module.exports = router