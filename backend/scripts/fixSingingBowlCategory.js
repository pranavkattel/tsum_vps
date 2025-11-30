import mongoose from 'mongoose';
import Product from '../models/Product.js';

async function fixCategories() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';
    await mongoose.connect(mongoURI);
    console.log('Connected!\n');

    // Fix Singing Bowl products
    const result = await Product.updateMany(
      { name: /Singing Bowl \d/i },
      { $set: { category: 'Singing Bowl' } }
    );
    
    console.log(`✓ Updated ${result.modifiedCount} singing bowl products\n`);

    // Verify
    const bowls = await Product.find({ category: 'Singing Bowl' }).select('name category');
    console.log(`Found ${bowls.length} products with category "Singing Bowl":`);
    bowls.slice(0, 5).forEach(b => console.log(`  - ${b.name}`));

    const cats = await Product.distinct('category');
    console.log('\nAll categories:', cats);

    await mongoose.connection.close();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixCategories();
