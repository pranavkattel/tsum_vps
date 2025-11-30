import mongoose from 'mongoose';
import Product from '../models/Product.js';
import '../config/database.js';

async function initProductInquiries() {
  try {
    console.log('Initializing product inquiry fields...');

    const result = await Product.updateMany(
      {
        $or: [
          { 'inquiries': { $exists: false } },
          { 'inquiries.whatsapp': { $exists: false } },
          { 'inquiries.email': { $exists: false } }
        ]
      },
      {
        $set: {
          'inquiries.whatsapp.count': 0,
          'inquiries.email.count': 0
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} products with inquiry fields`);

    // Show sample of products
    const sampleProducts = await Product.find({}).select('name inquiries').limit(5);
    console.log('\nSample products:');
    sampleProducts.forEach(p => {
      console.log(`- ${p.name}`);
      console.log(`  WhatsApp inquiries: ${p.inquiries?.whatsapp?.count || 0}`);
      console.log(`  Email inquiries: ${p.inquiries?.email?.count || 0}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error initializing product inquiries:', error);
    process.exit(1);
  }
}

initProductInquiries();
