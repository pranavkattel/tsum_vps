import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';

const run = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to', mongoURI);

    // Update all users to have the new fields if they don't exist
    const result = await User.updateMany(
      {},
      {
        $set: {
          wishlist: [],
          'inquiries.whatsapp.count': 0,
          'inquiries.email.count': 0
        }
      },
      { upsert: false }
    );

    console.log('Migration complete!');
    console.log('Users updated:', result.modifiedCount);
    console.log('Users matched:', result.matchedCount);

    // Show updated users
    const users = await User.find({}).select('email wishlist inquiries').lean();
    console.log('\nUpdated users:');
    users.forEach(user => {
      console.log(`- ${user.email}: wishlist=${user.wishlist?.length || 0}, whatsapp=${user.inquiries?.whatsapp?.count || 0}, email=${user.inquiries?.email?.count || 0}`);
    });

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
