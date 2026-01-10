import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import authService from '../../services/authService';

interface Review {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ProductRatingProps {
  productId: string;
  currentRating: number;
  reviewCount: number;
  onRatingSubmitted?: () => void;
}

export default function ProductRating({ productId, currentRating, reviewCount, onRatingSubmitted }: ProductRatingProps) {
  const { state } = useApp();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/products/${productId}/ratings`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data.userReviews || []);
        
        // Check if current user has already rated
        if (state.isAuthenticated) {
          const currentUser = authService.getUser();
          const userReview = data.data.userReviews?.find((r: Review) => r.user._id === currentUser?.id);
          if (userReview) {
            setUserRating(userReview.rating);
            setComment(userReview.comment || '');
          }
        }
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
    if (!state.isAuthenticated) {
      setError('Please sign in to rate this product');
      return;
    }

    if (userRating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = authService.getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/products/${productId}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: userRating,
          comment: comment.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Rating submitted successfully!');
        setShowReviewForm(false);
        fetchReviews();
        if (onRatingSubmitted) onRatingSubmitted();
        
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to submit rating');
      }
    } catch (err) {
      setError('Error submitting rating');
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, interactive = false, size = 'sm' }: { rating: number; interactive?: boolean; size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= (interactive ? (hoverRating || rating) : rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && setUserRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h3 className="text-2xl font-bold mb-4">Ratings & Reviews</h3>

      {/* Overall Rating */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b">
        <div className="text-center">
          <div className="text-4xl font-bold text-amber-500">{currentRating.toFixed(1)}</div>
          <StarRating rating={Math.round(currentRating)} />
          <div className="text-sm text-gray-600 mt-1">{reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}</div>
        </div>
      </div>

      {/* Add/Edit Review Button */}
      {state.isAuthenticated && (
        <div className="mb-6">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            {userRating > 0 ? 'Edit Your Review' : 'Write a Review'}
          </button>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && state.isAuthenticated && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-3">Your Rating</h4>
          <StarRating rating={userRating} interactive={true} size="lg" />
          
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Your Review (optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows={4}
              placeholder="Share your thoughts about this product..."
            />
          </div>

          {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
          {success && <div className="mt-3 text-green-600 text-sm">{success}</div>}

          <div className="mt-4 flex gap-3">
            <button
              onClick={submitRating}
              disabled={submitting || userRating === 0}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
            <button
              onClick={() => {
                setShowReviewForm(false);
                setError('');
                setSuccess('');
              }}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {!state.isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          Please <a href="/auth/login" className="underline font-semibold">sign in</a> to write a review
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews yet. Be the first to review!</div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className="border-b pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold">{review.user.firstName} {review.user.lastName}</div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
