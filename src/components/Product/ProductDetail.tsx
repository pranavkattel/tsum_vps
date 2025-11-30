import React, { useState } from 'react';
import { Star, Truck, Shield, Award, ArrowLeft } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductImage from '../common/ProductImage';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-amber-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="p-8">
              <div className="mb-4">
                <ProductImage
                  src={product.images[selectedImage]}
                  alt={product.name}
                  aspect="portrait"
                  classNameWrapper="h-96 rounded-lg"
                  className="rounded-lg"
                  fallbackText="Main image not available"
                />
              </div>
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-amber-600' : 'border-gray-200'
                    }`}
                  >
                    <ProductImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      aspect="square"
                      fallbackText="No thumb"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-8">
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-xl font-bold text-amber-800 text-center">
                    Price depends on size & quality
                  </p>
                  <p className="text-sm text-amber-600 text-center mt-2">
                    Contact us for a custom quote
                  </p>
                </div>
                <p className="text-gray-600 mb-4">{product.description}</p>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <span className="text-sm text-gray-500">Artisan:</span>
                  <p className="font-semibold text-gray-800">{product.artisan}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Category:</span>
                  <p className="font-semibold text-gray-800">{product.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Materials:</span>
                  <p className="font-semibold text-gray-800">{product.materials.join(', ')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Stock:</span>
                  <p className={`font-semibold ${
                    product.stock === 0 ? 'text-red-600' : product.stock < 5 ? 'text-orange-600' : 'text-gray-800'
                  }`}>
                    {product.stock === 0 ? 'Out of Stock' : `${product.stock} available`}
                  </p>
                </div>
              </div>

              {/* Size Selection and Inquiry Options */}
              {product.stock === 0 ? (
                <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
                  <p className="text-red-600 font-bold text-lg text-center">OUT OF STOCK</p>
                  <p className="text-red-500 text-sm text-center mt-1">This item is currently unavailable</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {/* Size Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Size *
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-600"
                    >
                      <option value="1">Small (6-8 inches)</option>
                      <option value="2">Medium (9-12 inches)</option>
                      <option value="3">Large (13-18 inches)</option>
                      <option value="4">Extra Large (19-24 inches)</option>
                      <option value="5">Custom Size</option>
                    </select>
                  </div>

                  {/* Inquiry Buttons */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        const sizeOptions = ['Small (6-8 inches)', 'Medium (9-12 inches)', 'Large (13-18 inches)', 'Extra Large (19-24 inches)', 'Custom Size'];
                        const selectedSize = sizeOptions[quantity - 1];
                        const productUrl = `${window.location.origin}/product/${product.id}`;
                        const message = `Hi, I'm interested in this product:\n\n*${product.name}*\nSize: ${selectedSize}\nCategory: ${product.category}\n\nView Product: ${productUrl}\n\nCould you please provide pricing and availability?\n\nThank you!`;
                        const whatsappUrl = `https://wa.me/9779820229166?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      WhatsApp Inquiry
                    </button>
                    <button
                      onClick={() => {
                        const sizeOptions = ['Small (6-8 inches)', 'Medium (9-12 inches)', 'Large (13-18 inches)', 'Extra Large (19-24 inches)', 'Custom Size'];
                        const selectedSize = sizeOptions[quantity - 1];
                        const subject = `Inquiry: ${product.name}`;
                        const body = `Hi,\n\nI'm interested in the following product:\n\nProduct Name: ${product.name}\nSize: ${selectedSize}\nCategory: ${product.category}\n\nCould you please provide pricing, availability, and any additional details?\n\nThank you!`;
                        window.location.href = `mailto:info@tsum.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Email Inquiry
                    </button>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-amber-600" />
                    <span className="text-sm text-gray-600">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <span className="text-sm text-gray-600">Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-amber-600" />
                    <span className="text-sm text-gray-600">Authentic Craft</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="border-t p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Cultural Significance</h3>
                <p className="text-gray-600">{product.culturalSignificance}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Crafting Technique</h3>
                <p className="text-gray-600">{product.craftingTechnique}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}