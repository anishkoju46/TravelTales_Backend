const { populate } = require('dotenv');
const {Destination} = require('../models/destination_model');

exports.fetchDestinations= async(req,res,next)=>{
    try {
        const destinations = await Destination.find()
        //.populate({path: "reviews", model: "Review", select: {"_id": 1, "review":1, "user":1, "createdAt":1}, populate: {path:"user", model:"User", select:{"_id":1, "fullName":1}}})
        .populate("category", "_id name").select("-reviews")
        // .sort({views: -1})
        
        return res.status(200).json(destinations)
    } catch (e) {
        //console.log(e)
        next(e)
    }
};

exports.fetchDestinationNearBy = async(req,res,next)=>{
   try{
    const destination = await Destination.aggregate([{$geoNear : {near: {type : "Point", coordinates: [85.4310996415024,27.67300643425992]}, spherical : true, distanceField: "distance"}},
    // {$lookup : {from : "", localField : "", foreignFeild : ""}},
    {$project : {_id : 1, name:1, category:1, distance : 1, avgDistance : {$divide : [{$add : ["$distance", {$multiply : ["$distance", Math.sqrt(2)]}]}, 2]}}}])

    return res.status(200).json(destination)
    
   }catch(e){
    next(e)
   }
}

// exports.fetchDestinationNearBy = async(req,res,next)=>{
//    try{
//     const destination = await Destination.aggregate([{$geoNear : {near: {type : "Point", coordinates: [85.4310996415024,27.67300643425992]}, spherical : true, distanceField: "distance"}}])
//     return res.status(200).json(destination)
//    }catch(e){
//     next(e)
//    }
// }

// exports.fetchDestinationNearBy = async(req,res,next)=>{
//     try{
//      const destination = await Destination.aggregate([{$geoNear : {near: {type : "Point", coordinates: [85.4310996415024,27.67300643425992]}, spherical : true, distanceField: "distance"}}])

//      if (destination.length > 0){
//         const avgKM = destination.map(dest => {
//             return {
//                 ...dest,distance: (dest.distance + Math.sqrt(2) * dest.distance) / 2
//             }
//         })
//         return res.status(200).json(avgKM)
//      }else{
//         return res.status(200).json({message: "No destination Found"})
//      }
     
//     }catch(e){
//      next(e)
//     }
//  }

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
    //console.log(destination)
    const newDestination = await Destination.findById(destination._id.toString()).populate({path: "category", model: "Category",  select:{"_id":1, "name":1}})
    return res.status(201).json(newDestination)
} catch (e) {
    next(e)
}}

exports.editDestination = async (req, res, next) => {
    try {
        const destinationId = req.params.id;
        
        const updateFields = req.body;
        
        const updatedDestination = await Destination.findByIdAndUpdate(destinationId, {$set: updateFields}, {new: true}).populate({path: "category", model: "Category",  select:{"_id":1, "name":1}},);

        if (!updatedDestination) {
            return res.status(404).json({message: "Destination Not Found"});
        }
        console.log(updatedDestination)
        return res.status(200).json(updatedDestination);
    } catch (e) {
        next(e);
    }
};



exports.deleteDestination = async (req, res, next) => {
    try {
        const destinationId = req.params.id;

        const existingDestination = await Destination.findById(destinationId);
        if (!existingDestination) {
            return res.status(404).json({ message: "Destination Not Found" });
        }

        const deletedDestination = await Destination.findByIdAndDelete(destinationId);

        return res.status(200).json({ message: "Destination deleted successfully" });
    } catch (e) {
        next(e);
    }
};