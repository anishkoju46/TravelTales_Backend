const { Destination } = require('../models/destination_model');
const {Review} = require('../models/review_model');
const mongoose = require('mongoose');

exports.fetchReviews= async(req,res,next)=>{
    try {
        //const reviews = await Review.find().populate("userId", {path: "User", select: "_id fullName email"})
        const destination = !req.params.id ? {} : {"destination" : req.params.id}
        const reviews = await Review.find(destination, {flagged: false}).populate("user", "_id fullName email imageUrl").populate("destination", "_id name").sort({createdAt : -1})
        return res.status(200).json(reviews)
    } catch (e) {
        console.log(e)
        next(e)
    }
};

exports.fetchOneReview=async(req,res,next)=>{
    try {
        const review = await Review.findById(req.params.id)
        
        return res.status(200).json(review)
    } 
    catch (e) {
        next(e)
    }
};

// exports.create=async(req,res,next)=>{    try {
//     var review = Review(req.body)
//     await review.save()
//     const createdReview = await Review.findById(review.id).populate("user", "_id fullName email imageUrl").populate("destination", "_id name")
//     return res.status(201).json(createdReview)
// } catch (e) {
//     next(e)
// }}

// exports.create = async(req,res,next)=>{
//     try{
//         //check garnu paryo existing review: for same person and same destination.
//         if(!req.body.user && !req.body.destination){
//             return res.status(400).json({message: "Invalid Input"})
//         }

//         const existingReview = await Review.findOne({user: req.body.user, destination: req.body.destination});
        
//         if(existingReview){
//             return res.status(400).json({message: "Your Review Already Exists"})
//         }

//         var review = Review(req.body)
//             await review.save()
//             const createdReview = await Review.findById(review.id).populate("user", "_id fullName email imageUrl").populate("destination", "_id name")
//             return res.status(201).json(createdReview)

//     }catch(e){
//         next(e);
//     }
// }

exports.create = async(req,res,next)=>{
    try{
        //check garnu paryo existing review: for same person and same destination.
        if(!req.body.user && !req.body.destination){
            return res.status(400).json({message: "Invalid Input"})
        }

        const existingReview = await Review.findOne({user: req.body.user, destination: req.body.destination});
        
        if(existingReview){
            return res.status(400).json({message: "Your Review Already Exists"})
        }

        var review = Review(req.body)
            await review.save()
            
            //Uta destination model ko rating tanyo
            const destination = await Destination.findById(req.body.destination)

            if(destination.rating === 0){
                destination.rating = req.body.rating
            }else{
                const totalRating = destination.rating
                const newTotalRating = (totalRating + review.rating) / 2
                destination.rating = newTotalRating
            }
            
            await destination.save()

            const createdReview = await Review.findById(review.id).populate("user", "_id fullName email imageUrl").populate("destination", "_id name")
            return res.status(201).json(createdReview)

    }catch(e){
        next(e);
    }
}

exports.editReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id;
        
        const updateFields = req.body;
        
        const updatedReview = await Review.findByIdAndUpdate(reviewId, {$set: updateFields}, {new: true});

        if (!updatedReview) {
            return res.status(404).json({message: "Review Not Found"});
        }
        return res.status(200).json(updatedReview);
    } catch (e) {
        next(e);
    }
};



exports.deleteReview = async (req, res, next) => {
    try {
        
        const reviewId = req.params.id;

        const existingReview = await Review.findById(reviewId);
        if (!existingReview) {
            return res.status(404).json({ message: "Review Not Found" });
        }

        const deletedReview = await Review.findByIdAndDelete(reviewId);

        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (e) {
        next(e);
    }
};