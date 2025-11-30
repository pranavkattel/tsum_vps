import mongoose from 'mongoose';
import Product from '../models/Product.js';

async function testSearch() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';
    await mongoose.connect(mongoURI);
    console.log('Connected!\n');

    const search = 's';
    const searchRegex = new RegExp(search, 'i');
    
    const filter = {
      isActive: true,
      $or: [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
        { artisan: searchRegex }
      ]
    };

    console.log('Filter:', JSON.stringify(filter, null, 2));
    
    const results = await Product.find(filter).limit(10).select('name category');
    console.log(`\nFound ${results.length} results:`);
    results.forEach(p => console.log(`  - ${p.name} (${p.category})`));

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testSearch();
