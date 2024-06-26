const {User} = require('../models/user_model');
const {Review} = require('../models/review_model');
const {Destination} = require('../models/destination_model');
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { promisify } = require('util');
const { blockUnblockUser } = require('../utils/blockedUsers');


exports.fetchUsers= async(req,res,next)=>{
    try {
        const users = await User.find().sort({createdAt: -1}).select("fullName phone email imageUrl createdAt phoneNumber role block")
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

// When a user gets deleted,
//     All his reviews should be deleted.
//     All his ratings should be deleted.
//     All his fav should be deleted.

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


exports.blockUser = async (req, res, next) => {
  try {
      // Get user ID from the request parameters
      const userId = req.params.id;

      // Check if the user exists
      const existingUser = await User.findById(userId);
      if (!existingUser) {
          return res.status(404).json({ message: "User Not Found" });
      }

      // Toggle the user's block status
      if (existingUser.block) {
          // If user is blocked, unblock them
          existingUser.block = false;
          await existingUser.save();
          blockUnblockUser(existingUser._id)
          return res.status(200).json({ message: "User unblocked successfully" });
      } else {
          // If user is not blocked, block them
          existingUser.block = true;
          await existingUser.save();
          blockUnblockUser(existingUser._id)
          return res.status(200).json({ message: "User blocked successfully" });
      }
  } catch (e) {
      // Pass any errors to the error handling middleware
      next(e);
  }
};


exports.uploadPicture = async (req, res, next) => {
  try {
      const form = new formidable.IncomingForm();

      // Specify the directory where uploaded files should be stored
      const uploadDir = path.join('uploads');

      // Check if the directory exists, create it if it doesn't
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }

      form.uploadDir = uploadDir;

      form.parse(req, async (err, fields, files) => {
          if (err) {
              next(err);
              return;
          }

          const uploadedImage = files && files.image;

          if (uploadedImage && uploadedImage.length > 0) {
              const oldPath = uploadedImage[0].filepath;
              const newFileName = uploadedImage[0].newFilename + '.jpg';
              const newFilePath = path.join(uploadDir, newFileName);
              console.log(` newfilepath : ${newFilePath}`)
              // Compressing the image
              await compressImage(oldPath, newFilePath);

              // const fileSize = fs.statSync(newFilePath).size;


              fs.rename(oldPath, newFilePath, async (err) => {
                  if (err) {
                      console.log(err)
                      next(` rename wala error ${err}`)
                  }
                  try {


                      // Update user's image URL and save user
                      const userId = req.user.id;
                      const user = await User.findById(userId);
                      user.imageUrl = newFilePath;
                      await user.save();

                      res.status(200).json({ message: 'Image uploaded and compressed successfully.', filePath: newFilePath });
                  }
                  catch (error) {
                      console.log(` catch :${error}`)
                      next(error);
                  }
              })
          } else {
              res.status(400).json({ message: 'No image uploaded.' });
          }
      });
  } catch (e) {
      console.error(e);
      next(e);
  }
}

exports.deletePicture = async (req, res, next) => {
    try {
        // Get the user ID from the request
        const userId = req.user.id;

        // Find the user by ID
        const user = await User.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the user already has an image URL
        if (!user.imageUrl) {
            return res.status(400).json({ message: "User's image URL not found." });
        }

        // Remove the image URL from the user document
        user.imageUrl = '';

        // Save the updated user document
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: "User's image URL deleted successfully." });
    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
};



async function compressImage(oldPath, newFilePath) {
  let quality = 70; // Initial quality setting
  let fileSize = fs.statSync(oldPath).size;

  while (fileSize > 1000000 && quality > 10) {
    // Reduce quality and compress the image
    await sharp(oldPath)
      .resize({ width: 800 }) // Adjust the width as needed
      .jpeg({ quality: quality }) // Adjust quality as needed
      .toFile(newFilePath);

    // Check the size of the compressed image
    fileSize = fs.statSync(newFilePath).size;

    // Decrease quality for the next iteration
    quality -= 10;
  }
}


exports.uploadGallery = async (req, res, next) => {
  try {
      const form = new formidable.IncomingForm();

      // Specify the directory where uploaded files should be stored
      const uploadDir = path.join('gallery');

      // Check if the directory exists, create it if it doesn't
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }

      form.uploadDir = uploadDir;

      form.parse(req, async (err, fields, files) => {
          if (err) {
              next(err);
              return;
          }

          const uploadedImages = files && files.image;

          if (uploadedImages && uploadedImages.length > 0) {
              const imageUploadPromises = uploadedImages.map(async (image) => {
                  const oldPath = image.filepath;
                  const newFileName = image.newFilename + '.jpg';
                  const newFilePath = path.join(uploadDir, newFileName);
                  // Compressing the image
                  await compressImage(oldPath, newFilePath);
                  // Move the image to the gallery directory
                  await promisify(fs.rename)(oldPath, newFilePath);
                  return path.join('gallery', newFileName); // Storing relative path
              });

              // Wait for all images to be uploaded and renamed
              const relativeImagePaths = await Promise.all(imageUploadPromises);

              // Update user's gallery and save user
              const userId = req.user.id;
              const user = await User.findById(userId);
              user.gallery = user.gallery.concat(relativeImagePaths);
              await user.save();

              res.status(200).json({ message: 'Images uploaded and added to gallery successfully.', relativePaths: relativeImagePaths });
          } else {
              res.status(400).json({ message: 'No images uploaded.' });
          }
      });
  } catch (error) {
      console.error(error);
      next(error);
  }
};

exports.deleteImageFromGallery = async (req, res, next) => {
    try {
      const { imageUrl } = req.body;
  
      if (!imageUrl) {
        return res.status(400).json({ message: 'Image URL is required.' });
      }

    //   imageUrl = imageUrl.replace(/\\/g, '\\\\');
  
      const userId = req.user.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      const indexOfImage = user.gallery.indexOf(imageUrl);
  
      if (indexOfImage === -1) {
        // Image URL not found in the gallery
        return res.status(404).json({ message: 'Image not found in user\'s gallery.' });
      }
  
      // Remove the image URL from the gallery array
      user.gallery.splice(indexOfImage, 1);
      await user.save();
  
      // Perform deletion operation here (if necessary)
  
      res.status(200).json({message: 'Image deleted from user\'s gallery successfully.' });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };



  exports.toggleFavourite = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const destinationId = req.params.id;
  
      // Find the user by ID
      const user = await User.findById(userId)
      //.populate("favourites", "_id name");
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
  
         return res.status(200).json({favourites : user.favourites});
        //return res.status(200).json({message: "Added To Favourites"})
      } else {
        // If in favorites, remove it
        user.favourites.splice(indexToRemove, 1);
  
        // Save the updated user
        await user.save();
  
        return res.status(200).json({favourites : user.favourites});
        //return res.status(200).json({message: "Removed from Favourites"})
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
  
      // Check if the new password is different from the current password
      if (currentPassword === newPassword) {
        return res.status(400).json({ message: "New password must be different from the current password" });
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


  exports.fetchFavourites = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate("favourites", "_id name")

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Extract therapistName from each favorite
        const favoritesWithTherapistNames = user.favorites.map(favorite => {
            return {
                therapistId: favorite._id,
                therapistName: favorite.user.fullName
                // Add other fields you may need from the favorite
            };
        });
        console.log(favoritesWithTherapistNames)
        return res.status(200).json(favoritesWithTherapistNames)
    }
    catch (e) {
        next(e)
        console.log(e)
    }
}