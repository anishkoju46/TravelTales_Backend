const {User} = require('../models/user_model');
const {Review} = require('../models/review_model');
const {Destination} = require('../models/destination_model');

exports.fetchUsers= async(req,res,next)=>{
    try {
        const users = await User.find().sort({createdAt: -1}).select("fullName phone email imageUrl createdAt phoneNumber")
        return res.status(200).json(users)
    } catch (e) {
        console.log(e)
        next(e)
    }
};

exports.fetchOneUser=async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id)
    
      
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

// exports.editUser = async(req, res, next)=>{
//     try{
//         const userId = req.user.userId;
//         //const userId = await User.findById(req.user.id)
//         const updateFeilds = req.body;
        
//         const updatedUser = await User.findByIdAndUpdate(userId, {$set:updateFeilds}, {new: true});

//         if(!updatedUser){
//             return res.status(404).json({message: "User Not Found"});
//         }
//         return res.status(200).json(updatedUser);
//     }
//     catch(e){
//         next(e);
//     }
// };

exports.editUser = async (req, res, next) => {
    try {
        // console.log(req.body);
        const userId = req.user.id;
        //const userId = await User.findById(req.user.id)
        const updateFields = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(userId, {$set: updateFields}, {new: true});

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