import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get user's wishlist
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wishlist');
    res.json({
      success: true,
      data: user?.wishlist || []
    });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wishlist',
      error: error.message
    });
  }
});

// Add product to wishlist
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    // Add if not already in wishlist
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    res.json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add to wishlist',
      error: error.message
    });
  }
});

// Remove product from wishlist
router.post('/remove', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (user.wishlist) {
      user.wishlist = user.wishlist.filter(id => id !== productId);
      await user.save();
    }

    res.json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove from wishlist',
      error: error.message
    });
  }
});

// Track WhatsApp inquiry
router.post('/track-whatsapp', authenticateToken, async (req, res) => {
  try {
    const { productId } = req.body;
    console.log('WhatsApp inquiry tracking request received');
    console.log('User ID:', req.user._id);
    console.log('Product ID:', productId);
    
    // Update user inquiry count
    const userResult = await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'inquiries.whatsapp.count': 1 },
      $set: { 'inquiries.whatsapp.lastInquiry': new Date() }
    }, { new: true });

    console.log('Updated user:', userResult?.email, 'WhatsApp count:', userResult?.inquiries?.whatsapp?.count);

    // Update product inquiry count if productId provided
    if (productId) {
      const Product = (await import('../models/Product.js')).default;
      const productResult = await Product.findOneAndUpdate(
        { id: productId },
        {
          $inc: { 'inquiries.whatsapp.count': 1 },
          $set: { 'inquiries.whatsapp.lastInquiry': new Date() }
        },
        { new: true }
      );
      console.log('Updated product:', productResult?.name, 'WhatsApp inquiries:', productResult?.inquiries?.whatsapp?.count);
    }

    res.json({
      success: true,
      message: 'WhatsApp inquiry tracked'
    });
  } catch (error) {
    console.error('Error tracking WhatsApp inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track inquiry',
      error: error.message
    });
  }
});

export default router;
