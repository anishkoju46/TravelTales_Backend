const { Destination } = require('../models/destination_model');
const {Review} = require('../models/review_model');

exports.fetchReviews= async(req,res,next)=>{
    try {
        //const reviews = await Review.find().populate("userId", {path: "User", select: "_id fullName email"})
        const destination = !req.params.id ? {} : {"destination" : req.params.id}
        const reviews = await Review.find(destination).populate("user", "_id fullName email imageUrl").populate("destination", "_id name").sort({createdAt : -1})
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

exports.create=async(req,res,next)=>{    try {
    var review = Review(req.body)
    await review.save()
    const createdReview = await Review.findById(review.id).populate("user", "_id fullName email imageUrl").populate("destination", "_id name")
    return res.status(201).json(createdReview)
} catch (e) {
    next(e)
}}

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