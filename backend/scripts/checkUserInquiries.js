import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';

const run = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to', mongoURI);
    
    const users = await User.find({}).select('firstName lastName email inquiries wishlist').lean();
    
    console.log('\n=== All Users with Inquiry Stats ===\n');
    users.forEach(user => {
      console.log(`📧 ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   WhatsApp: ${user.inquiries?.whatsapp?.count || 0} inquiries`);
      if (user.inquiries?.whatsapp?.lastInquiry) {
        console.log(`   Last WhatsApp: ${user.inquiries.whatsapp.lastInquiry}`);
      }
      console.log(`   Email: ${user.inquiries?.email?.count || 0} inquiries`);
      if (user.inquiries?.email?.lastInquiry) {
        console.log(`   Last Email: ${user.inquiries.email.lastInquiry}`);
      }
      console.log(`   Wishlist: ${user.wishlist?.length || 0} items`);
      console.log('');
    });
    
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
