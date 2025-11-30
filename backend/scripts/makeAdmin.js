import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';

const email = process.argv[2];

if (!email) {
  console.error('Usage: node makeAdmin.js <email>');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to', mongoURI);

    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log('User promoted to admin:', email);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
