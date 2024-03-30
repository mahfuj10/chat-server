import { Request, Response, NextFunction } from "express";
import { getDb } from "../db";
const express = require('express')
const router = express.Router();


const usersCollection = getDb().collection('users');
const groupsCollection = getDb().collection('groups');
const chatsCollection = getDb().collection('chats');

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await groupsCollection.find({}).toArray());
    } catch (err) {
        next(err);
    }
})

// post groups
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await groupsCollection.insertOne(req.body));
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
        res.send(await chatsCollection.find(query).toArray());
    } catch (err) {
        console.error(err);
    }
})




module.exports = router;