import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { Request, Response } from "express";
import { connectToDatabase } from './db';
import cors from "cors";
require("dotenv").config();


const app = express();
const port =  process.env.PORT || 9000;

//middleware
app.use(express.json());
app.use(cors());


// mongodb connectiorsn
async function connectDatabase() {
    try {
        await connectToDatabase();
        console.log('DB connected');
        // Your code to start the server or perform other initialization tasks
    } catch (error) {
        console.error('Error starting the application:', error);
        process.exit(1); // Exit the application if unable to connect to the database
    }
}

// socket.io connection
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
let onlineUsers:any = {};

io.on("connection", async(socket: any) => {
   try{
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
        socket.broadcast.emit('joinedgroup', data);
        console.log(data)
    })

    socket.on("user_connected", (user_id: string) => {
        onlineUsers[user_id] = socket.id
        socket.emit('updateUserStatus', onlineUsers)
        console.log(onlineUsers);
        console.log(`User connected user_id ${user_id}`);
    });
  
    socket.on("disconnect", () => {
        Object.keys(onlineUsers).forEach(userId => {
            if (onlineUsers[userId] === socket.id) {
              delete onlineUsers[userId];
            }
        });

        socket.emit('users_inactive', onlineUsers)
        
        console.log(`User disconnected socketId ${socket.id}`);
    });
   
     
   } catch(err){
    console.log('socket connection error',err);
   }

})


// import router

async function run() {
    try {
        await connectDatabase()

        app.use('/users', require('./routes/users'));
        app.use('/chat', require('./routes/chat'));
        app.use('/group', require('./routes/groups'));

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