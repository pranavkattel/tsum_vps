import express from 'express';
import { sendProductInquiry, sendBulkInquiry } from '../services/emailService.js';
import User from '../models/User.js';

const router = express.Router();

// Send single product inquiry email
router.post('/product-inquiry', async (req, res) => {
  try {
    const { name, category, size, productUrl, imageUrl, customerEmail, userId, productId } = req.body;

    if (!name || !category || !productUrl || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, productUrl, imageUrl'
      });
    }

    const result = await sendProductInquiry({
      name,
      category,
      size,
      productUrl,
      imageUrl,
      customerEmail
    });

    // Update user's email inquiry count
    if (userId) {
      try {
        await User.findByIdAndUpdate(userId, {
          $inc: { 'inquiries.email.count': 1 },
          $set: { 'inquiries.email.lastInquiry': new Date() }
        });
      } catch (err) {
        console.error('Error updating user inquiry count:', err);
      }
    }

    // Update product inquiry count
    if (productId) {
      try {
        const Product = (await import('../models/Product.js')).default;
        await Product.findOneAndUpdate(
          { id: productId },
          {
            $inc: { 'inquiries.email.count': 1 },
            $set: { 'inquiries.email.lastInquiry': new Date() }
          }
        );
      } catch (err) {
        console.error('Error updating product inquiry count:', err);
      }
    }

    res.json({
      success: true,
      message: 'Inquiry email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Error sending product inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send inquiry email',
      error: error.message
    });
  }
});

// Send bulk product inquiry email
router.post('/bulk-inquiry', async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid products array'
      });
    }

    const result = await sendBulkInquiry(products);

    res.json({
      success: true,
      message: 'Bulk inquiry email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Error sending bulk inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send bulk inquiry email',
      error: error.message
    });
  }
});

export default router;
