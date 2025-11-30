const API_URL = 'http://localhost:3001/api/email';

export const sendProductInquiryEmail = async (productDetails: {
  name: string;
  category: string;
  size?: string;
  productUrl: string;
  imageUrl: string;
  customerEmail: string;
  customerName?: string;
  userId?: string;
  productId?: string;
}) => {
  try {
    const response = await fetch(`${API_URL}/product-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productDetails),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send inquiry email');
    }

    return data;
  } catch (error) {
    console.error('Error sending inquiry email:', error);
    throw error;
  }
};

export const sendBulkInquiryEmail = async (products: Array<{
  name: string;
  category: string;
  quantity: number;
  productUrl: string;
  imageUrl: string;
}>) => {
  try {
    const response = await fetch(`${API_URL}/bulk-inquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send bulk inquiry email');
    }

    return data;
  } catch (error) {
    console.error('Error sending bulk inquiry email:', error);
    throw error;
  }
};
