import { Request, Response } from "express";
const express = require('express')
const router = express.Router();
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@leaves.eaf0bsd.mongodb.net/`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("Leaves");
const usersCollection = database.collection('users');

client.connect();


// save google sign method user login
router.put('/', async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const filter = { email: user.email };
        const options = { upsert: true };
        const updateDoc = { $set: user };
        const result = await usersCollection.updateOne(filter, updateDoc, options);
        res.json(result);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
});

// save user 
router.post('/', async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
    } catch (err: any) {
        res.status(500).json({ message: err.message })
    }
});

// get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        res.send(await usersCollection.find({}).toArray());
    } catch (err) {
        console.log(err)
    }
});

// get single user
router.get('/singleuser/:uid', async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const query = { uid: uid };
        res.send(await usersCollection.findOne(query));
    } catch (err) {
        console.log(err)
    }
});


// add user in contract
router.post('/addcontract/:uid', async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const query = { uid: uid };
        // const result = await usersCollection.updateOne(query, { $push: { contracts: { $each: [req.body.uid] } } });
        const result = await usersCollection.updateOne(query, { $push: { contracts: req.body.uid } });
        res.send(result);

    } catch (err) {
        console.log(err)
    }
});

// check new user or old user
router.get('/checkuser/:uid', async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const query = { uid: uid };
        const user = await usersCollection.findOne(query);
        if (user?.email) {
            res.json({ olduser: true })
        }
        else {
            res.json({ newUser: true })
        }
    } catch (err) {
        console.log(err)
    }
});

// delete contract user

module.exports = router;