const express = require('express');
const mongoose = require('mongoose');
const { MessageModel, UserModel } = require('./model');
const app = express();
const http = require('http');
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const { Server } = require('socket.io');
const dbConnect = require('./config/db');
require('dotenv').config();
const UserRouter = require('./routes/user.routes');
const jwt = require('jsonwebtoken');
const MessageRouter = require('./routes/message.routes');
const server = http.createServer(app);
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors());
app.use('/user',UserRouter);
app.use('/message',MessageRouter);
const io = new Server(server,{
  cors: {
    origin: '*',
    methods: ['GET', 'POST','DELETE','PATCH'],
  },
});
let totalUser=0;
io.on('connection',async(socket)=>{
  socket.on("new message",async(data)=>{ 
    const token = data.token;
    const check = jwt.verify(token,process.env.MAIN_TOKEN);
    if(!check){
      return;
    }
    const {id} = check;
    const newMessage =new MessageModel({...data,sender:id});
    await newMessage.save();
    const messages = await MessageModel.find().populate(["sender"]);
    // console.log("client said",messages);
    io.emit("messageResponse",messages);
    });
    socket.broadcast.emit("newuser")
    socket.on('disconnect',()=>{
        // console.log("User disconnected",--totalUser);
    })
});
app.get('/',(req,res)=>res.send("Welcome"));
server.listen(PORT,async ()=>{
  mongoose.set('strictQuery', true);
  await dbConnect();
  console.log(`Server is running on port ${PORT}`);
});