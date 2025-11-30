import { useState, useEffect } from 'react';
import { Search, Heart, User, Menu, X, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import authService from '../../services/authService';

interface HeaderProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

export default function Header({ onPageChange, currentPage }: HeaderProps) {
  const { state, dispatch } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(state.searchQuery || '');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Sync local search input with global search state
  useEffect(() => {
    setSearchQuery(state.searchQuery || '');
  }, [state.searchQuery]);

  const wishlistCount = state.wishlist.length;

  const handleLogout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    setShowUserMenu(false);
    onPageChange('home');
  };

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Collection', id: 'shop' },
    { name: 'Nepal Gallery', id: 'artisans' },
    { name: 'About', id: 'about' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <header className="bg-rice sticky top-0 z-50 border-b-4 border-ink shadow-brutal-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo - Bold & Distinctive */}
          <div className="flex-shrink-0 cursor-pointer group" onClick={() => onPageChange('home')}>
            <div className="relative">
              <div className="absolute inset-0 bg-terracotta transform group-hover:translate-x-1 group-hover:translate-y-1 transition-transform"></div>
              <h1 className="relative text-5xl font-display font-bold text-ink bg-saffron px-4 py-1 border-3 border-ink">
                T
              </h1>
            </div>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`relative px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all ${
                  currentPage === item.id
                    ? 'text-rice bg-ink'
                    : 'text-ink hover:bg-saffron hover:text-ink'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden lg:flex relative">
              <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery.trim() });
                    onPageChange('shop');
                  }
                }}
                className="w-52 px-3 py-2 border-3 border-ink font-mono text-xs focus:outline-none focus:shadow-brutal-sm transition-all"
              />
              <button
                aria-label="Search"
                onClick={() => {
                  dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery.trim() });
                  onPageChange('shop');
                }}
                className="absolute right-0 top-0 h-full px-3 bg-terracotta text-rice border-3 border-ink border-l-0 hover:bg-terracotta-dark transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>

            {/* Action Icons */}
            <button
              onClick={() => onPageChange('wishlist')}
              className="p-3 text-ink hover:bg-saffron transition-colors relative border-3 border-ink bg-white hover:shadow-brutal-sm"
              aria-label="Favorites"
            >
              <Heart className={`h-5 w-5 ${wishlistCount > 0 ? 'fill-terracotta text-terracotta' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-terracotta text-rice text-xs h-6 w-6 flex items-center justify-center font-mono font-bold border-2 border-ink">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Authentication */}
            {state.isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-3 text-ink hover:bg-indigo hover:text-rice transition-colors border-3 border-ink bg-white"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block text-xs font-mono font-bold uppercase">
                    {state.user?.firstName}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-rice border-4 border-ink shadow-brutal z-50">
                    <div className="px-4 py-3 border-b-3 border-ink bg-saffron">
                      <p className="text-sm font-mono font-bold text-ink uppercase">
                        {state.user?.firstName} {state.user?.lastName}
                      </p>
                      <p className="text-xs text-charcoal font-mono">{state.user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onPageChange('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-mono text-ink hover:bg-saffron transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        onPageChange('orders');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm font-mono text-ink hover:bg-saffron transition-colors"
                    >
                      Orders
                    </button>
                    <div className="border-t-3 border-ink"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-mono font-bold text-terracotta hover:bg-terracotta hover:text-rice transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>SIGN OUT</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/auth/login"
                  className="text-xs font-mono font-bold text-ink hover:bg-saffron transition-colors px-4 py-2 border-3 border-ink bg-white uppercase"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth/register"
                  className="text-xs font-mono font-bold bg-terracotta hover:bg-terracotta-dark text-rice px-4 py-2 border-3 border-ink transition-colors uppercase shadow-brutal-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-ink hover:bg-saffron transition-colors border-3 border-ink bg-white"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t-4 border-ink bg-rice">
            <div className="px-4 py-4 space-y-2">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery.trim() });
                      onPageChange('shop');
                      setIsMenuOpen(false);
                    }
                  }}
                  className="w-full px-3 py-2 border-3 border-ink font-mono text-xs focus:outline-none focus:shadow-brutal-sm"
                />
                <button
                  aria-label="Search"
                  onClick={() => {
                    dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery.trim() });
                    onPageChange('shop');
                    setIsMenuOpen(false);
                  }}
                  className="absolute right-0 top-0 h-full px-3 bg-terracotta text-rice border-3 border-ink border-l-0"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
              
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors border-3 border-ink ${
                    currentPage === item.id
                      ? 'text-rice bg-ink'
                      : 'text-ink bg-white hover:bg-saffron'
                  }`}
                >
                  {item.name}
                </button>
              ))}

              {/* Mobile Action Icons */}
              <div className="flex gap-3 pt-4 border-t-3 border-ink mt-4">
                <button
                  onClick={() => {
                    onPageChange('wishlist');
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 p-4 text-ink bg-white hover:bg-saffron transition-colors relative border-3 border-ink"
                >
                  <Heart className={`h-6 w-6 mx-auto ${wishlistCount > 0 ? 'fill-terracotta text-terracotta' : ''}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-2 right-2 bg-terracotta text-rice text-xs h-6 w-6 flex items-center justify-center font-mono font-bold border-2 border-ink">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onPageChange('login');
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 p-4 text-ink bg-white hover:bg-saffron transition-colors border-3 border-ink"
                >
                  <User className="h-6 w-6 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}