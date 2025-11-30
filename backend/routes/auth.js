import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d'
  });
};

// Registration route
router.post('/register', [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional({ checkFalsy: true }).isMobilePhone('any').withMessage('Please provide a valid phone number')
], async (req, res) => {
  try {
    console.log('Register route hit — body:', JSON.stringify(req.body));
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Register validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, password, phone, address } = req.body;

    // Check if user already exists (separate try/catch to handle DB issues clearly)
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
      console.log('Existing user check for', email, existingUser ? 'FOUND' : 'NOT FOUND');
    } catch (dbErr) {
      console.error('DB error on findOne:', dbErr);
      return res.status(500).json({ success: false, message: 'Database error', error: dbErr.message });
    }

    if (existingUser) {
      // Return a structured errors array so frontend can map to form fields
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
        errors: [ { param: 'email', msg: 'Email already in use' } ]
      });
    }

    // Create new user
    const user = new User({ firstName, lastName, email, password, phone, address });

    console.log('Saving new user for', email);
    try {
      await user.save();
      console.log('User saved for', email);
    } catch (saveErr) {
      console.error('Error saving user:', saveErr);
      // Handle duplicate key errors (e.g., unique email)
      if (saveErr.code === 11000) {
        const dupField = Object.keys(saveErr.keyValue || {})[0] || 'email';
        return res.status(400).json({
          success: false,
          message: 'Duplicate field error',
          errors: [ { param: dupField, msg: `${dupField} already exists` } ]
        });
      }

      // Handle Mongoose validation errors
      if (saveErr.name === 'ValidationError') {
        const fieldErrors = Object.values(saveErr.errors).map(e => ({ param: e.path, msg: e.message }));
        return res.status(400).json({ success: false, message: 'Validation failed', errors: fieldErrors });
      }

      // Unknown error
      return res.status(500).json({ success: false, message: 'Server error during registration', error: saveErr.message });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userData = user.toJSON();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// Login route
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    console.log('Login route hit — body:', JSON.stringify(req.body));
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Login validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userData = user.toJSON();

    res.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
});

// Update user profile
router.put('/profile', [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
], async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Update user fields
    const { firstName, lastName, phone, address } = req.body;
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
      error: error.message
    });
  }
});

export default router;