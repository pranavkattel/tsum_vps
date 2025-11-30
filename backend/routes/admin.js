import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Dashboard summary: inquiry stats, top products by inquiry, recent inquiries
router.get('/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    
    // Calculate total inquiries
    const inquiryAgg = await User.aggregate([
      {
        $project: {
          totalInquiries: {
            $add: [
              { $ifNull: ['$inquiries.whatsapp.count', 0] },
              { $ifNull: ['$inquiries.email.count', 0] }
            ]
          },
          whatsappCount: { $ifNull: ['$inquiries.whatsapp.count', 0] },
          emailCount: { $ifNull: ['$inquiries.email.count', 0] }
        }
      },
      {
        $group: {
          _id: null,
          totalInquiries: { $sum: '$totalInquiries' },
          totalWhatsApp: { $sum: '$whatsappCount' },
          totalEmail: { $sum: '$emailCount' }
        }
      }
    ]);

    const inquiryStats = inquiryAgg[0] || { totalInquiries: 0, totalWhatsApp: 0, totalEmail: 0 };

    console.log('Inquiry stats:', inquiryStats);

    // Get recent inquiries (users who made inquiries recently)
    const allUsersWithInquiries = await User.find({
      $or: [
        { 'inquiries.whatsapp.count': { $gt: 0 } },
        { 'inquiries.email.count': { $gt: 0 } }
      ]
    })
    .select('firstName lastName email inquiries.whatsapp inquiries.email')
    .lean();

    console.log('Users with inquiries:', allUsersWithInquiries.length);

    // Sort inquiries by most recent activity in JavaScript
    const recentInquiries = allUsersWithInquiries
      .map(user => {
        const whatsappDate = user.inquiries?.whatsapp?.lastInquiry 
          ? new Date(user.inquiries.whatsapp.lastInquiry).getTime()
          : 0;
        const emailDate = user.inquiries?.email?.lastInquiry 
          ? new Date(user.inquiries.email.lastInquiry).getTime()
          : 0;
        return {
          ...user,
          latestInquiry: Math.max(whatsappDate, emailDate)
        };
      })
      .sort((a, b) => b.latestInquiry - a.latestInquiry)
      .slice(0, 20);

    // Top products by inquiry count
    const topProductsByInquiry = await Product.aggregate([
      {
        $project: {
          name: 1,
          images: 1,
          totalInquiries: {
            $add: [
              { $ifNull: ['$inquiries.whatsapp.count', 0] },
              { $ifNull: ['$inquiries.email.count', 0] }
            ]
          },
          whatsappCount: { $ifNull: ['$inquiries.whatsapp.count', 0] },
          emailCount: { $ifNull: ['$inquiries.email.count', 0] }
        }
      },
      { $match: { totalInquiries: { $gt: 0 } } },
      { $sort: { totalInquiries: -1 } },
      { $limit: 10 }
    ]);

    const topProducts = topProductsByInquiry.map(p => ({
      productId: p._id,
      name: p.name,
      images: p.images,
      inquiryCount: p.totalInquiries,
      whatsappCount: p.whatsappCount,
      emailCount: p.emailCount
    }));

    // User counts
    const totalUsers = await User.countDocuments({});
    const activeUsers = await User.countDocuments({ isActive: true });

    // Product count
    const totalProducts = await Product.countDocuments({});

    console.log('Dashboard data being sent:', {
      totalInquiries: inquiryStats.totalInquiries,
      totalWhatsApp: inquiryStats.totalWhatsApp,
      totalEmail: inquiryStats.totalEmail,
      totalProducts,
      totalUsers,
      activeUsers,
      recentInquiriesCount: recentInquiries.length,
      topProductsCount: topProducts.length
    });

    res.json({
      success: true,
      data: {
        totalInquiries: inquiryStats.totalInquiries,
        totalWhatsApp: inquiryStats.totalWhatsApp,
        totalEmail: inquiryStats.totalEmail,
        totalProducts,
        totalUsers,
        activeUsers,
        topProducts,
        recentInquiries
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dashboard', error: error.message });
  }
});

// List all orders with pagination
router.get('/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate('user', 'firstName lastName email').populate('items.product', 'name images');
    const total = await Order.countDocuments(filter);

    res.json({ success: true, data: orders, pagination: { currentPage: pageNum, totalItems: total, itemsPerPage: limitNum } });
  } catch (error) {
    console.error('Admin orders error:', error);
    res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
  }
});

// Admin: list products (including inactive)
router.get('/products', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Admin products error:', error);
    res.status(500).json({ success: false, message: 'Error fetching products', error: error.message });
  }
});

// Admin: list all users with inquiry statistics
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ success: false, message: 'Error fetching users', error: error.message });
  }
});

export default router;
