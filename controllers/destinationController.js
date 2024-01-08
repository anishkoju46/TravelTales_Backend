const { populate } = require('dotenv');
const {Destination} = require('../models/destination_model');

exports.fetchDestinations= async(req,res,next)=>{
    try {
        const destinations = await Destination.find()
        .populate({path: "reviews", model: "Review", select: {"_id": 1, "review":1, "userId":1}, populate: {path:"userId", model:"User", select:{"_id":1, "fullName":1}}})
        .populate("category", "_id name")
        
        return res.status(200).json(destinations)
    } catch (e) {
        console.log(e)
        next(e)
    }
};

exports.fetchDestinationByCategory = async(req,res,next)=>{
    try{
        const categoryId = req.params.id
        if(!categoryId)
        return this.fetchDestinations()
        const destinations = await Destination.find({"category": categoryId})
        .populate({path: "reviews", model: "Review", select: {"_id": 1, "review":1, "userId":1}, populate: {path:"userId", model:"User", select:{"_id":1, "fullName":1}}})
        .populate("category", "_id name")
        return res.status(200).json(destinations)
    }catch(e){
        next(e)
    }
};

exports.fetchOneDestination=async(req,res,next)=>{
    try {
        const destination = await Destination.findById(req.params.id)
    
      
        return res.status(200).json(destination)
    } 
    catch (e) {
        next(e)
    }
};

exports.create=async(req,res,next)=>{    try {
    var destination = Destination(req.body)
    await destination.save()

    return res.status(201).json(destination)
} catch (e) {
    next(e)
}}