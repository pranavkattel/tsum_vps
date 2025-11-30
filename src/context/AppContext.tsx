import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Product, CartItem, User, Order } from '../types';
import wishlistService from '../services/wishlistService';

interface AppState {
  cart: CartItem[];
  user: User | null;
  wishlist: string[];
  orders: Order[];
  isAuthenticated: boolean;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  token: string | null;
}

type AppAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_WISHLIST'; payload: string[] }
  | { type: 'LOGIN'; payload: { user: User; token: string } }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'CLEAR_SEARCH_QUERY' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  cart: [],
  user: null,
  wishlist: [],
  orders: [],
  isAuthenticated: false,
  searchQuery: '',
  loading: false,
  error: null,
  token: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.productId === action.payload.product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.productId === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { productId: action.payload.product.id, quantity: action.payload.quantity, product: action.payload.product }],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.productId !== action.payload),
      };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.productId === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };

    case 'ADD_TO_WISHLIST':
      if (!state.wishlist.includes(action.payload)) {
        return {
          ...state,
          wishlist: [...state.wishlist, action.payload],
        };
      }
      return state;

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(id => id !== action.payload),
      };

    case 'SET_WISHLIST':
      return {
        ...state,
        wishlist: action.payload,
      };

    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case 'LOGOUT':
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        cart: [],
        wishlist: [],
        error: null,
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'CLEAR_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: '',
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check for existing auth token on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN', payload: { user, token } });
        
        // Fetch wishlist from backend
        wishlistService.getWishlist(token)
          .then(wishlist => {
            dispatch({ type: 'SET_WISHLIST', payload: wishlist });
          })
          .catch(err => {
            console.error('Error loading wishlist:', err);
          });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  // When user info is set, fetch persisted cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return; // ignore if not available
        const json = await res.json();
        if (json && json.success && Array.isArray(json.data)) {
          dispatch({ type: 'SET_CART', payload: json.data });
        }
      } catch (err) {
        console.error('Fetch cart error', err);
      }
    };

    if (state.isAuthenticated && state.user) {
      fetchCart();
    }
  }, [state.isAuthenticated, state.user]);

  // Persist cart to backend when user is authenticated
  useEffect(() => {
    let timer: any = null;
    const persistCart = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ cart: state.cart })
        });
        // ignore response body for now; errors will be logged
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error('Persist cart failed', err.message || res.statusText);
        }
      } catch (err: any) {
        console.error('Persist cart error', err.message || err);
      }
    };

    // only persist if user is logged in
    if (state.isAuthenticated && state.user) {
      // debounce to avoid frequent network calls
      timer = setTimeout(persistCart, 500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [state.cart, state.isAuthenticated, state.user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  // Helper function to add to wishlist with backend sync
  const addToWishlist = async (productId: string) => {
    context.dispatch({ type: 'ADD_TO_WISHLIST', payload: productId });
    
    if (context.state.token) {
      try {
        await wishlistService.addToWishlist(productId, context.state.token);
      } catch (error) {
        console.error('Failed to sync wishlist to backend:', error);
        // Optionally revert the optimistic update
        context.dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
      }
    }
  };

  // Helper function to remove from wishlist with backend sync
  const removeFromWishlist = async (productId: string) => {
    context.dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
    
    if (context.state.token) {
      try {
        await wishlistService.removeFromWishlist(productId, context.state.token);
      } catch (error) {
        console.error('Failed to sync wishlist removal to backend:', error);
        // Optionally revert the optimistic update
        context.dispatch({ type: 'ADD_TO_WISHLIST', payload: productId });
      }
    }
  };

  // Helper function to track WhatsApp inquiry
  const trackWhatsAppInquiry = async () => {
    if (context.state.token) {
      await wishlistService.trackWhatsAppInquiry(context.state.token);
    }
  };

  return { ...context, addToWishlist, removeFromWishlist, trackWhatsAppInquiry };
}

export const useAppContext = useApp;