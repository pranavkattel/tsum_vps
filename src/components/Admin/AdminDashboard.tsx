import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Users, TrendingUp, Search, Edit, Trash2, Plus, ShoppingBag, MessageCircle, Mail } from 'lucide-react';
import authService from '../../services/authService';
import ProductEditModal from './ProductEditModal';

type DashboardData = {
  totalInquiries: number;
  totalWhatsApp: number;
  totalEmail: number;
  totalProducts: number;
  topProducts: Array<any>;
  recentInquiries: Array<any>;
  totalUsers?: number;
  activeUsers?: number;
};

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [showEdit, setShowEdit] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [users, setUsers] = useState<any[]>([]);
  const perPage = 12;
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = authService.getToken();
      if (!token) {
        // No admin token — show friendly message and short-circuit dashboard admin-only data
        setError('Access denied. Please login as an admin to see dashboard data.');
        setData({ totalInquiries: 0, totalWhatsApp: 0, totalEmail: 0, totalProducts: 0, topProducts: [], recentInquiries: [], totalUsers: 0, activeUsers: 0 });
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      console.log('Dashboard response:', json);
      if (!res.ok) throw new Error(json.message || 'Error fetching dashboard');
      console.log('Dashboard data:', json.data);
      setData(json.data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = authService.getToken();
      const base = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}`;
      let res;
      if (token) {
        // try admin products endpoint first
        res = await fetch(`${base}/admin/products`, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        // fallback to public products listing
        res = await fetch(`${base}/products?page=1&limit=200`);
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Error fetching products');
      // Accept several shapes (admin may return { data } while public returns { data, pagination })
      setProducts(json.data || json.products || json || []);
    } catch (err: any) {
      console.error('Fetch products error', err.message);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);
  useEffect(() => { fetchProducts(); }, []);

  const fetchUsers = async () => {
    try {
      const token = authService.getToken();
      console.log('Fetching users with token:', token ? 'Token exists' : 'No token');
      if (!token) {
        console.log('No auth token found');
        return;
      }
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/admin/users`;
      console.log('Fetching from:', url);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Response status:', res.status);
      const json = await res.json();
      console.log('Response data:', json);
      if (!res.ok) throw new Error(json.message || 'Error fetching users');
      setUsers(json.data || []);
      console.log('Users loaded:', json.data?.length);
    } catch (err: any) {
      console.error('Fetch users error:', err.message);
      console.error('Full error:', err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filtered = products.filter(p => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (p.name && p.name.toLowerCase().includes(s)) || String(p.id).toLowerCase().includes(s) || (p.category && p.category.toLowerCase().includes(s));
  });

  function getDisplayImage(raw: string | undefined) {
    if (!raw) return 'https://via.placeholder.com/300x300?text=No+Image';
    // Images are in public folder, served at root: /IMG-*.jpg
    console.log('Loading image:', raw);
    return raw;
  }

  // Inline component: try product images (from DB) sequentially before falling back
  const ProductImage: React.FC<{ images: any[]; alt?: string; className?: string }> = ({ images, alt, className }) => {
    const [index, setIndex] = useState(0);
    const [src, setSrc] = useState<string>(() => getDisplayImage(images && images[0] ? images[0] : undefined));

    useEffect(() => {
      // reset when images prop changes
      setIndex(0);
      setSrc(getDisplayImage(images && images[0] ? images[0] : undefined));
    }, [images]);

    function tryNext() {
      if (!images || images.length === 0) {
        setSrc('https://via.placeholder.com/300x300?text=No+Image');
        return;
      }
      // find the next available image that isn't the current src
      let next = index + 1;
      if (next >= images.length) {
        setSrc('https://via.placeholder.com/300x300?text=No+Image');
        return;
      }
      setIndex(next);
      setSrc(getDisplayImage(images[next]));
    }

    // when user clicks a thumbnail, show that image
    function showAt(i: number) {
      if (!images || i < 0 || i >= images.length) return;
      setIndex(i);
      setSrc(getDisplayImage(images[i]));
    }

    // If there are multiple images, render a main image plus clickable thumbnails
    if (images && images.length > 1) {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 w-full h-full overflow-hidden rounded bg-gray-100 flex items-center justify-center">
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <img
              src={src}
              alt={alt}
              className={`${className || ''} object-cover w-full h-full`}
              onError={() => { tryNext(); }}
            />
          </div>
          <div className="mt-2 flex gap-2 justify-center">
            {images.map((im, i) => (
              <button key={i} onClick={() => showAt(i)} className={`rounded overflow-hidden border ${i === index ? 'ring-2 ring-amber-400' : ''}`}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <img src={getDisplayImage(im)} alt={`${alt || ''} ${i + 1}`} className="w-16 h-12 object-cover block" onError={(e:any)=>{ /* let main handle errors */ }} />
              </button>
            ))}
          </div>
        </div>
      );
    }

    // single image case
    return (
      // eslint-disable-next-line jsx-a11y/alt-text
      <img
        src={src}
        alt={alt}
        className={className}
        onError={(e: any) => {
          // try next DB-provided image, else placeholder
          tryNext();
        }}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your store, products, and orders</p>
            </div>
            <button
              onClick={() => navigate('/admin/add')}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              Users
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-sm opacity-90 mb-1">Total Inquiries</div>
                <div className="text-3xl font-bold">{data ? data.totalInquiries : '—'}</div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-sm opacity-90 mb-1">WhatsApp Inquiries</div>
                <div className="text-3xl font-bold">{data ? data.totalWhatsApp : '—'}</div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Mail className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-sm opacity-90 mb-1">Email Inquiries</div>
                <div className="text-3xl font-bold">{data ? data.totalEmail : '—'}</div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 opacity-60" />
                </div>
                <div className="text-sm opacity-90 mb-1">Total Users</div>
                <div className="text-3xl font-bold">{data ? data.totalUsers : '—'}</div>
              </div>
            </div>

            {/* Recent Inquiries & Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Inquiries */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-amber-500" />
                  Recent Inquiries
                </h2>
                {loading && <div className="text-center py-8 text-gray-500">Loading inquiries...</div>}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                    {error}
                    {error.toLowerCase().includes('access denied') && (
                      <div className="mt-3">
                        <button onClick={() => navigate('/login')} className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                          Login as Admin
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {!loading && data && data.recentInquiries && data.recentInquiries.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.recentInquiries.map((inquiry: any) => {
                      const whatsappDate = inquiry.inquiries?.whatsapp?.lastInquiry 
                        ? new Date(inquiry.inquiries.whatsapp.lastInquiry) 
                        : null;
                      const emailDate = inquiry.inquiries?.email?.lastInquiry 
                        ? new Date(inquiry.inquiries.email.lastInquiry) 
                        : null;
                      const latestDate = whatsappDate && emailDate 
                        ? (whatsappDate > emailDate ? whatsappDate : emailDate)
                        : (whatsappDate || emailDate);
                      
                      const whatsappCount = inquiry.inquiries?.whatsapp?.count || 0;
                      const emailCount = inquiry.inquiries?.email?.count || 0;
                      const totalCount = whatsappCount + emailCount;

                      return (
                        <div key={inquiry._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {inquiry.firstName} {inquiry.lastName}
                            </div>
                            <div className="text-sm text-gray-600">{inquiry.email}</div>
                            <div className="flex items-center gap-3 mt-1">
                              {whatsappCount > 0 && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                  <MessageCircle className="w-3 h-3 inline mr-1" />
                                  {whatsappCount} WhatsApp
                                </span>
                              )}
                              {emailCount > 0 && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  <Mail className="w-3 h-3 inline mr-1" />
                                  {emailCount} Email
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{totalCount} total</div>
                            {latestDate && (
                              <div className="text-xs text-gray-500">
                                {latestDate.toLocaleDateString()} {latestDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : !loading && <div className="text-center py-8 text-gray-500">No inquiries yet</div>}
              </div>

              {/* Top Products */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  Top Products by Inquiry
                </h2>
                {data && data.topProducts && data.topProducts.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {data.topProducts.slice(0, 10).map((tp: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          {tp.images && tp.images[0] ? (
                            <img src={tp.images[0]} alt={tp.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No img</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{tp.name || 'Unknown'}</div>
                          <div className="flex items-center gap-2 mt-1">
                            {tp.whatsappCount > 0 && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                <MessageCircle className="w-3 h-3 inline mr-1" />
                                {tp.whatsappCount}
                              </span>
                            )}
                            {tp.emailCount > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                <Mail className="w-3 h-3 inline mr-1" />
                                {tp.emailCount}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 font-bold">{tp.inquiryCount || 0} total inquiries</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="text-center py-8 text-gray-500">No inquiry data yet</div>}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Manage Products</h2>
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                Total: <span className="font-bold">{products.length}</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search products by name, ID, or category..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.slice((page - 1) * perPage, page * perPage).map(p => (
                <div key={p._id || p.id} className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-200 hover:border-amber-500">
                  <div className="h-48 w-full bg-gray-100 overflow-hidden">
                    {p.images && p.images.length > 0 ? (
                      <ProductImage images={p.images} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1 truncate">{p.name}</h3>
                    <div className="text-xs text-gray-500 mb-2 truncate">{p.category}</div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-lg font-bold text-amber-600">₨ {p.price}</div>
                      <div className="text-sm text-gray-600">
                        Stock: <span className={`font-bold ${p.stock > 10 ? 'text-green-600' : p.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {p.stock}
                        </span>
                      </div>
                    </div>
                    {p.images && p.images.length > 1 && (
                      <div className="text-xs text-gray-500 mb-3 flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        {p.images.length} photos
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowEdit(p)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          const token = authService.getToken();
                          if (!token) {
                            if (confirm('You must be logged in as an admin to delete products. Go to login?')) navigate('/login');
                            return;
                          }
                          if (!confirm(`Delete "${p.name}"?`)) return;
                          try {
                            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/products/${p._id || p.id}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` }
                            });
                            const json = await res.json();
                            if (!res.ok) throw new Error(json.message || 'Delete failed');
                            fetchProducts();
                          } catch (err: any) {
                            console.error(err);
                            alert(err.message || 'Delete failed');
                          }
                        }}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {filtered.length > perPage && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(filtered.length / perPage)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(filtered.length / perPage)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h2>
            {loading && <div className="text-center py-8 text-gray-500">Loading orders...</div>}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}
            {!loading && data && data.recentOrders && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Order #</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Items</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((o: any) => (
                      <tr key={o._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4 font-medium">{o.orderNumber}</td>
                        <td className="py-4 px-4">{o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Guest'}</td>
                        <td className="py-4 px-4">{o.items.length}</td>
                        <td className="py-4 px-4 font-bold text-amber-600">₨ {o.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            o.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                            o.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            o.orderStatus === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Users</h2>
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                Total: <span className="font-bold">{users.length}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">WhatsApp</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium">{user.firstName} {user.lastName}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                      <td className="py-4 px-4 text-sm text-gray-600">{user.phone || '—'}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-green-600">
                            {user.inquiries?.whatsapp?.count || 0}
                          </span>
                          {user.inquiries?.whatsapp?.lastInquiry && (
                            <span className="text-xs text-gray-500">
                              {new Date(user.inquiries.whatsapp.lastInquiry).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-blue-600">
                            {user.inquiries?.email?.count || 0}
                          </span>
                          {user.inquiries?.email?.lastInquiry && (
                            <span className="text-xs text-gray-500">
                              {new Date(user.inquiries.email.lastInquiry).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No users found</p>
              </div>
            )}
          </div>
        )}

        {showEdit && (
          <ProductEditModal
            product={showEdit}
            onClose={() => setShowEdit(null)}
            onSaved={() => { fetchProducts(); setShowEdit(null); }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
