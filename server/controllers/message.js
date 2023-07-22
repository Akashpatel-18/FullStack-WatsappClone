const Message = require('../model/message')

exports.createMessage = async (req,res) => {
    try {
        
            const {sender, recepient, content} = req.body
             const newMessage = await Message.create({
            sender: sender,
            recepient: recepient,
            content: content,
    
        })

        res.status(201).json(newMessage)
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