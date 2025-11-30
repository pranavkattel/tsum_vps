import connectDB from '../config/database.js';
import Product from '../models/Product.js';

const imageMap = {
  '1': ['/IMG-20250704-WA0083.jpg', '/IMG-20250704-WA0082.jpg'],
  '2': ['/IMG-20250704-WA0081.jpg', '/IMG-20250704-WA0046.jpg', '/IMG-20250704-WA0045.jpg', '/IMG-20250704-WA0044.jpg'],
  '3': ['/IMG-20250704-WA0080.jpg', '/IMG-20250704-WA0043.jpg', '/IMG-20250704-WA0042.jpg', '/IMG-20250704-WA0041.jpg', '/IMG-20250704-WA0040.jpg'],
  '4': ['/IMG-20250704-WA0079.jpg', '/IMG-20250704-WA0039.jpg', '/IMG-20250704-WA0038.jpg'],
  '5': ['/IMG-20250704-WA0078.jpg', '/IMG-20250704-WA0037.jpg', '/IMG-20250704-WA0036.jpg'],
  '6': ['/IMG-20250704-WA0077.jpg', '/IMG-20250704-WA0035.jpg'],
  '7': ['/IMG-20250704-WA0076.jpg', '/IMG-20250704-WA0034.jpg', '/IMG-20250704-WA0033.jpg'],
  '8': ['/IMG-20250704-WA0075.jpg', '/IMG-20250704-WA0032.jpg', '/IMG-20250704-WA0031.jpg', '/IMG-20250704-WA0030.jpg'],
};

async function fix() {
  try {
    await connectDB();
    console.log('Fixing images...');
    
    for (const [id, images] of Object.entries(imageMap)) {
      await Product.updateOne({ id }, { $set: { images } });
      console.log(`Updated product ${id} with ${images.length} images`);
    }
    
    // Set all other products to have at least one image
    const updated = await Product.updateMany(
      { $or: [{ images: { $exists: false } }, { images: { $size: 0 } }] },
      { $set: { images: ['/IMG-20250704-WA0022.jpg'] } }
    );
    console.log(`Set default image for ${updated.modifiedCount} products`);
    
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fix();
