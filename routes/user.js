
const router = require("express").Router()
const userControler = require("../controllers/userController")
const { auth, isAdmin } = require("../middlewares/authMiddle")
// GET method on endpoint /users with paramater id /users/userId
// to get detail of the user with specific id
router.get("/:id",auth, userControler.fetchOneUser)

// GET method on endpoint /users to get all or list of users
router.get("/",auth, isAdmin, userControler.fetchUsers)

// PUT method on endpoint /users with paramater id /users/id
// to update detail of the user with specific id
// router.put("/:id",async(req,res,next)=>{

// })

// // POST method on endpoint /users to add a user
router.post("/",auth, isAdmin, userControler.create)

module.exports = router