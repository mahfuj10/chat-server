import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { Request, Response } from "express";
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const port =  9000;



//middleware
app.use(express.json());
app.use(cors());

// mongodb connectiorsn

const uri = `mongodb+srv://mahfujurr042:IaoR5wxD07QYuycY@leaves.eaf0bsd.mongodb.net/`
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
console.log(client);



// socket.io connection
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
let onlineUsers: any = [];

io.on("connection", async(socket: any) => {
   try{

    console.log("User connected with ", socket.id);

    socket.on("join_room", (data: any) => {
        socket.join(data);
    })

    socket.on("send_message", (data: any) => {
        socket.to(data.roomId).emit("recive_message", data);
    })

    socket.on('typing', function (data: any) {
        socket.broadcast.emit('typing', data)
    })

    socket.on('deleteMessage', function (data: any) {
        socket.to(data.roomId).emit("deleteMessage", data);
    })

    socket.on('addedUser', function (data: any) {
        socket.emit('addedUser', data);
        console.log(data)
    })

    socket.on('joinedgroup', function (data: any) {
        socket.emit('joinedgroup', data);
        console.log(data)
    })

     // add new user
  socket.on("new-user-add", (newUserId: string) => {
    if (!onlineUsers.some((user: any) => user.userId === newUserId)) {  
      // if user is not added before
      onlineUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("new user is here!", onlineUsers);
    }
    // send all active users to new user
    io.emit("get-users", onlineUsers);
  });
  
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user: any) => user.socketId !== socket.id)
    console.log("user disconnected", onlineUsers);
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });
  
  socket.on("offline", () => {
    // remove user from active users
    onlineUsers = onlineUsers.filter((user: any) => user.socketId !== socket.id)
    console.log("user is offline", onlineUsers);
    // send all online users to all users
    io.emit("get-users", onlineUsers);
  });
     
   } catch(err){
    console.log('socket connection error',err);
   }

})


// import router
const users = require('./routes/users');
const chat = require('./routes/chat');
const groups = require('./routes/groups');

async function run() {

    try {

        app.use('/users', users);
        app.use('/chat', chat);
        app.use('/group', groups);

    }
    catch (err) {
        console.log(err)
    }
    finally {

    }
}
run().catch(e => console.log(e)).finally()

app.get("/", async (req: Request, res: Response) => {

    try {
        res.send("Leaves server is running...");
    } catch (err) {
        res.json({ message: 'server error' })
    }

})



server.listen(port, () => {
    console.log("my server is runningin port", port)
})