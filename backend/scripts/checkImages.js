import connectDB from '../config/database.js';
import Product from '../models/Product.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkImages() {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');
    
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products\n`);
    
    let productsWithImages = 0;
    let productsWithoutImages = 0;
    let totalImages = 0;
    let missingFiles = 0;
    let foundFiles = 0;
    
    const publicImagesPath = path.resolve(__dirname, '../../public/images');
    console.log(`🔍 Checking images in: ${publicImagesPath}\n`);
    
    for (const product of products) {
      if (!product.images || product.images.length === 0) {
        console.log(`❌ ${product.id}: "${product.name}" - NO IMAGES`);
        productsWithoutImages++;
        continue;
      }
      
      productsWithImages++;
      totalImages += product.images.length;
      
      console.log(`✓ ${product.id}: "${product.name}" - ${product.images.length} image(s)`);
      
      // Check if image files exist
      for (const imgPath of product.images) {
        // Remove leading slash and /images/ prefix
        const fileName = imgPath.replace(/^\/images\//, '');
        const fullPath = path.join(publicImagesPath, fileName);
        
        if (fs.existsSync(fullPath)) {
          console.log(`  ✓ ${fileName} - EXISTS`);
          foundFiles++;
        } else {
          console.log(`  ✗ ${fileName} - MISSING`);
          missingFiles++;
        }
      }
      console.log('');
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log(`Total products: ${products.length}`);
    console.log(`Products with images: ${productsWithImages}`);
    console.log(`Products without images: ${productsWithoutImages}`);
    console.log(`Total image references: ${totalImages}`);
    console.log(`Image files found: ${foundFiles}`);
    console.log(`Image files missing: ${missingFiles}`);
    console.log('═══════════════════════════════════════\n');
    
    if (productsWithoutImages > 0) {
      console.log('⚠️  Some products are missing image assignments');
      console.log('   Run: node scripts/setCorrectImages.js\n');
    }
    
    if (missingFiles > 0) {
      console.log('⚠️  Some image files are missing from public/images/');
      console.log('   Check your image files and update paths\n');
    }
    
    if (productsWithImages === products.length && missingFiles === 0) {
      console.log('🎉 All products have images and all files exist!\n');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkImages();
