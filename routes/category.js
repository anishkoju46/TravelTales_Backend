
const router = require("express").Router()
const categoryControler = require("../controllers/categoryController")
const { auth, isAdmin } = require("../middlewares/authMiddle")
// GET method on endpoint /users with paramater id /users/userId
// to get detail of the user with specific id
router.get("/:id",auth, categoryControler.fetchOneCategory)

// GET method on endpoint /users to get all or list of users
router.get("/",auth, categoryControler.fetchCategories)

// PUT method on endpoint /users with paramater id /users/id
// to update detail of the user with specific id
// router.put("/:id",async(req,res,next)=>{

// })

// // POST method on endpoint /users to add a user
router.post("/",auth, isAdmin, categoryControler.create)

module.exports = router