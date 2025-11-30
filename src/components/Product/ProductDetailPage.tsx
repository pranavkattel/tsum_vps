import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendProductInquiryEmail } from '@/services/emailService';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

interface ProductDetailPageProps {
  product?: Product | null;
  allProducts?: Product[] | null;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product: propProduct = null, allProducts = null }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const { state: appState, dispatch, addToWishlist, removeFromWishlist } = useApp();
  const navigate = useNavigate();
  const location = useLocation();


  // Use product from props when provided, otherwise fallback to example data below
  const exampleProduct: Product = {
    id: '1',
    name: 'Handcrafted Buddha Statue',
    price: 149.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviews: 127,
    description:
      'Exquisite handcrafted Buddha statue made by skilled Nepali artisans. This beautiful piece represents centuries of traditional craftsmanship and spiritual heritage. Each statue is unique and carefully crafted with attention to detail.',
    images: [
      // Keep these as fallback-only images; real product images will be used when passed in
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1604522307293-d0e1c5e8e8c1?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1599619351208-3e6906b5e2c7?w=800&h=800&fit=crop',
    ],
    category: 'Religious Statues',
    material: 'Bronze with Gold Plating',
    dimensions: '12" H x 8" W x 6" D',
    weight: '3.5 lbs',
    inStock: true,
    features: [
      'Handcrafted by master artisans',
      'Traditional Nepali craftsmanship',
      'Premium bronze with gold plating',
      'Unique piece with slight variations',
      'Comes with certificate of authenticity',
      'Perfect for meditation spaces',
    ],
  };

  const product: Product = propProduct ?? exampleProduct;

  // sync initial wishlist state from context
  useEffect(() => {
    if (product && appState?.wishlist) {
      setIsFavorite(appState.wishlist.includes(String(product.id)));
    }
  }, [product, appState?.wishlist]);

  // Normalize fields to support both legacy product shape and current `src/types` shape
  const images: string[] = ((product as any).images ?? []) as string[];
  const materialText = (product as any).material
    ?? ((product as any).materials ? (product as any).materials.join(', ') : undefined)
    ?? '—';
  const dimensionsText = typeof (product as any).dimensions === 'string'
    ? (product as any).dimensions
    : (product as any).dimensions
      ? `${(product as any).dimensions.length} x ${(product as any).dimensions.width} x ${(product as any).dimensions.height}`
      : '—';
  const weightText = typeof (product as any).weight === 'number'
    ? `${(product as any).weight} lbs`
    : (product as any).weight ?? '—';
  const inStock = (product as any).inStock ?? (typeof (product as any).stock === 'number' ? (product as any).stock > 0 : true);
  const featuresList: string[] = (product as any).features ?? (product as any).tags ?? [];
  const originalPrice = (product as any).originalPrice ?? 0;

  const reviews: Review[] = [
    {
      id: '1',
      author: 'Sarah Johnson',
      rating: 5,
      date: 'March 15, 2024',
      comment: 'Absolutely stunning piece! The craftsmanship is incredible and it arrived perfectly packaged. A beautiful addition to my meditation room.',
    },
    {
      id: '2',
      author: 'Michael Chen',
      rating: 5,
      date: 'March 10, 2024',
      comment: 'The quality exceeded my expectations. You can tell this was made with care and expertise. Highly recommend!',
    },
    {
      id: '3',
      author: 'Emma Williams',
      rating: 4,
      date: 'March 5, 2024',
      comment: 'Beautiful statue with excellent detail. Shipping took a bit longer than expected but worth the wait.',
    },
  ];

  // If `allProducts` provided, compute related products by same category (exclude current)
  const relatedProducts: { id: string; name: string; price: number; image: string; rating: number }[] =
    (allProducts && Array.isArray(allProducts))
      ? allProducts
          .filter((p) => (p.category ?? '') === (product.category ?? '') && String(p.id) !== String(product.id))
          .slice(0, 8)
          .map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: Array.isArray((p as any).images) && (p as any).images[0] ? (p as any).images[0] : '',
            rating: p.rating ?? 0,
          }))
      : [
          {
            id: '2',
            name: 'Ganesh Statue',
            price: 129.99,
            image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=400&h=400&fit=crop',
            rating: 4.7,
          },
          {
            id: '3',
            name: 'Tara Statue',
            price: 139.99,
            image: 'https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=400&fit=crop',
            rating: 4.9,
          },
          {
            id: '4',
            name: 'Meditation Bowl',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop',
            rating: 4.6,
          },
          {
            id: '5',
            name: 'Prayer Wheel',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400&h=400&fit=crop',
            rating: 4.8,
          },
        ];

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? (images.length ? images.length - 1 : 0) : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === (images.length ? images.length - 1 : 0) ? 0 : prev + 1));
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!appState.isAuthenticated) {
      // redirect to login and preserve location
      navigate('/auth/login', { state: { from: location } });
      dispatch({ type: 'SET_ERROR', payload: 'Please sign in to add items to your cart.' });
      return;
    }
    if (isAddedToCart) return;
    setIsAddingToCart(true);
    setTimeout(() => {
      dispatch({ type: 'ADD_TO_CART', payload: { product: product as Product, quantity } });
      setIsAddingToCart(false);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }, 600);
  };

  const handleBuyNow = () => {
    if (!product) return;
    // add to cart then go to checkout
    dispatch({ type: 'ADD_TO_CART', payload: { product: product as Product, quantity } });
    navigate('/checkout');
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (!appState.isAuthenticated) {
      navigate('/auth/login', { state: { from: location } });
      dispatch({ type: 'SET_ERROR', payload: 'Please sign in to add items to your wishlist.' });
      return;
    }
    const id = String(product.id);
    if (appState.wishlist.includes(id)) {
      removeFromWishlist(id);
      setIsFavorite(false);
    } else {
      addToWishlist(id);
      setIsFavorite(true);
    }
  };

  return (
    <div className="min-h-screen bg-rice font-display">
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden border-4 border-ink shadow-brutal bg-stone">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-rice/80 border-3 border-ink shadow-brutal"
                onClick={handlePrevImage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-rice/80 border-3 border-ink shadow-brutal"
                onClick={handleNextImage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-3 transition-all ${
                    selectedImage === index
                      ? 'border-terracotta shadow-brutal'
                      : 'border-ink hover:border-indigo'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <Badge variant="secondary" className="mb-2 border-3 border-ink font-mono uppercase tracking-widest">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-display font-bold text-ink mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-saffron text-saffron'
                          : 'text-stone'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-mono text-charcoal">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border-3 border-amber-300 rounded-lg p-4">
              <p className="text-lg font-bold text-amber-900 text-center font-mono">
                💰 Price depends on size & quality
              </p>
              <p className="text-sm text-amber-700 text-center mt-1">
                Contact us via WhatsApp or Email for pricing details
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-ink mb-2 font-mono uppercase tracking-widest">Description</h3>
              <p className="text-charcoal leading-relaxed font-display italic">{product.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-mono text-charcoal uppercase">Material</p>
                <p className="font-medium text-ink">{materialText}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-charcoal uppercase">Dimensions</p>
                <p className="font-medium text-ink">{dimensionsText}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-charcoal uppercase">Weight</p>
                <p className="font-medium text-ink">{weightText}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-charcoal uppercase">Availability</p>
                <p className="font-medium text-green-700 flex items-center">
                  <Check className="h-4 w-4 mr-1" /> {inStock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-ink mb-3 font-mono uppercase tracking-widest">Features</h3>
              <ul className="space-y-2">
                {featuresList.map((feature, index) => (
                  <li key={index} className="flex items-start text-charcoal">
                    <Check className="h-5 w-5 text-saffron mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-mono text-ink uppercase">Quantity:</span>
                <div className="flex items-center border-3 border-ink rounded-lg bg-stone">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-ink font-mono font-bold text-lg">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button 
                  className="flex-1 shadow-brutal bg-green-600 hover:bg-green-700" 
                  size="lg" 
                  onClick={async () => {
                    // Track WhatsApp inquiry
                    if (appState.user) {
                      try {
                        const token = localStorage.getItem('authToken');
                        console.log('Tracking WhatsApp inquiry, user:', appState.user.email, 'product:', product.id, 'token:', token ? 'exists' : 'missing');
                        if (token) {
                          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/wishlist/track-whatsapp`, {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ productId: product.id })
                          });
                          const data = await response.json();
                          console.log('WhatsApp tracking response:', data);
                        }
                      } catch (error) {
                        console.error('Error tracking WhatsApp inquiry:', error);
                      }
                    }
                    
                    const productUrl = `${window.location.origin}/product/${product.id}`;
                    const message = `Hi, I'm interested in this product:\n\n*${product.name}*\nCategory: ${product.category}\n\nView Product: ${productUrl}\n\nCould you please provide pricing and availability?\n\nThank you!`;
                    const whatsappUrl = `https://wa.me/9779820229166?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  disabled={!inStock}
                >
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  WhatsApp Inquiry
                </Button>
                <Button
                  variant={isFavorite ? 'default' : 'outline'}
                  size="lg"
                  className="shadow-brutal"
                  onClick={toggleWishlist}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-terracotta text-terracotta' : ''}`} />
                </Button>
              </div>

              <Button 
                variant="outline" 
                size="lg" 
                className="w-full shadow-brutal bg-blue-600 hover:bg-blue-700 text-white" 
                onClick={async () => {
                  // Prompt for email if not logged in or user doesn't have email
                  const userEmail = appState.user?.email || prompt('Please enter your email address:');
                  
                  if (!userEmail || !userEmail.includes('@')) {
                    alert('Please provide a valid email address.');
                    return;
                  }
                  
                  setIsSendingEmail(true);
                  try {
                    const productUrl = `${window.location.origin}/product/${product.id}`;
                    const imageUrl = images[0].startsWith('http') ? images[0] : `${window.location.origin}${images[0]}`;
                    
                    await sendProductInquiryEmail({
                      name: product.name,
                      category: product.category || 'General',
                      productUrl,
                      imageUrl,
                      customerEmail: userEmail,
                      customerName: appState.user?.firstName ? `${appState.user.firstName} ${appState.user.lastName}` : '',
                      userId: appState.user?._id,
                      productId: product.id,
                    });
                    
                    alert('✅ Inquiry sent successfully! Check your email for confirmation. We will get back to you soon!');
                  } catch (error) {
                    console.error('Failed to send email:', error);
                    alert('❌ Failed to send inquiry email. Please try WhatsApp or contact us directly.');
                  } finally {
                    setIsSendingEmail(false);
                  }
                }}
                disabled={!inStock || isSendingEmail}
              >
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {isSendingEmail ? 'Sending...' : 'Email Inquiry'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <Card className="border-3 border-ink shadow-brutal-sm">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <Truck className="h-6 w-6 text-indigo mb-2" />
                  <p className="text-xs font-mono font-bold text-ink">Free Shipping</p>
                  <p className="text-xs text-charcoal">On orders over $100</p>
                </CardContent>
              </Card>
              <Card className="border-3 border-ink shadow-brutal-sm">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <Shield className="h-6 w-6 text-indigo mb-2" />
                  <p className="text-xs font-mono font-bold text-ink">Secure Payment</p>
                  <p className="text-xs text-charcoal">100% protected</p>
                </CardContent>
              </Card>
              <Card className="border-3 border-ink shadow-brutal-sm">
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <RotateCcw className="h-6 w-6 text-indigo mb-2" />
                  <p className="text-xs font-mono font-bold text-ink">Easy Returns</p>
                  <p className="text-xs text-charcoal">30-day guarantee</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-20">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b-3 border-ink rounded-none h-auto p-0 bg-transparent">
              <TabsTrigger value="details" className="rounded-none border-b-3 border-transparent data-[state=active]:border-terracotta font-mono uppercase tracking-widest">
                Product Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none border-b-3 border-transparent data-[state=active]:border-terracotta font-mono uppercase tracking-widest">
                Reviews ({product.reviews})
              </TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none border-b-3 border-transparent data-[state=active]:border-terracotta font-mono uppercase tracking-widest">
                Shipping Info
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-mono font-bold text-ink mb-4 uppercase tracking-widest">About This Product</h3>
                <p className="text-charcoal mb-4">
                  This exquisite Buddha statue is a testament to the rich cultural heritage and exceptional craftsmanship of Nepal. 
                  Each piece is meticulously handcrafted by skilled artisans who have inherited their craft through generations, 
                  ensuring that every statue carries the authentic spirit of Himalayan artistry.
                </p>
                <p className="text-charcoal mb-4">
                  The statue is made from high-quality bronze and features intricate gold plating that highlights the fine details 
                  of the Buddha's serene expression and traditional robes. The crafting process takes several weeks, involving 
                  traditional lost-wax casting techniques that have been perfected over centuries.
                </p>
                <h4 className="text-base font-mono font-bold text-ink mb-2 uppercase tracking-widest">Care Instructions</h4>
                <ul className="list-disc list-inside text-charcoal space-y-1">
                  <li>Dust regularly with a soft, dry cloth</li>
                  <li>Avoid exposure to direct sunlight for extended periods</li>
                  <li>Keep away from moisture and humidity</li>
                  <li>Do not use chemical cleaners</li>
                  <li>Handle with care to preserve the gold plating</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-mono font-bold text-ink">Customer Reviews</h3>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? 'fill-saffron text-saffron'
                                : 'text-stone'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-mono text-charcoal">
                        {product.rating} out of 5 based on {product.reviews} reviews
                      </span>
                    </div>
                  </div>
                  <Button className="shadow-brutal font-mono uppercase tracking-widest">Write a Review</Button>
                </div>
                <Separator />
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id} className="border-3 border-ink shadow-brutal-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-mono font-bold text-ink">{review.author}</p>
                            <p className="text-xs font-mono text-charcoal">{review.date}</p>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-saffron text-saffron'
                                    : 'text-stone'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-charcoal font-display italic">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping" className="mt-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-mono font-bold text-ink mb-4 uppercase tracking-widest">Shipping Information</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-mono font-bold text-ink mb-2 uppercase tracking-widest">Delivery Times</h4>
                    <ul className="list-disc list-inside text-charcoal space-y-1">
                      <li>Standard Shipping: 5-7 business days</li>
                      <li>Express Shipping: 2-3 business days</li>
                      <li>International Shipping: 10-15 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-base font-mono font-bold text-ink mb-2 uppercase tracking-widest">Shipping Costs</h4>
                    <ul className="list-disc list-inside text-charcoal space-y-1">
                      <li>Free standard shipping on orders over $100</li>
                      <li>Standard shipping: $9.99</li>
                      <li>Express shipping: $19.99</li>
                      <li>International rates vary by location</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-base font-mono font-bold text-ink mb-2 uppercase tracking-widest">Return Policy</h4>
                    <p className="text-charcoal">
                      We offer a 30-day return policy for all products. Items must be returned in their original 
                      condition with all packaging materials. Please contact our customer service team to initiate 
                      a return. Return shipping costs are the responsibility of the customer unless the item is 
                      defective or damaged.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-display font-bold text-ink mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Card key={item.id} className="group cursor-pointer hover:shadow-brutal-lg transition-shadow border-3 border-ink">
                <CardContent className="p-0">
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-mono font-bold text-ink mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-mono font-bold text-terracotta">${item.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-saffron text-saffron" />
                        <span className="ml-1 text-sm font-mono text-charcoal">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;
