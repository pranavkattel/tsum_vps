export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  category: string;
  artisan: string;
  materials: string[];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  stock: number;
  featured: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  culturalSignificance?: string;
  craftingTechnique?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  productCount: number;
}

export interface Artisan {
  id: string;
  name: string;
  photo: string;
  bio: string;
  specialties: string[];
  location: string;
  experience: number;
  products: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  shippingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  role: 'customer' | 'admin';
  createdAt?: Date;
  lastLogin?: Date;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userName: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: Date;
  image: string;
  tags: string[];
}