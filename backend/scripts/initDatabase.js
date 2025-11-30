import connectDB from '../config/database.js';
import Product from '../models/Product.js';
import { mockProducts } from '../data/mockData.js';

const initializeDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    
    console.log('🔄 Initializing database with products...');
    
    // Check if products already exist
    const existingProductsCount = await Product.countDocuments();
    
    if (existingProductsCount > 0) {
      console.log(`📦 Database already has ${existingProductsCount} products. Skipping initialization.`);
      console.log('💡 To re-initialize, delete all products first or drop the collection.');
      process.exit(0);
    }
    
    // Transform mock data for MongoDB
    const productsToInsert = mockProducts.map(product => ({
      ...product,
      stock: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
      rating: Math.floor(Math.random() * 50) / 10, // Random rating 0-5
      reviews: Math.floor(Math.random() * 100), // Random review count
      featured: Math.random() > 0.8, // 20% chance to be featured
      isActive: true
    }));
    
    // Insert products
    const insertedProducts = await Product.insertMany(productsToInsert);
    
    console.log(`✅ Successfully inserted ${insertedProducts.length} products into the database`);
    
    // Display category breakdown
    const categoryCount = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\n📊 Products by category:');
    categoryCount.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });
    
    // Display featured products
    const featuredCount = await Product.countDocuments({ featured: true });
    console.log(`⭐ Featured products: ${featuredCount}`);
    
    console.log('\n🎉 Database initialization completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export default initializeDatabase;
