const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.auth = (req,res,next)=>{
    try {
        //extract JWT token
        const token = req.headers["x-access-token"]
        // ||req.body.token || req.cookies.token
        if(!token){
            return res.status(401).json({
                success: false,
                message: "A token is required for authentication"
            })
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            //console.log(req.user)
        } catch (error) {
            return res.status(403).json({
                success:false,
                message: "invalid Token ⚠️"
            })
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success:false,
            message: "Error Occured in Authentication ⚠️"
        })
    }
}



exports.isAdmin = (req,res,next)=>{
    try {
        if(req.user.role !== true){
            return res.status(401).json({
                success:false,
                message: "You are not authorized Admin⚠️"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Some error occured⚠️: "+error
        })
    }
}