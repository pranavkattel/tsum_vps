import React, { useEffect, useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import authService from '../../services/authService';

type Props = {
    galleryItem: any | null;  // null for creating new item
    onClose: () => void;
    onSaved: (item: any) => void;
};

const CATEGORIES = ['Mountains', 'Lakes', 'Valleys', 'Heritage', 'Nature', 'Landscapes', 'Culture'];

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const GalleryEditModal: React.FC<Props> = ({ galleryItem, onClose, onSaved }) => {
    const [form, setForm] = useState<any>({
        title: '',
        description: '',
        category: 'Mountains',
        image: ''
    });
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditing = !!galleryItem;

    useEffect(() => {
        if (galleryItem) {
            setForm({
                title: galleryItem.title || '',
                description: galleryItem.description || '',
                category: galleryItem.category || 'Mountains',
                image: galleryItem.image || ''
            });
            setImagePreview(galleryItem.image || '');
        }
    }, [galleryItem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((s: any) => ({ ...s, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        setNewImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        setError(null);

        if (!form.title.trim()) {
            setError('Please enter a title.');
            return;
        }
        if (!form.description.trim()) {
            setError('Please enter a description.');
            return;
        }
        if (!imagePreview && !form.image) {
            setError('Please upload an image.');
            return;
        }

        setSaving(true);
        try {
            const token = authService.getToken();

            let imageData = form.image;
            if (newImageFile) {
                imageData = await toBase64(newImageFile);
            }

            const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                category: form.category,
                image: imageData
            };

            const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const url = isEditing
                ? `${baseUrl}/gallery/${galleryItem._id}`
                : `${baseUrl}/gallery`;

            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Error saving gallery item');

            onSaved(json.data || json);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    <div>
                        <h3 className="text-2xl font-bold">{isEditing ? 'Edit Gallery Item' : 'Add Gallery Item'}</h3>
                        <p className="text-sm opacity-90">
                            {isEditing ? 'Update gallery image details' : 'Add a new image to Nepal Gallery'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                                placeholder="e.g., Mount Everest"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                                placeholder="Describe this location or scenery..."
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:outline-none transition-colors"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>

                            {/* Upload Area */}
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors mb-4">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600 font-medium">Click to upload image</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                                        {newImageFile ? 'NEW' : 'CURRENT'}
                                    </div>
                                </div>
                            )}

                            {!imagePreview && (
                                <div className="flex flex-col items-center justify-center py-8 text-gray-400 border-2 border-gray-200 rounded-lg">
                                    <ImageIcon className="w-16 h-16 mb-2" />
                                    <p className="text-sm">No image selected</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add to Gallery')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GalleryEditModal;
