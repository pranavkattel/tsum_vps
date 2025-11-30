import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { nepaliStatues } from '../data/nepaliStatues.js';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/tsum-ecommerce');
    console.log('Connected!\n');
    
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('Inserting products...');
    const productsToInsert = nepaliStatues.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 50) + 10,
      rating: Math.floor(Math.random() * 50) / 10,
      reviews: Math.floor(Math.random() * 100),
      featured: Math.random() > 0.8,
      isActive: true
    }));
    
    const inserted = await Product.insertMany(productsToInsert);
    console.log(`✅ Inserted ${inserted.length} products`);
    
    const cats = await Product.distinct('category');
    console.log('\nCategories:', cats);
    
    // Show singing bowl products
    const bowls = await Product.find({ name: /singing bowl/i }).limit(3).select('name category');
    console.log('\nSinging Bowl products:');
    bowls.forEach(b => console.log(`  - ${b.name} (category: "${b.category}")`));
    
    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedDatabase();
