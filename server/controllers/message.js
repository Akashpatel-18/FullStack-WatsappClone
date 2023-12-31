const Message = require('../model/message')

exports.createMessage = async (req,res) => {
    try {
        
            if(req.body.image){
            const newMessage = await Message.create({
            sender: req.body.sender,
            recepient: req.body.recepient,
            image: req.body.image
        })
        
        res.status(201).json(newMessage)
            }

             if(req.body.content){
            const newMessage = await Message.create({
            sender: req.body.sender,
            recepient: req.body.recepient,
            content: req.body.content,
        })
       
        res.status(201).json(newMessage)
            }
        }
     catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
}

exports.getMessage = async (req,res) => {
    try {
        
        const messages = await Message.find({
            $or: [
                { sender: req.params.sender, recepient: req.params.recepient},
                { sender: req.params.recepient, recepient: req.params.sender}
            ]
        })

            res.status(200).json(messages)

    } catch (error) {
         res.status(500).json({message:error.message})
    }
}