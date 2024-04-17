
const router = require("express").Router()
const userController = require("../controllers/userController")
const { auth, isAdmin } = require("../middlewares/authMiddle")
// GET method on endpoint /users with paramater id /users/userId
// to get detail of the user with specific id
router.get("/:id",auth, userController.fetchOneUser)

// GET method on endpoint /users to get all or list of users
router.get("/",auth, isAdmin, userController.fetchUsers)

// PUT method on endpoint /users with paramater id /users/id
// to update detail of the user with specific id
// router.put("/:id",async(req,res,next)=>{

// })

//mero wala hai
router.put("/", auth, userController.editUser);

// // POST method on endpoint /users to add a user
router.post("/",auth, isAdmin, userController.create)

// router.post("/addToFavourites/:id", auth, userController.addToFavourites)

router.put("/blockUser/:id", auth, isAdmin, userController.blockUser);

router.delete("/:id", auth, userController.deleteUser);

// router.delete('/removeFromFavourites/:id', auth, userController.removeFromFavourites);

router.put('/toggleFavourite/:id', auth, userController.toggleFavourite);

router.put('/changePassword', auth, userController.changePassword);

router.post('/uploadPicture', auth, userController.uploadPicture);

router.post('/uploadGallery', auth, userController.uploadGallery);

router.put('/deletePicture', auth, userController.deletePicture);

router.put('/deleteImageFromGallery', auth, userController.deleteImageFromGallery);

module.exports = router