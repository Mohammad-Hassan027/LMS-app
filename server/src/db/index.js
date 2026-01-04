import mongoose from 'mongoose';
import { DB_NAME } from './../constants.js';

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );

    mongoose.connection.on('error', (err) => {
      console.log('MongoDB runtime connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected!!');
    });
  } catch (error) {
    console.error('MONGODB connection FAILED ', error);
    process.exit(1);
  }
}

export default connectDB;
