import mongoose from 'mongoose';
import { DB_NAME } from './../constants.js';

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log('\n Database connected:', connectionInstance.connection.host);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

export default connectDB;
