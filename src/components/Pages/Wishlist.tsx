import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { ProductService } from '../../services/productService';

interface WishlistProps {
  onProductClick: (product: Product) => void;
}

export default function Wishlist({ onProductClick }: WishlistProps) {
  const { state, dispatch } = useApp();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (state.wishlist.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch all products that are in the wishlist
        const productPromises = state.wishlist.map(id => 
          ProductService.getProduct(id)
        );
        const products = await Promise.all(productPromises);
        setWishlistProducts(products.filter((p): p is Product => p !== null));
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [state.wishlist]);

  const handleRemoveFromWishlist = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!state.isAuthenticated) {
      dispatch({ type: 'SET_ERROR', payload: 'Please sign in to add items to your cart.' });
      return;
    }
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity: 1 } });
  };

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-rice py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border-4 border-ink shadow-brutal p-12 text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-terracotta" />
            <h2 className="text-3xl font-display font-bold text-ink mb-4 uppercase">
              Sign in to View Wishlist
            </h2>
            <p className="text-charcoal font-mono mb-8">
              Please sign in to your account to view and manage your wishlist.
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

  if (loading) {
    return (
      <div className="min-h-screen bg-rice py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center fade-in p-10 bg-white border-4 border-ink shadow-brutal">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-ink border-t-terracotta animate-spin"></div>
              <div className="absolute inset-2 border-4 border-saffron opacity-50"></div>
            </div>
            <p className="text-xl font-display font-bold text-ink">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rice py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-terracotta"></div>
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-charcoal">
              Your Favorites
            </span>
          </div>
          <h1 className="text-5xl font-bold text-ink mb-3 font-display uppercase">
            My Wishlist
          </h1>
          <p className="text-lg text-charcoal font-display">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Empty State */}
        {wishlistProducts.length === 0 ? (
          <div className="bg-white border-4 border-ink shadow-brutal p-12 text-center">
            <Heart className="h-20 w-20 mx-auto mb-6 text-charcoal opacity-30" />
            <h2 className="text-2xl font-display font-bold text-ink mb-4 uppercase">
              Your Wishlist is Empty
            </h2>
            <p className="text-charcoal font-mono mb-8">
              Start adding items to your wishlist by clicking the heart icon on products you love!
            </p>
            <button
              onClick={() => window.location.href = '/shop'}
              className="bg-terracotta text-rice px-8 py-4 font-mono font-bold hover:bg-terracotta-dark transition-colors border-4 border-ink shadow-brutal hover:translate-x-1 hover:translate-y-1 hover:shadow-none uppercase"
            >
              Browse Products
            </button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white border-4 border-ink shadow-brutal cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className={`w-full h-56 object-cover ${product.stock === 0 ? 'opacity-60' : ''}`}
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-terracotta text-rice px-4 py-2 font-mono font-bold text-sm border-3 border-ink uppercase">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  
                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={(e) => handleRemoveFromWishlist(product.id, e)}
                    className="absolute top-4 right-4 bg-white p-2 border-3 border-ink shadow-brutal hover:bg-terracotta hover:text-rice transition-colors group"
                    title="Remove from wishlist"
                  >
                    <Heart className="h-5 w-5 fill-terracotta text-terracotta group-hover:fill-rice group-hover:text-rice" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4 border-t-3 border-ink">
                  <h3 className="text-lg font-display font-bold text-ink mb-2 line-clamp-2 uppercase">
                    {product.name}
                  </h3>

                  <p className="text-charcoal text-sm mb-3 line-clamp-2 font-mono">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono font-bold text-charcoal bg-saffron/30 px-2 py-1 border-2 border-ink uppercase">
                      {product.category}
                    </span>
                    {product.stock > 0 && product.stock <= 5 && (
                      <span className="text-xs font-mono font-bold text-terracotta bg-terracotta/10 px-2 py-1 border-2 border-ink uppercase">
                        Only {product.stock} left
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleRemoveFromWishlist(product.id, e)}
                      className="flex-1 bg-white text-terracotta px-4 py-2 font-mono font-bold hover:bg-terracotta hover:text-rice transition-colors border-3 border-ink flex items-center justify-center gap-2 text-sm uppercase"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                    {product.stock > 0 && (
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex-1 bg-terracotta text-rice px-4 py-2 font-mono font-bold hover:bg-terracotta-dark transition-colors border-3 border-ink flex items-center justify-center gap-2 text-sm uppercase"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
