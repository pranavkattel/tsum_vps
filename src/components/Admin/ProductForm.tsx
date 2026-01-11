import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Trash2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import authService from '../../services/authService';
import { useCategories } from '../../hooks/useProducts';

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

const ProductForm: React.FC<{ onCreated?: () => void }> = ({ onCreated }) => {
  const [form, setForm] = useState({
    id: `P-${Date.now().toString(36).toUpperCase()}`,
    name: '',
    description: '',
    category: ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { categories, loading: categoriesLoading } = useCategories();

  const activeCategories = useMemo(
    () => categories
      .filter(cat => cat.isActive !== false)
      .sort((a, b) => {
        const orderA = a.order ?? 999;
        const orderB = b.order ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      }),
    [categories]
  );

  useEffect(() => {
    if (!form.category && activeCategories.length > 0) {
      setForm(prev => ({ ...prev, category: activeCategories[0].name }));
    }
  }, [activeCategories, form.category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as any;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 8)); // max 8 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setValidationErrors({});

    // Comprehensive validation
    const errors: Record<string, string> = {};

    if (!form.name.trim()) {
      errors.name = 'Product name is required';
    } else if (form.name.trim().length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    }

    if (!form.description.trim()) {
      errors.description = 'Description is required';
    } else if (form.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }

    if (!form.category.trim()) {
      errors.category = 'Category is required';
    }

    if (images.length < 1) {
      errors.images = 'Please upload at least 1 product photo';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors below');
      // Scroll to top to see error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    try {
      const imagesBase64 = await Promise.all(images.map(f => toBase64(f)));

      const payload = {
        id: form.id,
        name: form.name.trim(),
        description: form.description.trim(),
        images: imagesBase64,
        category: form.category.trim()
      };

      const token = authService.getToken();

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Error creating product');
      } else {
        setSuccess(true);
        setForm({ id: `P-${Date.now().toString(36).toUpperCase()}`, name: '', description: '', category: '' });
        setImages([]);
        
        // Scroll to top to see success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        if (onCreated) {
          setTimeout(() => onCreated(), 2000);
        } else {
          setTimeout(() => setSuccess(false), 3000);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-200">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Add New Product</h3>
        <p className="text-gray-600">Fill in the details to create a new product listing</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg font-medium">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg flex items-center gap-2 font-medium">
          <CheckCircle className="w-5 h-5" />
          ✅ Product created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  validationErrors.name 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-amber-500'
                }`}
                placeholder="e.g., Handcrafted Buddha Statue"
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-600 font-medium">⚠️ {validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={8}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                  validationErrors.description 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-amber-500'
                }`}
                placeholder="Describe the product, its features, and cultural significance..."
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-600 font-medium">⚠️ {validationErrors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors bg-white ${
                  validationErrors.category 
                    ? 'border-red-300 focus:border-red-500 bg-red-50' 
                    : 'border-gray-200 focus:border-amber-500'
                }`}
              >
                <option value="">Select a category</option>
                {categoriesLoading && <option disabled>Loading categories...</option>}
                {!categoriesLoading && activeCategories.length === 0 && (
                  <option disabled>No categories found</option>
                )}
                {activeCategories.map(cat => (
                  <option key={cat.id || cat._id || cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {validationErrors.category && (
                <p className="mt-1 text-sm text-red-600 font-medium">⚠️ {validationErrors.category}</p>
              )}
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Photos ({images.length}/8) <span className="text-red-500">*</span>
              </label>
              
              {validationErrors.images && (
                <div className="mb-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">⚠️ {validationErrors.images}</p>
                </div>
              )}
              
              {/* Upload Area */}
              <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                validationErrors.images
                  ? 'border-red-300 hover:border-red-400 hover:bg-red-50'
                  : 'border-gray-300 hover:border-amber-500 hover:bg-amber-50'
              }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 font-medium mb-1">Click to upload images</p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB each</p>
                  <p className="text-xs text-amber-600 mt-2 font-medium">
                    First image will be the main product photo
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={images.length >= 8}
                />
              </label>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {images.map((file, index) => (
                    <div key={index} className="relative group border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                          PRIMARY
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                        {Math.round(file.size / 1024)} KB
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {images.length === 0 && (
                <div className="mt-4 flex flex-col items-center justify-center py-8 text-gray-400">
                  <ImageIcon className="w-16 h-16 mb-2" />
                  <p className="text-sm">No images uploaded yet</p>
                  <p className="text-xs">Add at least 1 photo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            disabled={loading || images.length === 0}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
