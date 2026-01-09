import express from 'express';
import GalleryImage from '../models/GalleryImage.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all gallery images (public)
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;

        const filter = { isActive: true };
        if (category && category !== 'All') {
            filter.category = category;
        }

        const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            data: images
        });

    } catch (error) {
        console.error('Get gallery images error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery images',
            error: error.message
        });
    }
});

// Get single gallery image
router.get('/:id', async (req, res) => {
    try {
        const image = await GalleryImage.findById(req.params.id);

        if (!image || !image.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.json({
            success: true,
            data: image
        });

    } catch (error) {
        console.error('Get gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching gallery image',
            error: error.message
        });
    }
});

// Create new gallery image (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { image: imageData, ...otherData } = req.body;

        let processedImage = imageData;

        // Handle base64 image upload
        if (imageData && imageData.startsWith('data:image')) {
            const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
                const ext = matches[1];
                const base64Data = matches[2];
                const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

                const fs = await import('fs/promises');
                const path = await import('path');
                const { fileURLToPath } = await import('url');
                const __dirname = path.dirname(fileURLToPath(import.meta.url));
                const fullPath = path.resolve(__dirname, '../../public', fileName);

                await fs.writeFile(fullPath, Buffer.from(base64Data, 'base64'));
                console.log('Saved gallery image to:', fullPath);
                processedImage = `/${fileName}`;
            }
        }

        const galleryImage = new GalleryImage({
            ...otherData,
            image: processedImage
        });
        await galleryImage.save();

        res.status(201).json({
            success: true,
            message: 'Gallery image created successfully',
            data: galleryImage
        });

    } catch (error) {
        console.error('Create gallery image error:', error);
        res.status(400).json({
            success: false,
            message: 'Error creating gallery image',
            error: error.message
        });
    }
});

// Update gallery image (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { image: imageData, ...otherData } = req.body;

        let processedImage = imageData;

        // Handle base64 image upload
        if (imageData && imageData.startsWith('data:image')) {
            const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/);
            if (matches) {
                const ext = matches[1];
                const base64Data = matches[2];
                const fileName = `gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;

                const fs = await import('fs/promises');
                const path = await import('path');
                const { fileURLToPath } = await import('url');
                const __dirname = path.dirname(fileURLToPath(import.meta.url));
                const fullPath = path.resolve(__dirname, '../../public', fileName);

                await fs.writeFile(fullPath, Buffer.from(base64Data, 'base64'));
                console.log('Saved gallery image to:', fullPath);
                processedImage = `/${fileName}`;
            }
        }

        const updateData = {
            ...otherData,
            ...(processedImage && { image: processedImage })
        };

        const galleryImage = await GalleryImage.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!galleryImage) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.json({
            success: true,
            message: 'Gallery image updated successfully',
            data: galleryImage
        });

    } catch (error) {
        console.error('Update gallery image error:', error);
        res.status(400).json({
            success: false,
            message: 'Error updating gallery image',
            error: error.message
        });
    }
});

// Delete gallery image (Admin only - soft delete)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const galleryImage = await GalleryImage.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!galleryImage) {
            return res.status(404).json({
                success: false,
                message: 'Gallery image not found'
            });
        }

        res.json({
            success: true,
            message: 'Gallery image deleted successfully'
        });

    } catch (error) {
        console.error('Delete gallery image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting gallery image',
            error: error.message
        });
    }
});

// Admin: list all gallery images including inactive
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const images = await GalleryImage.find({}).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: images });
    } catch (error) {
        console.error('Admin gallery images error:', error);
        res.status(500).json({ success: false, message: 'Error fetching gallery images', error: error.message });
    }
});

export default router;
