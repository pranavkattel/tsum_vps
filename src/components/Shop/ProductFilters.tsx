import { useState, useEffect } from 'react';

interface ProductFiltersProps {
  onFilterChange: (filters: any) => void;
  categories?: string[];
  filters?: {
    priceRange: [number, number];
    sortBy: string;
    categories: string[];
  };
}

export default function ProductFilters({ onFilterChange, categories = [], filters }: ProductFiltersProps) {
  const [minPrice, setMinPrice] = useState(filters?.priceRange[0] || 0);
  const [maxPrice, setMaxPrice] = useState(filters?.priceRange[1] || 50000);
  const [sortBy, setSortBy] = useState(filters?.sortBy || 'name');
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Single category or empty for "All"

  // Initialize state only once from props or defaults
  useEffect(() => {
    if (filters) {
      setMinPrice(filters.priceRange[0]);
      setMaxPrice(filters.priceRange[1]);
      setSortBy(filters.sortBy);
      setSelectedCategory(filters.categories.length === 1 ? filters.categories[0] : '');
    } else {
      // Start with "All" selected (empty string means all categories)
      setSelectedCategory('');
    }
  }, []); // Only run once on mount

  const handleFilterChange = () => {
    onFilterChange({
      priceRange: [minPrice, maxPrice],
      sortBy,
      categories: selectedCategory ? [selectedCategory] : [] // Empty array means "All"
    });
  };

  // Only trigger filter change when values actually change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange();
    }, 100); // Small debounce to prevent excessive calls

    return () => clearTimeout(timeoutId);
  }, [minPrice, maxPrice, sortBy, selectedCategory]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      {/* Category Filter - Single Selection with All Option */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3">Categories</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Price Range Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Price: ₨{minPrice.toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={minPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value <= maxPrice) {
                  setMinPrice(value);
                }
              }}
              className="w-full accent-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Price: ₨{maxPrice.toLocaleString()}</label>
            <input
              type="range"
              min="0"
              max="50000"
              step="1000"
              value={maxPrice}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (value >= minPrice) {
                  setMaxPrice(value);
                }
              }}
              className="w-full accent-amber-500"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600 pt-2">
            <span>₨{minPrice.toLocaleString()}</span>
            <span>₨{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Sort By</h4>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
          <option value="rating">Rating (High to Low)</option>
        </select>
      </div>
    </div>
  );
}