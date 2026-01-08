import mongoose from 'mongoose';
import { DB_NAME } from './../constants.js';

// Initialize a global cache so connection survives "hot reloads" and function invocations
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // 1. If a connection already exists, use it immediately.
  if (cached.conn) {
    console.log('Using cached MongoDB connection');
    return cached.conn;
  }

  // 2. If no connection exists, start a new one.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Critical for serverless: fail fast if no connection
    };

    console.log('Creating new MongoDB connection...');

    // Create the connection promise
    cached.promise = mongoose
      .connect(`${process.env.MONGO_URI}/${DB_NAME}`, opts)
      .then((mongoose) => {
        console.log(
          `\n MongoDB connected !! DB HOST: ${mongoose.connection.host}`
        );
        return mongoose;
      });
  }

  // 3. Await the promise to establish the connection
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise if it failed
    console.error('MONGODB connection FAILED ', e);
    throw e; // Do NOT process.exit(1) in serverless!
  }

  return cached.conn;
}

export default connectDB;
