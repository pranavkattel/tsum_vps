import { useState, useEffect } from 'react';
import { Product } from '../../types';
import ProductGrid from './ProductGrid';
import ProductFilters from './ProductFilters';
import { useApp } from '../../context/AppContext';
import { ProductService } from '../../services/productService';

interface ShopProps {
  onProductClick: (product: Product) => void;
}

export default function Shop({ onProductClick }: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const { state, dispatch } = useApp();
  
  // Lift filter state to Shop level
  const [filters, setFilters] = useState({
    priceRange: [0, 50000] as [number, number],
    sortBy: 'name',
    categories: [] as string[],
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      const cats = await ProductService.getCategories();
      setCategories(cats.map(c => (typeof c === 'string' ? c : c.name)).sort());
    };
    fetchCategories();
  }, []);

  // Fetch products whenever filters or search query changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await ProductService.getProducts({
          minPrice: filters.priceRange[0],
          maxPrice: filters.priceRange[1],
          sortBy: filters.sortBy,
          category: filters.categories.length > 0 ? filters.categories[0] : undefined,
          search: state.searchQuery || undefined,
          limit: 200, // Get all products
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters, state.searchQuery]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-rice py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-12 bg-terracotta"></div>
            <span className="font-mono font-bold text-xs uppercase tracking-widest text-charcoal">
              Full Catalog
            </span>
          </div>
          <h1 className="text-5xl font-bold text-ink mb-3 font-display">Sacred Statue Collection</h1>
          <p className="text-lg text-charcoal font-display italic">Discover our complete collection of handcrafted sculptures</p>
          {state.searchQuery && (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm font-mono text-charcoal">SEARCHING FOR:</span>
              <span className="bg-saffron text-ink px-3 py-1 border-3 border-ink font-mono font-bold text-xs uppercase shadow-brutal-sm">
                "{state.searchQuery}"
              </span>
              <button
                onClick={() => dispatch({ type: 'CLEAR_SEARCH_QUERY' })}
                className="text-xs font-mono font-bold text-terracotta hover:text-terracotta-dark uppercase underline"
              >
                × Clear
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12 text-charcoal font-mono">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-charcoal">
                <p className="text-xl font-display">No products found matching your criteria.</p>
                <p className="text-sm font-mono mt-2">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <ProductGrid
                products={products}
                onProductClick={onProductClick}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}