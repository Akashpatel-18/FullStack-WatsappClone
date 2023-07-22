const Chat = require('../model/chat')
const User = require('../model/user')
const Message = require('../model/message')

exports.createChat = async (req,res) => {
    try {
        
        const {sender, recepient} = req.body

        const createChat = await Chat.create({members: [sender, recepient]})

        res.status(201).json(createChat)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.myProfile = async (req, res) => {
    try {
        console.log(req.user)
        const user = await User.findById(req.user._id)

        res.status(200).json({id: user._id, username: user.username, avatar: user.avatar})

    } catch (error) {
         res.status(500).json({message: error.message})
    }
}

exports.getMyUsers = async (req,res) => {
    try {
        
       const members = await Chat.find({members : {$in : [req.params.sender]}},{_id:0,members:1})
       
        const users = []
        for(let obj of members){
        otherRecepient = await obj.members.filter((id) => id !== req.params.sender)
        users.push(...otherRecepient)
        }

        const result = await User.find({_id : { $in : users, $nin: [req.params.sender]}},{_id:1,username:1,avatar:1})

        const userMessage = await Promise.all(
            result.map(async (user) => {
                const Messages = await Message.find({ $or: [{sender: req.params.sender, recepient: user._id},
                    {sender: user._id, recepient: req.params.sender}]} ,{content:1,timestamp:1,_id:0})
                let lastMessage;
                if(Messages.length > 0){
                    lastMessage = Messages[Messages.length - 1]
                }
                const data = {
                    user: user._doc,
                    lastMessage: lastMessage
                }
                return data
            })
        )

        res.status(200).json(userMessage)

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.getUser = async (req, res) => {
    try {
        
        const user = await User.findById(req.params.userId)

        res.status(200).json({id:user._id, username: user.username, avatar: user.avatar})

    } catch (error) {
         res.status(500).json({message: error.message})
    }
}

exports.getUsers = async (req,res) => {
    try {
        // const users = await User.find({},{_id:1,username:1,avatar:1})

        const members = await Chat.find({members : {$in : [req.params.sender]}},{_id:0,members:1})
       
        const users = []
        for(let obj of members){
        otherRecepient = await obj.members.filter((id) => id !== req.params.sender)
        users.push(...otherRecepient)
        }

        const result = await User.find({_id : { $nin : users}},{_id:1,username:1,avatar:1})


        res.status(200).json(result)

    } catch (error) {
         res.status(500).json({message: error.message})
    }
}

exports.allUsers = async (req,res) => {
    try {
        const users = await User.find({},{_id:1,username:1,avatar:1})
        res.status(200).json(users)
    } catch (error) {
         res.status(500).json({message: error.message})
    }
}

exports.searchUsers = async (req,res) => {
    try {

         const members = await Chat.find({members : {$in : [req.params.sender]}},{_id:0,members:1})
       
        const users = []
        for(let obj of members){
        otherRecepient = await obj.members.filter((id) => id !== req.params.sender)
        users.push(...otherRecepient)
        }

        const user = await User.find({_id : { $nin : users}, username : {$regex : req.params.person, $options : 'i'}},{_id:1,username:1,avatar:1})

        // const user = await User.find({username : {$regex : req.params.person, $options : 'i'}})
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}
