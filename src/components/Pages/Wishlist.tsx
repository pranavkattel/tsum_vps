import React from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import ProductImage from '../common/ProductImage';
import { useProducts } from '../../hooks/useProducts';

interface WishlistProps {
  onProductClick: (product: Product) => void;
}

export default function Wishlist({ onProductClick }: WishlistProps) {
  const { state, removeFromWishlist, trackWhatsAppInquiry } = useApp();
  const { products } = useProducts({ limit: 1000 });

  // Get actual product objects from wishlist IDs
  const wishlistProducts = state.wishlist
    .map(id => products.find(p => String(p.id) === String(id)))
    .filter(Boolean) as Product[];

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-rice py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border-4 border-ink shadow-brutal p-8 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-terracotta" />
            <h2 className="text-2xl font-display font-bold text-ink mb-4">
              Sign in to Save Your Favorites
            </h2>
            <p className="text-charcoal mb-6">
              Please sign in to your account to save and view your favorite products.
            </p>
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="btn-primary"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen bg-rice py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border-4 border-ink shadow-brutal p-8 text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-charcoal" />
            <h2 className="text-2xl font-display font-bold text-ink mb-4">
              Your Favorites List is Empty
            </h2>
            <p className="text-charcoal mb-6">
              Start adding products to your favorites by clicking the heart icon on any product!
            </p>
            <button
              onClick={() => window.location.href = '/shop'}
              className="btn-primary"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rice py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ink mb-2 uppercase tracking-wider">
            My Favorites
          </h1>
          <p className="text-charcoal font-mono text-sm">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border-4 border-ink shadow-brutal hover:shadow-brutal-lg transition-all group relative"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(String(product.id))}
                className="absolute top-4 right-4 z-10 p-2 bg-rice border-3 border-ink hover:bg-terracotta hover:text-rice transition-colors"
                aria-label="Remove from favorites"
              >
                <Trash2 className="h-5 w-5" />
              </button>

              {/* Product Image */}
              <div
                className="aspect-square overflow-hidden border-b-4 border-ink cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  aspect="square"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3
                  className="font-display font-bold text-ink text-lg mb-2 cursor-pointer hover:text-terracotta transition-colors"
                  onClick={() => onProductClick(product)}
                >
                  {product.name}
                </h3>
                <p className="text-charcoal text-sm font-mono mb-2">{product.category}</p>

                {product.stock === 0 ? (
                  <div className="bg-red-100 border-2 border-red-500 text-red-600 px-3 py-2 font-mono text-xs font-bold mb-3">
                    OUT OF STOCK
                  </div>
                ) : (
                  <p className="text-saffron font-mono text-sm font-bold mb-3">
                    Price depends on size & quality
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onProductClick(product)}
                    className="flex-1 bg-ink text-rice px-4 py-2 font-mono text-xs font-bold hover:bg-terracotta transition-colors border-3 border-ink disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock === 0}
                  >
                    VIEW DETAILS
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WhatsApp Inquiry Button */}
        {wishlistProducts.length > 0 && (
          <div className="mt-8 bg-white border-4 border-ink shadow-brutal p-6 text-center">
            <h3 className="font-display font-bold text-ink text-xl mb-4">
              Interested in Multiple Items?
            </h3>
            <p className="text-charcoal mb-6">
              Send us a message on WhatsApp with your favorites list for pricing and availability.
            </p>
            <button
              onClick={async () => {
                // Track WhatsApp inquiry
                if (state.user) {
                  try {
                    const token = localStorage.getItem('authToken');
                    if (token) {
                      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/wishlist/track-whatsapp`, {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${token}`
                        }
                      });
                    }
                  } catch (error) {
                    console.error('Error tracking WhatsApp inquiry:', error);
                  }
                }
                
                let message = "Hi, I'm interested in these products from my favorites:\n\n";
                wishlistProducts.forEach((product, index) => {
                  const productUrl = `${window.location.origin}/product/${product.id}`;
                  message += `${index + 1}. ${product.name}\n`;
                  message += `   Category: ${product.category}\n`;
                  message += `   View: ${productUrl}\n\n`;
                });
                message += "Could you please provide pricing and availability?\n\nThank you!";
                const whatsappUrl = `https://wa.me/9779820229166?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 mx-auto border-3 border-ink"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Inquire via WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
