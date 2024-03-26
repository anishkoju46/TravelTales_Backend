const {Category} = require('../models/category_model');

exports.fetchCategories= async(req,res,next)=>{
    try {
        console.log(req.user)
        const categories = await Category.find().populate("user", "_id fullName email")
        return res.status(200).json(categories)
    } catch (e) {
        // console.log(e)
        next(e)
    }
};

exports.fetchOneCategory=async(req,res,next)=>{
    try {
        const category = await Category.findById(req.params.id)
    
      
        return res.status(200).json(category)
    } 
    catch (e) {
        next(e)
    }
};

exports.create=async(req,res,next)=>{    try {
    var category = Category(req.body)
    await category.save()

    return res.status(201).json(category)
} catch (e) {
    next(e)
}}