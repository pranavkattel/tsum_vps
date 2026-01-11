import connectDB from '../config/database.js';
import Category from '../models/Category.js';

const initialCategories = [
  { name: 'Statues', description: 'Hand-carved statues of deities and spiritual figures', icon: '🗿', order: 1 },
  { name: 'Singing Bowls', description: 'Traditional Tibetan singing bowls for meditation', icon: '🔔', order: 2 },
  { name: 'Malas', description: 'Prayer beads and meditation malas', icon: '📿', order: 3 },
  { name: 'Bells', description: 'Prayer bells and ritual bells', icon: '🔔', order: 4 },
  { name: 'Thangkas', description: 'Traditional Tibetan Buddhist paintings', icon: '🖼️', order: 5 },
  { name: 'Incense', description: 'Natural incense and holders', icon: '🕉️', order: 6 },
  { name: 'Textiles', description: 'Hand-woven textiles and fabrics', icon: '🧵', order: 7 },
  { name: 'Jewelry', description: 'Handcrafted jewelry and accessories', icon: '💍', order: 8 }
];

async function seedCategories() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB\n');

    // Check if categories already exist
    const existingCount = await Category.countDocuments();
    if (existingCount > 0) {
      console.log(`📦 Database already has ${existingCount} categories. Skipping seed.`);
      console.log('💡 To re-seed, delete all categories first.\n');
      process.exit(0);
    }

    // Insert categories
    const created = await Category.insertMany(initialCategories);
    console.log(`✅ Successfully created ${created.length} categories:\n`);
    
    created.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name} (${cat.slug})`);
    });

    console.log('\n✨ Category seeding complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();
