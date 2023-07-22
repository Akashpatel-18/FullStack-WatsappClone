const jwt = require('jsonwebtoken')
const User = require('../model/user')

exports.isAuthenticated = async (req,res,next) => {
    try {
      
        const token = req.body.token || req.params.token
       
        if(!token){
            return res.status(401).json({
                message:"login to continue"
            })
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id)
        next()

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
} 