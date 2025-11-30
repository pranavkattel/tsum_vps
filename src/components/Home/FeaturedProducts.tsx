import { Star, Eye, Heart } from 'lucide-react';
import { Product } from '../../types';
import ProductImage from '../common/ProductImage';

interface FeaturedProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function FeaturedProducts({ products, onProductClick }: FeaturedProductsProps) {
  

  // Top sellers: featured only, sorted by rating then reviews; limit 4 items
  const featuredProducts = products
    .filter(product => product.featured)
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return (b.reviews || 0) - (a.reviews || 0);
    })
    .slice(0, 4); // show top 4

  

  return (
    <section className="py-24 bg-rice relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pattern-dots pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-1 w-16 bg-terracotta"></div>
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-charcoal">
              Curated Selection
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-ink mb-6 font-display leading-tight">
            Featured
            <span className="block text-terracotta">Masterworks</span>
          </h2>
          <p className="text-lg text-charcoal max-w-2xl leading-relaxed italic">
            Handpicked pieces that exemplify the zenith of Himalayan craftsmanship—
            where ancient technique meets contemporary vision.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="product-card group cursor-pointer bg-white"
              onClick={() => onProductClick(product)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden bg-stone">
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  aspect="portrait"
                  className="group-hover:scale-105 transition-transform duration-700"
                  classNameWrapper="h-80"
                  fallbackText="Preview"
                />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-indigo/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onProductClick(product);
                    }}
                    className="p-3 bg-saffron border-3 border-ink hover:bg-rice transition-colors"
                  >
                    <Eye className="h-5 w-5 text-ink" />
                  </button>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-3 bg-saffron border-3 border-ink hover:bg-terracotta hover:text-rice transition-colors"
                  >
                    <Heart className="h-5 w-5 text-ink" />
                  </button>
                </div>

                {/* Sale Badge */}
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-terracotta text-rice px-3 py-1 border-3 border-ink font-mono font-bold text-xs uppercase shadow-brutal-sm">
                    Sale
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 bg-saffron text-ink px-3 py-1 border-3 border-ink font-mono font-bold text-xs uppercase">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <div className="mb-4">
                  <h3 className="product-title mb-2 line-clamp-2 group-hover:text-terracotta transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-charcoal text-sm line-clamp-2 font-display italic opacity-80">
                    {product.description}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-saffron fill-current'
                            : 'text-stone'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-charcoal">({product.rating})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="product-price">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-charcoal line-through font-mono opacity-50">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="text-xs font-mono font-bold text-rice bg-terracotta px-2 py-1 border-2 border-ink">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Add to Cart removed on listing cards; use product detail page to add */}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <button
            onClick={() => onProductClick}
            className="btn-secondary text-base"
          >
            View Full Collection
          </button>
        </div>
      </div>
    </section>
  );
}