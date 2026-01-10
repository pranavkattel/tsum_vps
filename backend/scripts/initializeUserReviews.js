import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const initializeUserReviews = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';
    console.log('Connecting to:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Update all products to have userReviews array if they don't have it
    const result = await Product.updateMany(
      { userReviews: { $exists: false } },
      { $set: { userReviews: [] } }
    );

    console.log(`\n=== INITIALIZATION COMPLETE ===`);
    console.log(`Products updated: ${result.modifiedCount}`);
    console.log(`Matched: ${result.matchedCount}`);

    // Verify
    const productsWithoutReviews = await Product.countDocuments({ userReviews: { $exists: false } });
    const productsWithReviews = await Product.countDocuments({ userReviews: { $exists: true } });
    
    console.log(`\nProducts without userReviews field: ${productsWithoutReviews}`);
    console.log(`Products with userReviews field: ${productsWithReviews}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

initializeUserReviews();
