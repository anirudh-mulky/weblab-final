const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/solar-ecommerce';
const DB_NAME = 'solar-ecommerce';

let db = null;

async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');

    await db.collection('carts').createIndex({ productId: 1 });

    return db;
  } catch (error) {
    console.error(' MongoDB connection error:', error);

    console.log('Continuing without database connection');
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };


