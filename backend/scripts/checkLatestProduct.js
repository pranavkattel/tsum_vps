import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

const checkLatestProduct = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';
    console.log('Connecting to:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Get the latest product
    const latestProduct = await Product.findOne().sort({ createdAt: -1 });
    
    if (latestProduct) {
      console.log('\n=== LATEST PRODUCT ===');
      console.log('ID:', latestProduct.id);
      console.log('Name:', latestProduct.name);
      console.log('Category:', latestProduct.category);
      console.log('Price:', latestProduct.price);
      console.log('isActive:', latestProduct.isActive);
      console.log('Images:', latestProduct.images);
      console.log('Created:', latestProduct.createdAt);
    } else {
      console.log('No products found');
    }

    // Count total products
    const total = await Product.countDocuments();
    const activeTotal = await Product.countDocuments({ isActive: true });
    
    console.log('\n=== STATS ===');
    console.log('Total products:', total);
    console.log('Active products:', activeTotal);

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkLatestProduct();
