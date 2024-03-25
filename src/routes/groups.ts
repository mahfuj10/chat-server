import { Request, Response, NextFunction } from "express";
const express = require('express')
const router = express.Router();
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const gulp = require('gulp');
const tinypng = require('gulp-tinypng-compress');
require("dotenv").config();


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@leaves.eaf0bsd.mongodb.net/`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("Leaves");
const allGroups = database.collection('groups');
const usersCollection = database.collection('users');
const usersChat = database.collection('chats');

client.connect();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await allGroups.find({}).toArray());
    } catch (err) {
        next(err);
    }
})

// post groups
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await allGroups.insertOne(req.body));
    } catch (err) {
        next(err);
    }
});

// set group id in user data
router.post('/saveinuserdata/:uid', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const uid: string = req.params.uid;
        const query = { uid: uid };
        const result = await usersCollection.updateOne(query, { $push: { groups: { $each: [req.body.groupId] } } });
        res.send(result);
    } catch (err) {
        next(err)
        console.log(err)
    }
});

// get group chat data
router.get('/groupchat/:groupId', async (req: Request, res: Response) => {
    try {
        const groupId: number = parseInt(req.params.groupId);
        const query = { groupId: groupId };
        res.send(await usersChat.find(query).toArray());
    } catch (err) {
        console.error(err);
    }
})




module.exports = router;