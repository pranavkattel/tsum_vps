const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const wishlistService = {
  // Get user's wishlist from server
  async getWishlist(token: string) {
    const response = await fetch(`${API_URL}/wishlist`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch wishlist');
    }
    return data.data;
  },

  // Add product to wishlist
  async addToWishlist(productId: string, token: string) {
    const response = await fetch(`${API_URL}/wishlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add to wishlist');
    }
    return data.data;
  },

  // Remove product from wishlist
  async removeFromWishlist(productId: string, token: string) {
    const response = await fetch(`${API_URL}/wishlist/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to remove from wishlist');
    }
    return data.data;
  },

  // Track WhatsApp inquiry
  async trackWhatsAppInquiry(token: string) {
    try {
      const response = await fetch(`${API_URL}/wishlist/track-whatsapp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error('Failed to track WhatsApp inquiry:', data.message);
      }
    } catch (error) {
      console.error('Error tracking WhatsApp inquiry:', error);
    }
  },
};

export default wishlistService;
