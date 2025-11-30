import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';

const run = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to', mongoURI);
    const count = await User.countDocuments();
    console.log('Users count:', count);
    const users = await User.find().limit(10).lean();
    console.log('Users sample:', users);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
