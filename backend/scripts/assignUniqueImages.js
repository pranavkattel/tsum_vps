import connectDB from '../config/database.js';
import Product from '../models/Product.js';

async function assignImages() {
  try {
    await connectDB();
    console.log('Assigning unique images...');
    
    const products = await Product.find({}).sort({ _id: 1 });
    let imgNum = 22;
    
    for (const p of products) {
      if (!p.images || p.images.length === 0 || p.images[0] === '/IMG-20250704-WA0022.jpg') {
        const newImg = `/IMG-20250704-WA00${String(imgNum).padStart(2, '0')}.jpg`;
        await Product.updateOne({ _id: p._id }, { $set: { images: [newImg] } });
        console.log(`Updated ${p.id} to ${newImg}`);
        imgNum++;
        if (imgNum > 83) imgNum = 22;
      }
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

assignImages();
