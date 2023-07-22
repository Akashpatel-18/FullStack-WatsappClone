const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
   members: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}]
})

module.exports = mongoose.model('Chat',chatSchema)