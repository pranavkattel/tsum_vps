import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ products, onProductClick }: ProductGridProps) {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state.isAuthenticated) {
      dispatch({ type: 'SET_ERROR', payload: 'Please sign in to add items to your cart.' });
      navigate('/auth/login', { state: { from: location } });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1 } });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          onClick={() => onProductClick(product)}
          className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl"
        >
          <div className="relative">
            <img
              src={product.images[0]}
              alt={product.name}
              className={`w-full h-48 object-cover ${product.stock === 0 ? 'opacity-60' : ''}`}
            />
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">
                  OUT OF STOCK
                </span>
              </div>
            )}

          </div>
          
          <div className="p-4">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-xs text-gray-600">
                ({product.reviews})
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="mt-3">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-amber-800 text-center">
                  Price depends on size & quality
                </p>
                <p className="text-xs text-amber-600 text-center mt-1">
                  Click for inquiry options
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}