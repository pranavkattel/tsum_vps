import { Product, Category, Artisan } from '../types';
import { mockCategories, mockArtisans } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class ProductService {
  // Get all products with optional filtering
  static async getProducts(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sortBy?: string;
  }): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters?.featured) {
        params.append('featured', 'true');
      }
      if (filters?.limit) {
        params.append('limit', String(filters.limit));
      }
      if (filters?.offset) {
        params.append('page', String(Math.floor(filters.offset / (filters.limit || 10)) + 1));
      }
      if (filters?.minPrice !== undefined) {
        params.append('minPrice', String(filters.minPrice));
      }
      if (filters?.maxPrice !== undefined) {
        params.append('maxPrice', String(filters.maxPrice));
      }
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.sortBy) {
        // Map frontend sort values to backend
        const sortMap: Record<string, { sortBy: string; sortOrder: string }> = {
          'price-low': { sortBy: 'price', sortOrder: 'asc' },
          'price-high': { sortBy: 'price', sortOrder: 'desc' },
          'rating': { sortBy: 'rating', sortOrder: 'desc' },
          'name': { sortBy: 'name', sortOrder: 'asc' },
        };
        const sort = sortMap[filters.sortBy] || { sortBy: 'createdAt', sortOrder: 'desc' };
        params.append('sortBy', sort.sortBy);
        params.append('sortOrder', sort.sortOrder);
      }

      const response = await fetch(`${API_URL}/products?${params}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const json = await response.json();
      return json.data || json.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  // Get single product by ID
  static async getProduct(id: string): Promise<Product | null> {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) return null;
      
      const json = await response.json();
      return json.data || json.product || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  // Search products
  static async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_URL}/products?search=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search products');
      
      const json = await response.json();
      return json.data || json.products || [];
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockCategories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Get all artisans
  static async getArtisans(): Promise<Artisan[]> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return mockArtisans;
    } catch (error) {
      console.error('Error fetching artisans:', error);
      return [];
    }
  }
}