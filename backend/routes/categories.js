import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    const filter = active === 'true' ? { isActive: true } : {};
    
    const categories = await Category.find(filter).sort({ order: 1, name: 1 });
    
    res.json({
      success: true,
      data: categories
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

// Get single category by slug or ID (public)
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by slug first, then by ID
    let category = await Category.findOne({ slug: identifier });
    if (!category) {
      category = await Category.findById(identifier);
    }
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

// Create new category (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, icon, order, isActive } = req.body;
    
    // Check if category with same name already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }
    
    const category = new Category({
      name,
      description,
      icon,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await category.save();
    
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
});

// Update category (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, icon, order, isActive } = req.body;
    
    // If name is being changed, check for duplicates
    if (name) {
      const existingCategory = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Another category with this name already exists'
        });
      }
    }
    
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Regenerate slug if name changed
    if (name) {
      updateData.slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

// Delete category (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Check if category has products
    const productCount = await Product.countDocuments({ category: category.name });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} product(s) assigned to it.`,
        productCount
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
});

// Update product counts for all categories (Admin utility)
router.post('/sync-counts', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const categories = await Category.find({});
    
    for (const category of categories) {
      const count = await Product.countDocuments({ category: category.name });
      category.productCount = count;
      await category.save();
    }
    
    res.json({
      success: true,
      message: 'Category product counts updated',
      data: categories
    });
  } catch (error) {
    console.error('Sync category counts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing category counts',
      error: error.message
    });
  }
});

export default router;
