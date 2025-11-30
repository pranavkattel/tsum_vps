import connectDB from '../config/database.js';
import Product from '../models/Product.js';

async function run() {
  try {
    await connectDB();
    const total = await Product.countDocuments();
    console.log('Products in DB:', total);

    const samples = await Product.find({}).sort({ createdAt: 1 }).limit(20).lean();
    console.log('First 20 products (id | name | images count | images sample):');
    for (const p of samples) {
      console.log(`- ${p.id || p._id} | ${p.name || '(no-name)'} | images=${Array.isArray(p.images)?p.images.length:0} | ${JSON.stringify(p.images?.slice(0,3) || [])}`);
    }

    // show a few specific product ids that were mentioned earlier
    const checkIds = ['P2-STONE-03', 'P2-PUJA-BOWL', '1', '2'];
    console.log('\nSpecific checks:');
    for (const id of checkIds) {
      const doc = await Product.findOne({ id }).lean();
      if (doc) console.log(`* ${id} -> images: ${JSON.stringify(doc.images)}`);
      else console.log(`* ${id} -> not found`);
    }

    process.exit(0);
  } catch (err) {
    console.error('queryProducts failed', err && err.stack ? err.stack : err);
    process.exit(1);
  }
}

run();

export default run;
