import { CartItem, Order } from '../types';

// Mock order storage for demo purposes
let mockOrders: Order[] = [];

export class OrderService {
  // Create a new order
  static async createOrder(
    userId: string,
    items: CartItem[],
    shippingAddress: any,
    paymentMethod: string
  ): Promise<string | null> {
    try {
      const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      const orderId = `order_${Date.now()}`;
      const newOrder: Order = {
        id: orderId,
        userId,
        items,
        total,
        status: 'pending',
        createdAt: new Date(),
        shippingAddress,
        paymentMethod,
        trackingNumber: undefined
      };

      mockOrders.push(newOrder);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  // Get user orders
  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockOrders.filter(order => order.userId === userId);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: string): Promise<boolean> {
    try {
      const orderIndex = mockOrders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = status as any;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  }

  // Update payment status
  static async updatePaymentStatus(orderId: string, paymentStatus: string): Promise<boolean> {
    try {
      // For demo purposes, just log the update
      console.log(`Updating payment status for order ${orderId} to ${paymentStatus}`);
      return true;
    } catch (error) {
      console.error('Error updating payment status:', error);
      return false;
    }
  }
}