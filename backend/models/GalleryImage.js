import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Image title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Image description is required']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Mountains', 'Lakes', 'Valleys', 'Heritage', 'Nature', 'Landscapes', 'Culture']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for category filtering
galleryImageSchema.index({ category: 1, isActive: 1 });

export default mongoose.model('GalleryImage', galleryImageSchema);
