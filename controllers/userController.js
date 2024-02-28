const {User} = require('../models/user_model');
const {Review} = require('../models/review_model');
const {Destination} = require('../models/destination_model');
const bcrypt = require("bcrypt");

exports.fetchUsers= async(req,res,next)=>{
    try {
        const users = await User.find().sort({createdAt: -1}).select("fullName phone email imageUrl createdAt phoneNumber role")
        return res.status(200).json(users)
    } catch (e) {
        console.log(e)
        next(e)
    }
};

exports.fetchOneUser=async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id).populate("favourites", "_id, name")
    
      
        return res.status(200).json(user)
    } 
    catch (e) {
        next(e)
    }
};

exports.create=async(req,res,next)=>{    try {
    var user = User(req.body)
    await user.save()

    return res.status(201).json(user)
} catch (e) {
    next(e)
}}


exports.editUser = async (req, res, next) => {
    try {
        // console.log(req.body);
        const userId = req.user.id;
        //const userId = await User.findById(req.user.id)
        const updateFields = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(userId, {$set: updateFields}, {new: true}).populate("favourites", "_id");

        if (!updatedUser) {
            return res.status(404).json({message: "User Not Found"});
        }
        return res.status(200).json(updatedUser);
    } catch (e) {
        next(e);
    }
};

//When a user gets deleted,
    // All his reviews should be deleted.
    // All his ratings should be deleted.
    // All his fav should be deleted.

exports.deleteUser = async (req, res, next) => {
    try {
        // Get user ID from the authenticated user
        const userId = req.params.id;

        // Check if the user exists before attempting deletion
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        //Get all the reivews made my the user
        const userReviews = await Review.find({user : userId});

        // if(userReviews.length == 0){

        // }
        
        //update destination ratings and delete users reviews
        for(const review of userReviews){
            const destinationId = review.destination
            const destinationReviews = await Review.find({destination : destinationId});
            const destination = await Destination.findById(destinationId)
            const reviewCount = destinationReviews.length

            if(reviewCount == 0){
                
            }else if(reviewCount == 1){
                if(destination){
                    destination.rating = 0
                    await destination.save();
                }
               
            }else{
                if(destination){
                    destination.rating = ((destination.rating * 2) - review.rating)
                    await destination.save();
                }
            }

            //delete the user's review
            await Review.findByIdAndDelete(review._id);

        }

        //Delete all the user's reviews also
        //await Review.deleteMany({user: userId});

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (e) {
        next(e);
    }
};

// exports.addToFavourites = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const destinationId = req.params.id;

//     // Find the user by ID
//     const user = await User.findById(userId).populate("favourites", "_id name")
//     //.populate("favourites", "_id");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Find the destination by ID
//     const destination = await Destination.findById(destinationId);
//     if (!destination) {
//       return res.status(404).json({ message: "Destination not found" });
//     }

//     // Check if the destination is already in favorites
//     if (user.favourites.some(fav => fav._id.equals(destinationId))) {
//         return res.status(400).json({ message: "Destination already in favourites" });
//       }
//     // if (user.favourites.includes(destinationId)) {
//     //   return res.status(400).json({ message: "Destination already in favourites" });
//     // }

//     // Add destination ID to user's favourites
//     user.favourites.push(destinationId);

//     // Save the updated user
//     await user.save();

//     return res.status(200).json(user);
//     // return res.status(200).json({ message: "Destination added to favourites" });
//   } catch (e) {
//     next(e);
//     console.error(e);
//   }
// };

// exports.removeFromFavourites = async (req, res, next) => {
//     try {
//       const userId = req.user.id;
//       const destinationId = req.params.id;
  
//       // Find the user by ID
//       const user = await User.findById(userId).populate("favourites", "_id name");
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }
  
//       // Check if the destination is in the user's favorites
//       const indexToRemove = user.favourites.findIndex(fav => fav._id.equals(destinationId));
//       if (indexToRemove === -1) {
//         return res.status(400).json({ message: "Destination not in favourites" });
//       }
  
//       // Remove the destination from the user's favorites
//       user.favourites.splice(indexToRemove, 1);
  
//       // Save the updated user
//       await user.save();
  
//       return res.status(200).json(user);
//     } catch (e) {
//       next(e);
//       console.error(e);
//     }
//   };

  exports.toggleFavourite = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const destinationId = req.params.id;
  
      // Find the user by ID
      const user = await User.findById(userId).populate("favourites", "_id name");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the destination is already in favorites
      const indexToRemove = user.favourites.findIndex(fav => fav._id.equals(destinationId));
  
      if (indexToRemove === -1) {
        // If not in favorites, add it
        const destination = await Destination.findById(destinationId);
        if (!destination) {
          return res.status(404).json({ message: "Destination not found" });
        }
  
        // Add destination ID to user's favourites
        user.favourites.push(destinationId);
  
        // Save the updated user
        await user.save();
  
        // return res.status(200).json(user);
        return res.status(200).json({message: "Added To Favourites"})
      } else {
        // If in favorites, remove it
        user.favourites.splice(indexToRemove, 1);
  
        // Save the updated user
        await user.save();
  
        // return res.status(200).json(user);
        return res.status(200).json({message: "Removed from Favourites"})
      }
    } catch (e) {
      next(e);
      console.error(e);
    }
  };
  
  
  exports.changePassword = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the current password provided is correct
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password
      user.password = hashedNewPassword;
      await user.save();
  
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (e) {
      next(e);
    }
  };

// exports.addToFavourites = async (req, res, next) => {
//     try{
//         const userId = req.user.id
//         const destinationId = req.params.id

//         // console.log(destinationId)
//         const user = await User.findById(userId);
//         // console.log(user)
//         if (!user){
//             return res.status(404).json({message: "User not found"})
//         }

//         const destination = await Destination.findById(destinationId);
//         if (!destination) {
//             return res.status(404).json({ message: "Destination not found" });
//         }

//         if (user.favorites.includes(destinationId)){
//             return res.status(400).json({message: "Destination already in favorites"})
//         }

//         user.favorites.push(destinationId);
      
//         await user.save();
//         return res.status(200).json({message: "Destination added to favorites"})
//     }
//     catch(e){
//         next(e)
//         console.log(e)
//     }
// }

// exports.addToFavourites = async (req, res, next) => {
//     try{
//         const userId = req.user.id; // Assuming you have authentication middleware to get the user ID from the request

//         //Get the user
//         const user = await User.findById(userId)

//         if(!user){
//             return res.status(404).json({message: "User Not found"})
//         }

//         const destinationId = req.body.destinationId

//         //check if the destination exists
//         const destination = await Destination.findById(destinationId)

//         if(!destination){
//             return res.status(404).json({message: "Destination Not Found - sorry"})
//         }

//         //checking if the destination already exists in the user's favourite
//         if(user.favourites.includes(destinationId)){
//             return res.status(400).json({message: "Destination already in Fav List"})
//         }

//         //add destination to the user's fav list
//         user.favourites.push(destinationId)
//         await user.save()

//         return res.status(200).json({message: "Destination added to Fav List"})
//     }
//     catch(e){
//         next(e);
//     }
// }