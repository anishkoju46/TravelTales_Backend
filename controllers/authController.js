const {User} = require('../models/user_model');
const {Destination} = require('../models/destination_model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//token le - kun user, and their role

exports.login=async(req,res,next)=>{
    // console.log(req.body)
    const input = req.body
    const user = await User.findOne({"email" : input.email})
    .populate({
        path: "favourites",
        select: "_id name rating imageUrl maxHeight duration region itinerary bestSeason emergencyContact description",
    });
    //.populate("favourites", "_id name")
    if(user){
        if (user.block){
            return res.status(403).json({"message": "Opps! your account is disabled"})
        }
        if(!await bcrypt.compare(input.password, user.password))
            return res.status(403).json({"message": "Incorrect Credentials"})

            const payload = {id: user._id, role: user.role, email: user.email}
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "5d"})

        const {password, ...others} = user._doc
        // console.log(others)
        return res.status(201).json({ ...others, token });
    }
    else{
        return res.status(401).json({"message": "User not found"})
    }
    
}


exports.signUp=async(req,res,next)=>{
    //user register
    try{
        const input = req.body
    if(!input.fullName || !input.email || !input.password || !input.phoneNumber) return res.status(400).json({"message": "All fields not filled"})
    const user = await User.findOne({"email": input.email, "phoneNumber": input.phoneNumber})
    if(user) return res.status(400).json({"message": "User Already Exists"})
    //const newUser = User(res.body)
    let hashedPassword
    hashedPassword = await bcrypt.hash(input.password, 10)
    
    const newUser = User({"fullName": input.fullName, "email": input.email, "phoneNumber": input.phoneNumber, "password": hashedPassword})
    await newUser.save()
    const {password, ...others} = newUser._doc
    return res.status(201).json({...others})
    }
    catch(e){
        console.log(e)
        next(e)
    }
    
}
exports.sendOtp=async(req,res,next)=>{}