import express from 'express';
import Product from '../models/Product.js';
import { authenticateToken, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all products with optional filtering and search
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      featured, 
      limit = 20, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      // Use regex for flexible partial matching
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
        { artisan: searchRegex }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // If searching, prioritize results that start with the search term
    let products;
    let total;
    
    if (search) {
      // Get all matching products first
      const allMatches = await Product.find(filter).lean();
      total = allMatches.length;
      
      // Sort by relevance: name starts with > category starts with > contains
      const searchLower = search.toLowerCase();
      const sorted = allMatches.sort((a, b) => {
        const aName = (a.name || '').toLowerCase();
        const bName = (b.name || '').toLowerCase();
        const aCat = (a.category || '').toLowerCase();
        const bCat = (b.category || '').toLowerCase();
        
        const aNameStarts = aName.startsWith(searchLower);
        const bNameStarts = bName.startsWith(searchLower);
        const aCatStarts = aCat.startsWith(searchLower);
        const bCatStarts = bCat.startsWith(searchLower);
        
        if (aNameStarts && !bNameStarts) return -1;
        if (!aNameStarts && bNameStarts) return 1;
        if (aCatStarts && !bCatStarts) return -1;
        if (!aCatStarts && bCatStarts) return 1;
        
        return aName.localeCompare(bName);
      });
      
      products = sorted.slice(skip, skip + limitNum);
    } else {
      // Execute regular query without search
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      products = await Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum);
        
      total = await Product.countDocuments(filter);
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findOne({ 
      $or: [
        { _id: req.params.id },
        { id: req.params.id }
      ],
      isActive: true 
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const products = await Product.find({ 
      featured: true, 
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories.sort()
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Create new product (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { images, ...otherData } = req.body;
    
    console.log('=== CREATE PRODUCT ===');
    console.log('Images received:', images ? images.length : 0);
    
    // Get backend URL from environment or default
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
    
    // Process images: convert base64 to files
    const processedImages = [];
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.startsWith('data:image')) {
          // This is a base64 image, convert it to a file
          const matches = img.match(/^data:image\/(\w+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1];
            const base64Data = matches[2];
            const fileName = `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
            
            // Save base64 to file in project root /public folder
            const fs = await import('fs/promises');
            const path = await import('path');
            const { fileURLToPath } = await import('url');
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const fullPath = path.resolve(__dirname, '../../public', fileName);
            
            await fs.writeFile(fullPath, Buffer.from(base64Data, 'base64'));
            console.log('Saved image to:', fullPath);
            // Store full URL so it can be served from backend
            processedImages.push(`${BACKEND_URL}/${fileName}`);
          }
        } else {
          // This is already a URL, keep it
          processedImages.push(img);
        }
      }
    }
    
    const productData = {
      ...otherData,
      images: processedImages.length > 0 ? processedImages : images
    };
    
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Update product (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { images, ...otherData } = req.body;
    
    console.log('=== UPDATE PRODUCT ===');
    console.log('Product ID:', req.params.id);
    console.log('Images received:', images ? images.length : 0);
    console.log('First image type:', images && images[0] ? (images[0].startsWith('data:image') ? 'base64' : 'URL') : 'none');
    
    // Get backend URL from environment or default
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';
    
    // Process images: keep existing URLs, convert base64 to files
    const processedImages = [];
    if (images && Array.isArray(images)) {
      for (const img of images) {
        if (img.startsWith('data:image')) {
          // This is a base64 image, convert it to a file
          const matches = img.match(/^data:image\/(\w+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1];
            const base64Data = matches[2];
            const fileName = `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
            
            // Save base64 to file in project root /public folder
            const fs = await import('fs/promises');
            const path = await import('path');
            const { fileURLToPath } = await import('url');
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const fullPath = path.resolve(__dirname, '../../public', fileName);
            
            await fs.writeFile(fullPath, Buffer.from(base64Data, 'base64'));
            console.log('Saved image to:', fullPath);
            // Store full URL so it can be served from backend
            processedImages.push(`${BACKEND_URL}/${fileName}`);
          }
        } else {
          // This is already a URL, keep it
          processedImages.push(img);
        }
      }
    }
    
    const updateData = {
      ...otherData,
      images: processedImages.length > 0 ? processedImages : undefined
    };
    
    console.log('Processed images:', processedImages);
    console.log('Update data keys:', Object.keys(updateData));
    
    const product = await Product.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { id: req.params.id }] },
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete product (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { id: req.params.id }] },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Add rating to product (Authenticated users only)
router.post('/:id/rating', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    console.log('=== ADD RATING ===');
    console.log('Product ID:', req.params.id);
    console.log('User ID:', req.user._id);
    console.log('Rating:', rating);
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Build query - only include _id if it's a valid ObjectId
    const query = { id: req.params.id };
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or = [{ _id: req.params.id }];
    }
    
    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Initialize userReviews array if it doesn't exist
    if (!product.userReviews) {
      product.userReviews = [];
    }

    // Check if user already rated this product
    const existingReviewIndex = product.userReviews.findIndex(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      product.userReviews[existingReviewIndex].rating = rating;
      product.userReviews[existingReviewIndex].comment = comment || '';
      product.userReviews[existingReviewIndex].createdAt = new Date();
    } else {
      // Add new review
      product.userReviews.push({
        user: req.user._id,
        rating,
        comment: comment || '',
        createdAt: new Date()
      });
    }

    // Recalculate average rating
    const totalRating = product.userReviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.userReviews.length;
    product.reviews = product.userReviews.length;

    await product.save();

    res.json({
      success: true,
      message: existingReviewIndex !== -1 ? 'Rating updated successfully' : 'Rating added successfully',
      data: {
        rating: product.rating,
        reviews: product.reviews,
        userReview: product.userReviews[existingReviewIndex !== -1 ? existingReviewIndex : product.userReviews.length - 1]
      }
    });

  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    });
  }
});

// Get product ratings
router.get('/:id/ratings', async (req, res) => {
  try {
    console.log('=== GET RATINGS ===');
    console.log('Product ID:', req.params.id);
    
    // Build query - only include _id if it's a valid ObjectId
    const query = { id: req.params.id };
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      query.$or = [{ _id: req.params.id }];
    }
    
    const product = await Product.findOne(query).populate('userReviews.user', 'firstName lastName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const userReviews = product.userReviews ? product.userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

    res.json({
      success: true,
      data: {
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        userReviews: userReviews
      }
    });

  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ratings',
      error: error.message
    });
  }
});

export default router;