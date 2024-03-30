import { MongoClient, Db } from 'mongodb';
require("dotenv").config();

let _db: Db;

export async function connectToDatabase() {
    if (_db) return _db;
    try {
        const uri = process.env.DB_URL as string;
        const client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to the database');
        _db = client.db("Leaves");
        return _db;
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
}

export function getDb() {
    if (!_db) {
        throw new Error('Database not connected!');
    }
    return _db;
}
