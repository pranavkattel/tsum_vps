import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function convertBase64Images() {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;

    for (const product of products) {
      let hasBase64 = false;
      const newImages = [];

      for (const img of product.images) {
        if (img.startsWith('data:image')) {
          hasBase64 = true;
          const matches = img.match(/^data:image\/(\w+);base64,(.+)$/);
          
          if (matches) {
            const ext = matches[1];
            const base64Data = matches[2];
            const fileName = `product-${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
            const fullPath = path.resolve(__dirname, '../../public', fileName);
            
            await fs.writeFile(fullPath, Buffer.from(base64Data, 'base64'));
            console.log(`Saved: ${fileName}`);
            newImages.push(`/${fileName}`);
          }
        } else {
          newImages.push(img);
        }
      }

      if (hasBase64) {
        product.images = newImages;
        await product.save();
        updatedCount++;
        console.log(`Updated product: ${product.name}`);
      }
    }

    console.log(`\nConversion complete! Updated ${updatedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

convertBase64Images();
