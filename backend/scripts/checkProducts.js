import connectDB from '../config/database.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

async function run() {
  try {
    await connectDB();
    const total = await Product.countDocuments();
    console.log('Products in DB:', total);
    const samples = await Product.find({}).limit(8).select('id name images price stock category').lean();
    console.log('Sample products:');
    samples.forEach(p => {
      console.log(`- ${p.id} | ${p.name} | images=${(p.images||[]).length} | ${p.category} | ₨ ${p.price} | stock=${p.stock}`);
    });

    const admin = await User.findOne({ role: 'admin' }).select('email firstName lastName').lean();
    if (admin) console.log('Admin user found:', admin.email, `(${admin.firstName} ${admin.lastName})`);
    else console.log('No admin user found');

    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
}

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) run();

export default run;
