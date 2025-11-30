import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get current user's cart
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    res.json({ success: true, data: user.cart || [] });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, message: 'Error fetching cart', error: error.message });
  }
});

// Replace/update user's cart
router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const { cart } = req.body;
    if (!Array.isArray(cart)) {
      return res.status(400).json({ success: false, message: 'Cart must be an array' });
    }

    // sanitize items: only keep productId and quantity
    user.cart = cart.map(item => ({
      productId: item.productId || item.productId === 0 ? String(item.productId) : item.productId,
      quantity: Math.max(1, parseInt(item.quantity) || 1),
      addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
    }));

    await user.save();

    res.json({ success: true, data: user.cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
  }
});

export default router;
