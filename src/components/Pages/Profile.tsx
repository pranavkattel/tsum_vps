import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Profile() {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    street: state.user?.address?.street || '',
    city: state.user?.address?.city || '',
    state: state.user?.address?.state || '',
    postalCode: state.user?.address?.postalCode || '',
    country: state.user?.address?.country || 'Nepal',
  });

  if (!state.isAuthenticated) {
    return (
      <div className="min-h-screen bg-rice py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg border-4 border-ink shadow-brutal p-8 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-terracotta" />
            <h2 className="text-2xl font-display font-bold text-ink mb-4">
              Sign in to View Profile
            </h2>
            <p className="text-charcoal mb-6">
              Please sign in to your account to view and edit your profile.
            </p>
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="btn-primary"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    // TODO: Add API call to update user profile
    // For now, just update local state
    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...state.user!,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        },
        token: state.token || '',
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: state.user?.firstName || '',
      lastName: state.user?.lastName || '',
      email: state.user?.email || '',
      phone: state.user?.phone || '',
      street: state.user?.address?.street || '',
      city: state.user?.address?.city || '',
      state: state.user?.address?.state || '',
      postalCode: state.user?.address?.postalCode || '',
      country: state.user?.address?.country || 'Nepal',
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-rice py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-ink mb-2 uppercase tracking-wider">
            My Profile
          </h1>
          <p className="text-charcoal font-mono text-sm">
            Manage your account information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border-4 border-ink shadow-brutal">
          {/* Profile Header */}
          <div className="bg-saffron border-b-4 border-ink p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-ink text-rice flex items-center justify-center rounded-full border-4 border-ink">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-ink">
                    {state.user?.firstName} {state.user?.lastName}
                  </h2>
                  <p className="text-charcoal font-mono text-sm">
                    Member since {new Date(state.user?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-ink text-rice px-4 py-2 font-mono text-sm font-bold hover:bg-terracotta transition-colors border-3 border-ink"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 font-mono text-sm font-bold hover:bg-green-700 transition-colors border-3 border-ink"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 font-mono text-sm font-bold hover:bg-red-700 transition-colors border-3 border-ink"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-6">
            {/* First Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-mono font-bold text-ink mb-2">
                <User className="h-4 w-4" />
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                />
              ) : (
                <p className="text-charcoal font-mono text-lg">{state.user?.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-mono font-bold text-ink mb-2">
                <User className="h-4 w-4" />
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                />
              ) : (
                <p className="text-charcoal font-mono text-lg">{state.user?.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-mono font-bold text-ink mb-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                />
              ) : (
                <p className="text-charcoal font-mono text-lg">{state.user?.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-mono font-bold text-ink mb-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                />
              ) : (
                <p className="text-charcoal font-mono text-lg">
                  {state.user?.phone || 'Not provided'}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-mono font-bold text-ink mb-2">
                <MapPin className="h-4 w-4" />
                Address
              </label>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Street address"
                    className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    />
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State/Province"
                      className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="Postal Code"
                      className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    />
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Country"
                      className="w-full px-4 py-3 border-3 border-ink font-mono text-sm focus:outline-none focus:shadow-brutal-sm"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-charcoal font-mono text-lg">
                  {state.user?.address?.street ? (
                    <>
                      {state.user.address.street}<br />
                      {state.user.address.city}, {state.user.address.state} {state.user.address.postalCode}<br />
                      {state.user.address.country}
                    </>
                  ) : (
                    'Not provided'
                  )}
                </p>
              )}
            </div>

            {/* Account Info */}
            <div className="border-t-3 border-ink pt-6">
              <h3 className="text-lg font-display font-bold text-ink mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-saffron/20 border-3 border-ink p-4">
                  <p className="text-xs font-mono font-bold text-ink mb-1">Account Type</p>
                  <p className="text-lg font-display font-bold text-terracotta uppercase">
                    {state.user?.role === 'admin' ? 'Administrator' : 'Customer'}
                  </p>
                </div>
                <div className="bg-indigo/20 border-3 border-ink p-4">
                  <p className="text-xs font-mono font-bold text-ink mb-1">Favorites</p>
                  <p className="text-lg font-display font-bold text-indigo">
                    {state.wishlist.length} items
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Link */}
        {state.user?.role === 'admin' && (
          <div className="mt-6 bg-white border-4 border-ink shadow-brutal p-6 text-center">
            <p className="text-charcoal mb-4">You have administrator access</p>
            <button
              onClick={() => window.location.href = '/admin'}
              className="bg-terracotta text-rice px-6 py-3 font-mono font-bold hover:bg-terracotta-dark transition-colors border-3 border-ink"
            >
              Go to Admin Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
