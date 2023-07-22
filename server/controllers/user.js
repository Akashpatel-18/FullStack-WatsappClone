const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.signUp = async (req,res) => {
    try {
        const {username, email, password, avatar} = req.body

        const checkName = await User.findOne({username})

        if(checkName){
            return res.status(400).json({message: "Username is already taken"})
        }

        const checkEmail = await User.findOne({email})

        if(checkEmail){
            return res.status(400).json({message:"User already exists"})
        }

        if(password){
            if(password.length < 8){
               return res.status(400).json({message: "Password length must be at least 8 characters"})
            }
        }

       

        if(avatar){
            
             const hashPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
            username, email, password:hashPassword, avatar 
            })
            const token = jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET)

            res.status(201).json({id:user._id, username:user.username, avatar: user.avatar, token: token})

        }


    } catch (error) {
        res.status(500).json({message: error.message})
    }
}


exports.login = async (req,res) => {
        try {
        
        const {email,password} = req.body
        const user = await User.findOne({email})

        if(!user){
            return res.status(404).json({message:"Invalid Credentials"})
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        
        if(!checkPassword){
            return res.status(400).json({message:"Invalid Credentials"})
        }

        const token = jwt.sign({email: user.email, id: user._id}, process.env.JWT_SECRET)

        res.status(200).json({id: user._id,username:  user.username,avatar:user.avatar, token: token})

    } catch (error) {
     res.status(500).json({message: error.message})
    }
}


