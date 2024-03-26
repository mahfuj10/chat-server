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

// const uri = `mongodb+srv://mahfujurr042:IaoR5wxD07QYuycY@leaves.eaf0bsd.mongodb.net/`
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });


// socket.io connection
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

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


    const users: any = {};

    socket.on('login', function (data: any) {
        users[socket.id] = data.loginUser?.uid
        socket.broadcast.emit('user-connected', data.loginUser);
    });


    socket.on('addedUser', function (data: any) {
        socket.emit('addedUser', data);
        console.log(data)
    })

    socket.on('joinedgroup', function (data: any) {
        socket.emit('joinedgroup', data);
        console.log(data)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
        console.log(`User disconnected ${socket.id}`);
    });
   } catch(err){
    console.log('socket connection error',err);
   }

})


// import router
// const users = require('../src/routes/users');
// const chat = require('../src/routes/chat');
// const groups = require('../src/routes/groups');

async function run() {

    try {

        // app.use('/users', users);
        // app.use('/chat', chat);
        // app.use('/group', groups);

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