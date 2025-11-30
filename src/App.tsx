import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/ScrollToTop';
// import HeroSection from './components/Home/HeroSection';
import StatsSection from './components/Home/StatsSection';
import FeaturesSection from './components/Home/FeaturesSection';
import ArtisanSpotlight from './components/Home/ArtisanSpotlight';
import ParallaxProductShowcase from './components/Home/ParallaxProductShowcase';
import Shop from './components/Shop/Shop';
import ProductDetail from './components/Product/ProductDetail';
import ProductDetailPage from './components/Product/ProductDetailPage';
import Wishlist from './components/Pages/Wishlist';
import UserDashboard from './components/User/UserDashboard';
import AdminDashboard from './components/Admin/AdminDashboard';
import AddProductPage from './pages/Admin/AddProduct';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import About from './components/Pages/About';
import Contact from './components/Pages/Contact';
import NepalGallery from './components/Pages/NepalGallery';
import Profile from './components/Pages/Profile';
import { Product } from './types';
import { useProducts, useArtisans } from './hooks/useProducts';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  // Use real data from hooks with error handling
  const { products = [], loading: productsLoading, error: productsError } = useProducts({ limit: 1000 }); // Load all products
  const { artisans = [], loading: artisansLoading, error: artisansError } = useArtisans();

  // Check for errors and display them
  const hasErrors = productsError || artisansError;

  if (hasErrors) {
    return (
      <div className="min-h-screen bg-rice flex items-center justify-center">
        <div className="text-center p-10 bg-white border-4 border-ink shadow-brutal max-w-md mx-auto">
          <h2 className="text-3xl font-display font-bold text-terracotta mb-4">Error Loading Data</h2>
          <div className="text-left space-y-2 mb-6 p-4 bg-saffron/20 border-3 border-ink">
            {productsError && <p className="text-sm font-mono text-ink">Products: {productsError}</p>}
            {artisansError && <p className="text-sm font-mono text-ink">Artisans: {artisansError}</p>}
          </div>
          <p className="text-charcoal mb-6 font-display italic">Don't worry, this is likely just a loading issue.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
    // push a product-specific path so the page is bookmarkable and shareable
    navigate(`/product/${product.id}`);
  };

  const handleArtisanClick = () => {
    console.log('Artisan clicked');
  };

  const renderPage = () => {
    if (productsLoading || artisansLoading) {
      return (
        <div className="min-h-screen bg-rice flex items-center justify-center">
          <div className="text-center fade-in p-10 bg-white border-4 border-ink shadow-brutal">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-ink border-t-terracotta animate-spin"></div>
              <div className="absolute inset-2 border-4 border-saffron opacity-50"></div>
            </div>
            <p className="text-xl font-display font-bold text-ink mb-4">Loading your content...</p>
            <div className="text-xs font-mono text-charcoal space-y-2 uppercase">
              <p>Products: {productsLoading ? '⏳ Loading...' : '✅ Ready'}</p>
              <p>Artisans: {artisansLoading ? '⏳ Loading...' : '✅ Ready'}</p>
            </div>
          </div>
        </div>
      );
    }

    try {
      switch (currentPage) {
        case 'home':
          return (
            <>
              <ParallaxProductShowcase 
                products={products}
                onProductClick={handleProductClick}
              />
              <StatsSection />
              <FeaturesSection />
              <ArtisanSpotlight 
                artisans={artisans}
                onArtisanClick={handleArtisanClick}
              />
            </>
          );
        
        case 'shop':
          return (
            <Shop 
              onProductClick={handleProductClick}
            />
          );
        
        case 'product-detail':
          // Show loading state while products are being fetched
          if (productsLoading) {
            return (
              <div className="min-h-screen bg-rice flex items-center justify-center">
                <div className="text-center fade-in p-10 bg-white border-4 border-ink shadow-brutal">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-ink border-t-terracotta animate-spin"></div>
                  </div>
                  <p className="text-xl font-display font-bold text-ink">Loading product...</p>
                </div>
              </div>
            );
          }
          
          return selectedProduct ? (
            <ProductDetailPage product={selectedProduct} allProducts={products} />
          ) : (
            <div className="min-h-screen bg-rice flex items-center justify-center">
              <div className="text-center p-10 bg-white border-4 border-ink shadow-brutal max-w-md mx-auto">
                <h2 className="text-3xl font-display font-bold text-terracotta mb-4">Product not found</h2>
                <p className="text-charcoal mb-6">The product you're looking for doesn't exist or has been removed.</p>
                <button 
                  onClick={() => { setCurrentPage('shop'); navigate('/shop'); }}
                  className="btn-primary"
                >
                  Back to Shop
                </button>
              </div>
            </div>
          );
        
        case 'wishlist':
          return <Wishlist onProductClick={handleProductClick} />;
        
        case 'dashboard':
          return <UserDashboard />;
        
        case 'admin':
          return <AdminDashboard />;
        case 'admin-add':
          return <AddProductPage />;
        
        case 'login':
          return <Login />;
        case 'register':
          return <Register />;
        
        case 'about':
          return <About />;
        
        case 'contact':
          return <Contact />;
        
        case 'profile':
          return <Profile />;
        
        case 'artisans':
          return <NepalGallery />;
        
        case 'blog':
          return (
            <div className="min-h-screen bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Blog</h1>
                  <p className="text-lg text-gray-600">Stories, traditions, and insights from the world of Nepali crafts</p>
                </div>
                <div className="text-center py-12">
                  <p className="text-gray-600">Blog coming soon...</p>
                </div>
              </div>
            </div>
          );
        
        default:
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Page not found</h2>
                <button 
                  onClick={() => setCurrentPage('home')}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Go Home
                </button>
              </div>
            </div>
          );
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-4">There was an error loading this page.</p>
            <button 
              onClick={() => setCurrentPage('home')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }
  };

  // Router integration: map pathname <-> internal page state
  const location = useLocation();
  const navigate = useNavigate();

  const pageForPath = (path: string) => {
    if (path === '/' || path === '') return 'home';
    if (path.startsWith('/shop')) return 'shop';
    if (path.startsWith('/product')) return 'product-detail';
    if (path.startsWith('/wishlist')) return 'wishlist';
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/admin/add')) return 'admin-add';
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/auth/login')) return 'login';
  if (path.startsWith('/auth/register')) return 'register';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/contact')) return 'contact';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/artisans')) return 'artisans';
    if (path.startsWith('/blog')) return 'blog';
    if (path.startsWith('/wishlist')) return 'wishlist';
    return 'home';
  };

  useEffect(() => {
    const mapped = pageForPath(location.pathname);
    setCurrentPage(mapped);

    // If the path is a product detail path like /product/:id, resolve & set the selected product
    if (mapped === 'product-detail') {
      const m = location.pathname.match(/^\/product\/(.+)$/);
      if (m && m[1]) {
        const id = m[1];
        console.log('Looking for product with ID:', id);
        console.log('Products loaded:', products?.length);
        
        // Wait for products to load, then find the product
        if (products && products.length > 0) {
          const found = products.find(p => {
            console.log('Comparing:', String(p.id), 'with', String(id));
            return String(p.id) === String(id);
          });
          console.log('Found product:', found);
          
          if (found) {
            setSelectedProduct(found);
          } else if (!productsLoading) {
            // Only set to null if products are done loading and still not found
            console.log('Product not found and products finished loading');
            setSelectedProduct(null);
          }
        }
      }
    }
  }, [location.pathname, products, productsLoading]);

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
    // push a corresponding path for navigable pages
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'shop':
        navigate('/shop');
        break;
      case 'wishlist':
        navigate('/wishlist');
        break;
      case 'login':
        navigate('/auth/login');
        break;
      case 'register':
        navigate('/auth/register');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'artisans':
        navigate('/artisans');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'admin':
        navigate('/admin');
        break;
      case 'admin-add':
        navigate('/admin/add');
        break;
      default:
        // no-op for pages like product-detail which need more context
        break;
    }
  };

  return (
    <AppProvider>
      <ScrollToTop />
      <div className="min-h-screen bg-rice font-display">
        <Header onPageChange={handlePageChange} currentPage={currentPage} />
        <main>
          {renderPage()}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;