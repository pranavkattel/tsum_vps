import mongoose from 'mongoose';
import '../models/Product.js';
const Product = mongoose.model('Product');

async function checkCategories() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB\n');

    const count = await Product.countDocuments();
    console.log('Total products:', count);

    const cats = await Product.distinct('category');
    console.log('\nCategories:', cats);

    const bowls = await Product.find({ name: /singing bowl/i }).limit(5).select('name category');
    console.log('\nSinging bowl products:');
    bowls.forEach(b => console.log(`  - ${b.name} (category: "${b.category}")`));

    const bowlsByCat = await Product.find({ category: 'Singing Bowl' }).limit(5).select('name category');
    console.log('\nProducts with category "Singing Bowl":');
    bowlsByCat.forEach(b => console.log(`  - ${b.name}`));

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCategories();
