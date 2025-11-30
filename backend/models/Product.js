import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: [true, 'Product category is required']
  },
  artisan: {
    type: String,
    required: true
  },
  materials: [{
    type: String
  }],
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  reviews: {
    type: Number,
    min: [0, 'Reviews count cannot be negative'],
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  culturalSignificance: String,
  craftingTechnique: String,
  isActive: {
    type: Boolean,
    default: true
  },
  inquiries: {
    whatsapp: {
      count: { type: Number, default: 0 },
      lastInquiry: { type: Date }
    },
    email: {
      count: { type: Number, default: 0 },
      lastInquiry: { type: Date }
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
  category: 'text'
});

export default mongoose.model('Product', productSchema);