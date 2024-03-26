import { Request, Response, NextFunction } from "express";
const express = require('express')
const router = express.Router();
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const gulp = require('gulp');
const tinypng = require('gulp-tinypng-compress');
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@leaves.eaf0bsd.mongodb.net/`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("Leaves");
const usersChat = database.collection('chats');

client.connect();


// post user message

router.post('/', async (req: Request, res: Response) => {
    try {
        gulp.task('tinypng', function () {
            gulp.src(req.body.picture)
                .pipe(tinypng({
                    key: 'fB84pKZmS03LBzgS0yCPK3862c5hslh7',
                    sigFile: 'images/.tinypng-sigs',
                    log: true
                }))
                .pipe(gulp.dest('images'));
        });
        res.send(await usersChat.insertOne(req.body));
    }
    catch (err) {
        console.log(err);
    }
})

// get room data 
router.get('/:room', async (req: Request, res: Response) => {
    try {
        const roomId: any = req.params.room;
        if (isNaN(roomId) !== true) {
            const query = { roomId: parseInt(roomId) };
            res.send(await usersChat.find(query).toArray());
        };
    } catch (err) {
        res.status(500).json({ message: 'There was errror in server' })
    }
});

// get all data
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await usersChat.find({}).toArray());
    } catch (err) {
        next(err)
    }
});

// delete message data
router.put('/deletemessage/:id', async (req: Request, res: Response) => {
    // try {
    const messageId = req.params.id;
    const query = { _id: ObjectId(messageId) };
    const updatedDoc = { $set: { deleted: true } };
    res.send(await usersChat.updateOne(query, updatedDoc));
    // } catch (err) {
    //     res.status(500).json({ message: 'There was errror in server' })
    // }
});


//delete all message from room
router.delete('/deleteallmessages/:roomId', async (req: Request, res: Response) => {
    try {
        const roomId = parseInt(req.params.roomId);
        const query = { roomId: roomId };
        res.send(await usersChat.deleteMany(query));
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
});


module.exports = router;