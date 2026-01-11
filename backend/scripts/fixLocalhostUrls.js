import connectDB from '../config/database.js';
import Product from '../models/Product.js';
import GalleryImage from '../models/GalleryImage.js';

/**
 * Fix database records with hardcoded localhost URLs
 * Converts absolute URLs like http://localhost:3005/uploaded-*.png
 * to relative paths like /uploaded-*.png
 */
async function fixLocalhostUrls() {
  try {
    await connectDB();
    console.log('Connected to DB — fixing localhost URLs...');

    // Fix products
    const products = await Product.find({}).lean();
    let productsFixed = 0;

    for (const product of products) {
      if (!product.images || !Array.isArray(product.images)) continue;
      
      let needsUpdate = false;
      const fixedImages = product.images.map(img => {
        if (typeof img !== 'string') return img;
        
        // Check if it's a localhost URL
        if (img.includes('localhost:') || img.includes('127.0.0.1:')) {
          needsUpdate = true;
          try {
            const url = new URL(img);
            // Return just the pathname (e.g., /uploaded-*.png)
            return url.pathname;
          } catch {
            // If URL parsing fails, try simple regex extraction
            const match = img.match(/(?:localhost:\d+|127\.0\.0\.1:\d+)(\/[^?#]+)/);
            if (match) {
              return match[1];
            }
          }
        }
        
        return img;
      });

      if (needsUpdate) {
        await Product.updateOne(
          { _id: product._id },
          { $set: { images: fixedImages } }
        );
        console.log(`Fixed product ${product._id} (${product.name})`);
        console.log(`  Before: ${product.images[0]}`);
        console.log(`  After:  ${fixedImages[0]}`);
        productsFixed++;
      }
    }

    // Fix gallery images
    const galleryImages = await GalleryImage.find({}).lean();
    let galleryFixed = 0;

    for (const gallery of galleryImages) {
      if (!gallery.image || typeof gallery.image !== 'string') continue;
      
      const img = gallery.image;
      let fixedImage = img;
      
      // Check if it's a localhost URL
      if (img.includes('localhost:') || img.includes('127.0.0.1:')) {
        try {
          const url = new URL(img);
          fixedImage = url.pathname;
        } catch {
          // If URL parsing fails, try simple regex extraction
          const match = img.match(/(?:localhost:\d+|127\.0\.0\.1:\d+)(\/[^?#]+)/);
          if (match) {
            fixedImage = match[1];
          }
        }

        if (fixedImage !== img) {
          await GalleryImage.updateOne(
            { _id: gallery._id },
            { $set: { image: fixedImage } }
          );
          console.log(`Fixed gallery ${gallery._id} (${gallery.title})`);
          console.log(`  Before: ${img}`);
          console.log(`  After:  ${fixedImage}`);
          galleryFixed++;
        }
      }
    }

    console.log('\n=== Summary ===');
    console.log(`Products fixed: ${productsFixed}`);
    console.log(`Gallery images fixed: ${galleryFixed}`);
    console.log('Done!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error fixing localhost URLs:', err);
    process.exit(1);
  }
}

// Run if called directly
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  fixLocalhostUrls();
}

export default fixLocalhostUrls;
