import mongoose from 'mongoose';
import '../models/Product.js';
const Product = mongoose.model('Product');

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';

mongoose.connect(mongoURI).then(async () => {
  console.log('Connected to database\n');
  
  const accs = await Product.find({ id: /^ACC-/ }).select('id name category').limit(15);
  console.log('Accessory products:');
  accs.forEach(p => console.log(`  ${p.id}: ${p.name} - "${p.category}"`));

  console.log('\n');
  const phase1 = await Product.find({ id: /^P1-/ }).select('id name category').limit(5);
  console.log('Phase 1 products:');
  phase1.forEach(p => console.log(`  ${p.id}: ${p.name} - "${p.category}"`));
  
  process.exit(0);
});
