import connectDB from '../config/database.js';
import mongoose from 'mongoose';

async function checkGallery() {
  try {
    await connectDB();
    
    const GalleryImage = mongoose.model('GalleryImage');
    const images = await GalleryImage.find({});
    
    console.log(`\n📸 Found ${images.length} gallery images:\n`);
    
    images.forEach((img, i) => {
      console.log(`${i + 1}. ${img.title}`);
      console.log(`   Image path: ${img.image}`);
      console.log(`   Category: ${img.category}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkGallery();
