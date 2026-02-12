import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tsum-shop';

const createAdminUser = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const User = mongoose.model('User', new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      password: String,
      phone: String,
      address: Object,
      role: String,
      isActive: Boolean,
      cart: Array,
      wishlist: Array,
      inquiries: Object
    }));

    const email = 'chhewanglama2026@gmail.com';
    const password = 'chhewangg';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`User with email ${email} already exists!`);
      console.log('Updating to admin role...');
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('User updated to admin role successfully!');
    } else {
      // Hash password
      console.log('Hashing password...');
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new admin user
      const newUser = new User({
        firstName: 'Chhewang',
        lastName: 'Lama',
        email: email,
        password: hashedPassword,
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'Nepal'
        },
        role: 'admin',
        isActive: true,
        cart: [],
        wishlist: [],
        inquiries: {
          whatsapp: { count: 0 },
          email: { count: 0 }
        }
      });

      await newUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Role: admin');
    }

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
