const {User} = require('../models/user_model');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//token le - kun user, and their role

exports.login=async(req,res,next)=>{
    // console.log(req.body)
    const input = req.body
    const user = await User.findOne({"email" : input.email}).populate("favourites", "_id name")
    if(user){
        if(!await bcrypt.compare(input.password, user.password))
            return res.status(403).json({"message": "Incorrect Credentials"})

            const payload = {id: user._id, role: user.role, email: user.email}
            let token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "5d"})

        const {password, ...others} = user._doc
        return res.status(201).json({ ...others, token });
    }
    else{
        return res.status(401).json({"message": "User not found"})
    }
    
}

// exports.signUp = async (req, res, next) => {
//     try {
//         const input = req.body;

//         // Check if all required fields are filled
//         if (!input.fullName || !input.email || !input.password || !input.phoneNumber) {
//             return res.status(400).json({ "message": "All fields must be filled" });
//         }

//         // Check if the email ends with "@gmail.com"
//         if (!input.email.endsWith("@gmail.com")) {
//             return res.status(400).json({ "message": "Email must end with @gmail.com" });
//         }

//         // Check if the phone number is 10 digits
//         if (input.phoneNumber.length !== 10 || !/^\d+$/.test(input.phoneNumber)) {
//             return res.status(400).json({ "message": "Phone number must be 10 digits long and contain only digits" });
//         }

//         // Check if the user with the provided email or phone number already exists
//         const existingUser = await User.findOne({ $or: [{ "email": input.email }, { "phoneNumber": input.phoneNumber }] });
//         if (existingUser) {
//             return res.status(400).json({ "message": "User already exists with same email or phone number" });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(input.password, 10);

//         // Create a new user with hashed password
//         const newUser = new User({
//             "fullName": input.fullName,
//             "email": input.email,
//             "phoneNumber": input.phoneNumber,
//             "password": hashedPassword
//         });

//         // Save the new user to the database
//         await newUser.save();

//         // Return the response without the password
//         const { password, ...others } = newUser._doc;
//         return res.status(201).json({ ...others });
//     } catch (e) {
//         console.log(e);
//         next(e);
//     }
// };

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