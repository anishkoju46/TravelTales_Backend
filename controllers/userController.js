const {User} = require('../models/user_model');

exports.fetchUsers= async(req,res,next)=>{
    try {
        const users = await User.find().select("fullName phone info.emailVerfied")
        return res.status(200).json(users)
    } catch (e) {
        console.log(e)
        next(e)
    }
};

exports.fetchOneUser=async(req,res,next)=>{
    try {
        const user = await User.findById(req.user.id)
    
      
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



exports.deleteUser = async (req, res, next) => {
    try {
        // Get user ID from the authenticated user
        const userId = req.user.id;

        // Check if the user exists before attempting deletion
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User Not Found" });
        }

        // Delete the user
        const deletedUser = await User.findByIdAndDelete(userId);

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (e) {
        next(e);
    }
};

