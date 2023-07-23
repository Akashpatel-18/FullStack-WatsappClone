const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
// const Pusher = require('pusher')
const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')
const messageRoutes = require('./routes/message')
dotenv.config()
const app = express()
const port = process.env.PORT || 3001;
const server = require('http').createServer(app);
const io = require('socket.io')(server,  {
    cors: {
      origin: '*',
    }
});

// const pusher = new Pusher({
//     appId: "1639470",
//     key: "afe2e28725327797d919",
//     secret : "6cc9165996e6eefa6e2f",
//     cluster: "ap2",
//     useTLS: true
// })


app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json({extended : true, limit: '30mb'}))
app.use(bodyParser.urlencoded({extended : true, limit: '30mb'}))

// mongoose.connect(process.env.MONGO_URL)
// .then(() => console.log("mongodb connected"))
// .catch((err) => console.log(Error, err))

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

app.get('/', (req,res) => {
    res.json("welcome")
})

app.use('/api/v1',userRoutes)
app.use('/api/v1',chatRoutes)
app.use('/api/v1',messageRoutes)

let activeUsers = []


io.on("connection", (socket) => {
 
  

    console.log("new User connected:", socket.id)
    socket.on('join', (userId) => {

        if(socket.room) {
            socket.leave(socket.room)
        }
  
          if(!activeUsers.some((user) => user.userId === userId)){
            activeUsers.push({
                userId,
                socketId: socket.id
            })
          }
      
        io.emit('onlineUsers', activeUsers)
        socket.join(`user_${userId}`)
        socket.room = `user_${userId}`

        console.log(`user with ID ${userId} joined room ${socket.room}`)

    })

    socket.on("sendMessage", ({data, recepient}) => {
        socket.to(`user_${recepient}`).emit("receiveMessage", data)

        console.log(`message sent to user with ID ${recepient}`)
    })

    socket.on("disconnect", () => {
        console.log(`user with ID ${socket.room?.split('_')[1]} disconnected`)
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
        
        io.emit('onlineUsers', activeUsers)
    })

  
})

// pusher.trigger("my-channel", "my-event", {
//     message: "hello World"
// })


// server.listen(port, () => {
//     console.log(`server started on port ${port}`)
// })

connectDB().then(() => {
    server.listen(port, () => {
        console.log("listening for requests");
    })
})

