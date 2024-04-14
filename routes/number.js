const router = require("express").Router()
const numbersController = require("../controllers/numbersController")
const {auth, isAdmin} = require("../middlewares/authMiddle")

router.get("/:id",auth,numbersController.fetchOneHotlineNumber)

// GET method on endpoint /users to get all or list of users
router.get("/",auth,numbersController.fetchHotlineNumbers)

// PUT method on endpoint 
router.put("/:id", auth,isAdmin, numbersController.editHotlineNumber)

// to delete goal of the user with specific id
router.delete("/:id", auth, isAdmin, numbersController.deleteHotlineNumber)


// // POST method on endpoint /users to add a user
router.post("/",auth, isAdmin, numbersController.createHotlineNumber)

module.exports = router