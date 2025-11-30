import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductForm from '../../components/Admin/ProductForm';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice via-stone/30 to-rice py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/admin')} 
            className="mb-4 px-4 py-2 bg-white border-3 border-ink shadow-brutal-sm hover:shadow-brutal-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-mono font-bold text-sm uppercase"
          >
            ← Back to Dashboard
          </button>
          
          <div className="bg-white border-3 border-ink shadow-brutal p-8 mb-6">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-ink mb-3">Add New Product</h1>
            <p className="text-lg text-charcoal font-body">
              Create a new product listing for your store. All fields marked with 
              <span className="text-terracotta font-bold"> *</span> are required.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <ProductForm onCreated={() => navigate('/admin')} />
          </div>
          
          {/* Tips Sidebar */}
          <div className="space-y-6">
            {/* Photo Tips */}
            <div className="bg-white border-3 border-ink shadow-brutal p-6">
              <h3 className="text-xl font-display font-bold text-ink mb-4 flex items-center gap-2">
                <span className="text-2xl">📸</span>
                Photo Guidelines
              </h3>
              <ul className="space-y-3 text-sm font-body text-charcoal">
                <li className="flex items-start gap-2">
                  <span className="text-saffron font-bold">✓</span>
                  <span>Use high-quality, well-lit photos with neutral backgrounds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-saffron font-bold">✓</span>
                  <span>Include multiple angles and close-ups of details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-saffron font-bold">✓</span>
                  <span>First image will be the primary product photo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-saffron font-bold">✓</span>
                  <span>Recommended: Square or landscape orientation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-saffron font-bold">✓</span>
                  <span>Max file size: 10MB per image</span>
                </li>
              </ul>
            </div>

            {/* Product Tips */}
            <div className="bg-saffron/10 border-3 border-ink shadow-brutal p-6">
              <h3 className="text-xl font-display font-bold text-ink mb-4 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                Best Practices
              </h3>
              <ul className="space-y-3 text-sm font-body text-charcoal">
                <li className="flex items-start gap-2">
                  <span className="text-terracotta font-bold">•</span>
                  <span>Write detailed, engaging descriptions highlighting cultural significance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta font-bold">•</span>
                  <span>Include accurate dimensions and materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta font-bold">•</span>
                  <span>Set competitive pricing based on craftsmanship quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta font-bold">•</span>
                  <span>Update stock levels accurately to avoid overselling</span>
                </li>
              </ul>
            </div>

            {/* Quick Stats */}
            <div className="bg-indigo text-rice border-3 border-ink shadow-brutal p-6">
              <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Quick Tips
              </h3>
              <div className="space-y-2 text-sm font-mono">
                <p className="opacity-90">✓ Minimum 1 photo required</p>
                <p className="opacity-90">✓ All required fields must be filled</p>
                <p className="opacity-90">✓ Products appear immediately in shop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
