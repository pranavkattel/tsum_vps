import React, { useEffect, useState } from 'react';
import { X, Upload, Trash2, MoveUp, MoveDown, Image as ImageIcon } from 'lucide-react';
import authService from '../../services/authService';

type Props = {
  product: any;
  onClose: () => void;
  onSaved: (p: any) => void;
};

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

const ProductEditModal: React.FC<Props> = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState<any>({});
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ ...product });
    setCurrentImages(product.images || []);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as any;
    setForm((s: any) => ({ ...s, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setNewImageFiles(prev => [...prev, ...files].slice(0, 8)); // max 8 images total
  };

  const removeCurrentImage = (index: number) => {
    setCurrentImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setCurrentImages(prev => {
      const newArr = [...prev];
      [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
      return newArr;
    });
  };

  const moveImageDown = (index: number) => {
    setCurrentImages(prev => {
      if (index >= prev.length - 1) return prev;
      const newArr = [...prev];
      [newArr[index], newArr[index + 1]] = [newArr[index + 1], newArr[index]];
      return newArr;
    });
  };

  const handleSave = async () => {
    setError(null);

    // Validate at least 1 image
    if (currentImages.length === 0 && newImageFiles.length === 0) {
      setError('Please provide at least one product image.');
      return;
    }

    setSaving(true);
    try {
      const token = authService.getToken();
      
      // Convert new files to base64
      const newImagesBase64 = await Promise.all(newImageFiles.map(f => toBase64(f)));
      
      // Combine current images with new ones
      const allImages = [...currentImages, ...newImagesBase64];

      const payload = { ...form, images: allImages };

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/products/${product._id || product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error saving product');
      onSaved(json.data || json);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  const totalImages = currentImages.length + newImageFiles.length;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div>
            <h3 className="text-2xl font-bold">Edit Product</h3>
            <p className="text-sm opacity-90">Update product details and images</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                <input
                  name="name"
                  value={form.name || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors resize-none"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₨)</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                  <input
                    name="stock"
                    type="number"
                    value={form.stock || 0}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <input
                  name="category"
                  value={form.category || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="e.g., Religious Statues"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Artisan</label>
                <input
                  name="artisan"
                  value={form.artisan || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                  placeholder="Artisan name"
                />
              </div>
            </div>

            {/* Right Column - Images */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Images ({totalImages}/8)
                </label>
                
                {/* Upload Area */}
                <div className="mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 font-medium">Click to upload images</p>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={totalImages >= 8}
                    />
                  </label>
                </div>

                {/* Current Images */}
                {currentImages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Current Images</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {currentImages.map((img, index) => (
                        <div key={index} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden">
                          <img src={img} alt={`Product ${index + 1}`} className="w-full h-32 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <button
                              onClick={() => moveImageUp(index)}
                              disabled={index === 0}
                              className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <MoveUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveImageDown(index)}
                              disabled={index === currentImages.length - 1}
                              className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <MoveDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeCurrentImage(index)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                              PRIMARY
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {newImageFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">New Images (will be added)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {newImageFiles.map((file, index) => (
                        <div key={index} className="relative group border-2 border-green-200 rounded-lg overflow-hidden">
                          <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-32 object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              onClick={() => removeNewImage(index)}
                              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                            NEW
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {totalImages === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <ImageIcon className="w-16 h-16 mb-2" />
                    <p className="text-sm">No images yet</p>
                  </div>
                )}
              </div>
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
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;
