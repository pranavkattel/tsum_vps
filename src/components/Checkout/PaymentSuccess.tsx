import React from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface PaymentSuccessProps {
  orderId: string;
  onContinueShopping: () => void;
}

export default function PaymentSuccess({ orderId, onContinueShopping }: PaymentSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Thank you for your order. Your payment has been processed successfully.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Package className="h-5 w-5 text-amber-600 mr-2" />
            <span className="font-semibold">Order ID</span>
          </div>
          <p className="text-lg font-mono text-gray-800">{orderId}</p>
        </div>

        <div className="space-y-3 text-sm text-gray-600 mb-6">
          <p>• You will receive an email confirmation shortly</p>
          <p>• Your order will be processed within 1-2 business days</p>
          <p>• Tracking information will be sent via email</p>
        </div>

        <button
          onClick={onContinueShopping}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}