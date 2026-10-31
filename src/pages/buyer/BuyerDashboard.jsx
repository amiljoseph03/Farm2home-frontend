import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Profile from '../../components/Profile';
import {
  ShoppingBag,
  Package,
  Store,
  User,
  LayoutDashboard,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Search,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

const BuyerDashboard = ({ initialTab = 'overview' }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  // Sync initialTab when route changes
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Cart State
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchCart();
  }, []);

  // Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await API.get('/orders/my-orders');
      setOrders(res.data?.data?.orders || res.data?.data || []);
    } catch {
      // Silently handle if user has no orders yet
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    setLoadingCart(true);
    try {
      const res = await API.get('/cart');
      const cartData = res.data?.data?.cart || res.data?.data || null;
      setCart(cartData);
    } catch {
      // Silently handle
    } finally {
      setLoadingCart(false);
    }
  };

  // Cart Quantity Update
  const updateQuantity = async (productId, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      await API.post('/cart', { productId, quantity: change });
      fetchCart();
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  // Remove Item from Cart
  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      toast.success('Item removed from cart');
      fetchCart();
    } catch {
      toast.error('Failed to remove item');
    }
  };

  // Handle Checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    const finalAddress =
      shippingAddress.trim() ||
      user?.address ||
      `${user?.city || ''} ${user?.pincode || ''}`.trim();

    if (!finalAddress) {
      toast.error('Please enter or save a delivery address in your profile');
      return;
    }

    setCheckoutLoading(true);
    try {
      await API.post('/orders', { shippingAddress: finalAddress });
      toast.success('Order placed successfully!');
      fetchCart();
      fetchOrders();
      setActiveTab('orders');
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || 'Checkout failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-red-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  const cartItems = cart?.items || [];
  const cartTotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.product?.pricePerUnit ?? item.product?.price ?? 0;
    return acc + itemPrice * item.quantity;
  }, 0);

  const filteredOrders = orders.filter((o) =>
    o._id.toLowerCase().includes(orderSearchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans antialiased">
      {/* ─── SIDEBAR (Sticky on Desktop, Icon-Only Rail Expanding on Hover) ─── */}
      <aside
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
        className={`fixed top-0 bottom-0 left-0 z-50 h-screen bg-[#071811] text-white flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out border-r border-emerald-950/80 select-none
          ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarHovered ? 'lg:w-64' : 'lg:w-20'}
        `}
      >
        {/* Brand / Logo Header */}
        <div className="h-20 flex items-center px-4 border-b border-emerald-900/60 shrink-0 overflow-hidden">
          <div className="flex items-center gap-3 w-full">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shrink-0 mx-auto lg:mx-0">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarHovered || isSidebarOpen
                  ? 'opacity-100 max-w-xs'
                  : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              <h2 className="text-lg font-black tracking-wide bg-gradient-to-r from-white via-emerald-100 to-[#A8D86E] bg-clip-text text-transparent">
                Farm2Home
              </h2>
              <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                Consumer Portal
              </p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            className="ml-auto lg:hidden text-emerald-200 hover:text-white p-1 cursor-pointer"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-none">
          <p
            className={`px-3 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 transition-all duration-300 ${
              isSidebarHovered || isSidebarOpen
                ? 'opacity-100'
                : 'opacity-0 h-0 overflow-hidden'
            }`}
          >
            Buyer Menu
          </p>

          {[
            {
              id: 'overview',
              icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
              label: 'Overview',
            },
            {
              id: 'cart',
              icon: <ShoppingCart className="w-5 h-5 shrink-0" />,
              label: 'My Cart',
              badge: cartItems.length || null,
            },
            {
              id: 'orders',
              icon: <Package className="w-5 h-5 shrink-0" />,
              label: 'My Orders',
              badge: orders.length || null,
            },
            {
              id: 'profile',
              icon: <User className="w-5 h-5 shrink-0" />,
              label: 'My Profile',
            },
          ].map(({ id, icon, label, badge }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setIsSidebarOpen(false);
                }}
                title={!isSidebarHovered && !isSidebarOpen ? label : undefined}
                className={`w-full flex items-center rounded-2xl transition-all duration-200 cursor-pointer relative ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-lg shadow-emerald-950/50 font-bold'
                    : 'text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white'
                } ${isSidebarHovered || isSidebarOpen ? 'px-4 py-3 gap-3.5 justify-start' : 'p-3 justify-center'}`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#A8D86E] rounded-r-full shadow-sm" />
                )}

                {/* Icon wrapper */}
                <div className="relative flex items-center justify-center">
                  {icon}
                  {!isSidebarHovered && !isSidebarOpen && badge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#071811]" />
                  )}
                </div>

                {/* Label & Expanded Badge */}
                <div
                  className={`flex items-center justify-between flex-1 overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    isSidebarHovered || isSidebarOpen
                      ? 'opacity-100 max-w-xs'
                      : 'opacity-0 max-w-0 pointer-events-none'
                  }`}
                >
                  <span className="text-sm font-semibold truncate">{label}</span>
                  {badge && (
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-2 shadow-sm">
                      {badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Browse Store Button */}
          <div className="pt-2">
            <button
              onClick={() => navigate('/products')}
              title={
                !isSidebarHovered && !isSidebarOpen
                  ? 'Browse Marketplace'
                  : undefined
              }
              className={`w-full flex items-center rounded-2xl transition-all duration-200 cursor-pointer relative text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white ${
                isSidebarHovered || isSidebarOpen
                  ? 'px-4 py-3 gap-3.5 justify-start'
                  : 'p-3 justify-center'
              }`}
            >
              <Store className="w-5 h-5 shrink-0 text-[#A8D86E]" />
              <span
                className={`text-sm font-semibold truncate transition-all duration-300 whitespace-nowrap ${
                  isSidebarHovered || isSidebarOpen
                    ? 'opacity-100 max-w-xs'
                    : 'opacity-0 max-w-0 pointer-events-none'
                }`}
              >
                Marketplace Store
              </span>
            </button>
          </div>

          {/* Account Section */}
          <div className="pt-4">
            <p
              className={`px-3 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 transition-all duration-300 ${
                isSidebarHovered || isSidebarOpen
                  ? 'opacity-100'
                  : 'opacity-0 h-0 overflow-hidden'
              }`}
            >
              Account
            </p>
            <div
              className={`my-2 border-t border-emerald-900/60 ${
                isSidebarHovered || isSidebarOpen ? 'hidden' : 'block'
              }`}
            />

            <button
              onClick={() => {
                setActiveTab('profile');
                setIsSidebarOpen(false);
              }}
              title={
                !isSidebarHovered && !isSidebarOpen
                  ? 'Profile Settings'
                  : undefined
              }
              className={`w-full flex items-center rounded-2xl transition-all duration-200 cursor-pointer relative ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-lg shadow-emerald-950/50 font-bold'
                  : 'text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white'
              } ${isSidebarHovered || isSidebarOpen ? 'px-4 py-3 gap-3.5 justify-start' : 'p-3 justify-center'}`}
            >
              {activeTab === 'profile' && (
                <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-[#A8D86E] rounded-r-full shadow-sm" />
              )}
              <Settings className="w-5 h-5 shrink-0" />
              <span
                className={`text-sm font-semibold truncate transition-all duration-300 whitespace-nowrap ${
                  isSidebarHovered || isSidebarOpen
                    ? 'opacity-100 max-w-xs'
                    : 'opacity-0 max-w-0 pointer-events-none'
                }`}
              >
                Profile Settings
              </span>
            </button>
          </div>
        </nav>

        {/* Footer User Card & Sign Out */}
        <div className="p-3 border-t border-emerald-900/60 bg-black/20 shrink-0">
          <div
            onClick={() => {
              setActiveTab('profile');
              setIsSidebarOpen(false);
            }}
            title={
              !isSidebarHovered && !isSidebarOpen
                ? `${user?.name || 'Buyer'} (Profile)`
                : undefined
            }
            className={`flex items-center rounded-2xl p-2 transition-all duration-200 cursor-pointer hover:bg-emerald-900/40 group ${
              isSidebarHovered || isSidebarOpen ? 'gap-3' : 'justify-center'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center border-2 border-emerald-500 overflow-hidden shrink-0 shadow-md group-hover:scale-105 transition-transform aspect-square">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user?.name || 'Buyer'}
                  className="w-full h-full object-cover aspect-square"
                />
              ) : (
                <User className="w-5 h-5 text-emerald-200" />
              )}
            </div>
            <div
              className={`flex-1 min-w-0 transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarHovered || isSidebarOpen
                  ? 'opacity-100 max-w-xs'
                  : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              <p className="text-sm font-bold truncate text-white group-hover:text-[#A8D86E] transition-colors">
                {user?.name || 'Customer'}
              </p>
              <p className="text-[11px] text-emerald-400 truncate">
                {user?.city || user?.email || 'Manage Profile →'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title={!isSidebarHovered && !isSidebarOpen ? 'Sign Out' : undefined}
            className={`mt-2 w-full flex items-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 transition-colors text-xs font-bold border border-red-500/20 cursor-pointer ${
              isSidebarHovered || isSidebarOpen
                ? 'py-2.5 px-3 justify-center gap-2'
                : 'p-2.5 justify-center'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span
              className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${
                isSidebarHovered || isSidebarOpen
                  ? 'opacity-100 max-w-xs'
                  : 'opacity-0 max-w-0 pointer-events-none'
              }`}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTAINER (Shifts and adjusts width when sidebar expands) ─── */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarHovered ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-gray-800">Consumer Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border border-emerald-300 cursor-pointer shadow-sm shrink-0 aspect-square"
              title="Buyer Profile"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'Buyer'}
                  className="w-full h-full object-cover aspect-square"
                />
              ) : (
                <User className="w-4 h-4 text-emerald-700" />
              )}
            </button>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-emerald-700 transition cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {activeTab === 'overview' && 'Buyer Dashboard'}
                  {activeTab === 'cart' && 'Shopping Cart'}
                  {activeTab === 'orders' && 'My Order History'}
                  {activeTab === 'profile' && 'Buyer Profile & Address'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === 'overview' &&
                    'Your direct portal to farm-fresh agricultural produce.'}
                  {activeTab === 'cart' &&
                    'Review your selected produce and proceed to checkout.'}
                  {activeTab === 'orders' &&
                    'Track current deliveries and past farm orders.'}
                  {activeTab === 'profile' &&
                    'Manage your personal contact details, photo, and delivery address.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/products')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95 text-sm cursor-pointer"
                >
                  <Store className="w-4 h-4" /> Browse Store
                </button>
              </div>
            </div>

            {/* ═══ 1. OVERVIEW TAB ═══ */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 pointer-events-none rounded-l-full" />
                  <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                    <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 flex items-center justify-center shrink-0">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <User className="w-10 h-10 text-emerald-200" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-black">
                          Welcome, {user?.name || 'Customer'}!
                        </h2>
                        <span className="bg-[#A8D86E] text-[#0B2118] text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                          Consumer
                        </span>
                      </div>
                      <p className="text-emerald-100 text-sm max-w-xl">
                        Shop organic fruits, fresh vegetables, grains, and spices directly from verified local farmers at fair prices.
                      </p>
                      {user?.address && (
                        <p className="text-xs text-emerald-200 flex items-center justify-center sm:justify-start gap-1 pt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#A8D86E]" />
                          Delivery to: {user.address}, {user.city || ''}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div
                    onClick={() => setActiveTab('cart')}
                    className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        In Cart
                      </span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 mt-4">
                      {cartItems.length}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      Items ready for checkout (₹{cartTotal})
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('orders')}
                    className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Package className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        Placed
                      </span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 mt-4">
                      {orders.length}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      Total orders from local farmers
                    </p>
                  </div>

                  <div
                    onClick={() => setActiveTab('profile')}
                    className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <User className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        Profile
                      </span>
                    </div>
                    <p className="text-lg font-black text-gray-900 mt-4 truncate">
                      {user?.city || 'Address Not Set'}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      Manage photo, contact & address
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <button
                    onClick={() => navigate('/products')}
                    className="bg-emerald-50/70 hover:bg-emerald-100/70 p-6 rounded-3xl border border-emerald-100 text-left transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Store className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">
                      Browse Marketplace
                    </h3>
                    <p className="text-xs text-gray-600">
                      Explore fresh seasonal vegetables and fruits directly from producers.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('cart')}
                    className="bg-blue-50/70 hover:bg-blue-100/70 p-6 rounded-3xl border border-blue-100 text-left transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">
                      My Shopping Cart
                    </h3>
                    <p className="text-xs text-gray-600">
                      Check your current items ({cartItems.length}) and place COD orders.
                    </p>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="bg-orange-50/70 hover:bg-orange-100/70 p-6 rounded-3xl border border-orange-100 text-left transition cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Package className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-1">
                      Track My Orders
                    </h3>
                    <p className="text-xs text-gray-600">
                      View recent delivery statuses, items ordered, and order totals.
                    </p>
                  </button>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                      <Package className="w-5 h-5 text-emerald-600" /> Recent
                      Orders
                    </h3>
                    {orders.length > 0 && (
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                      >
                        View All ({orders.length}) →
                      </button>
                    )}
                  </div>
                  {loadingOrders ? (
                    <div className="text-center py-12 text-emerald-700 font-medium">
                      Loading recent orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 px-4 text-gray-500 text-sm">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      No orders placed yet. Start by browsing fresh produce!
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order._id}
                          className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-900">
                                #{order._id.slice(-6).toUpperCase()}
                              </span>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {order.items?.length || 0} produce items • Placed on{' '}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-emerald-700 text-lg">
                              ₹{order.totalAmount}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ 2. CART TAB ═══ */}
            {activeTab === 'cart' && (
              <div className="space-y-6">
                {cartItems.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-4">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                      <ShoppingCart className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Your Cart is Empty
                    </h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Explore farm-fresh produce directly from verified farmers and add items to your cart.
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-md shadow-emerald-600/20"
                    >
                      <Store className="w-4 h-4" /> Browse Fresh Produce
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-4">
                      {cartItems.map((item) => {
                        const productId = item.product?._id || item.product;
                        const price =
                          item.product?.pricePerUnit ?? item.product?.price ?? 0;
                        const imageSrc =
                          item.product?.images?.[0] &&
                          item.product?.images[0] !== 'default-product.jpg'
                            ? item.product.images[0]
                            : item.product?.imageUrl;

                        return (
                          <div
                            key={productId || item._id}
                            className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden border border-emerald-100">
                                {imageSrc ? (
                                  <img
                                    src={imageSrc}
                                    alt={item.product?.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  '🌾'
                                )}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-base">
                                  {item.product?.name || 'Produce Item'}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  ₹{price} / {item.product?.unit || 'kg'}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                              {/* Quantity control */}
                              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                  onClick={() =>
                                    updateQuantity(productId, item.quantity, -1)
                                  }
                                  disabled={item.quantity <= 1}
                                  className="p-2 hover:bg-gray-200 text-gray-600 disabled:opacity-30 transition cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-3 text-xs font-bold text-gray-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(productId, item.quantity, 1)
                                  }
                                  className="p-2 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <span className="font-black text-emerald-700 text-base w-20 text-right">
                                ₹{price * item.quantity}
                              </span>

                              <button
                                onClick={() => removeItem(productId)}
                                className="text-gray-400 hover:text-red-500 transition cursor-pointer p-1"
                                title="Remove"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Summary & Checkout */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm h-fit space-y-5">
                      <h3 className="font-bold text-gray-900 text-base border-b border-gray-100 pb-3">
                        Order Summary
                      </h3>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Items Subtotal</span>
                          <span className="font-bold text-gray-800">
                            ₹{cartTotal}
                          </span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Delivery</span>
                          <span className="font-bold text-emerald-600">
                            FREE
                          </span>
                        </div>
                        <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-black text-gray-900">
                          <span>Total Amount</span>
                          <span className="text-emerald-700">₹{cartTotal}</span>
                        </div>
                      </div>

                      <form onSubmit={handleCheckout} className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                            <span>Delivery Address</span>
                            {user?.address && (
                              <button
                                type="button"
                                onClick={() =>
                                  setShippingAddress(
                                    `${user.address}, ${user.city || ''} - ${user.pincode || ''}`,
                                  )
                                }
                                className="text-[10px] text-emerald-600 font-bold hover:underline"
                              >
                                Use Saved Address
                              </button>
                            )}
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            placeholder="House / Street Name, City, Pincode"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                        >
                          {checkoutLoading ? (
                            'Placing Order...'
                          ) : (
                            <>
                              <span>Place Order (COD)</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══ 3. ORDERS TAB ═══ */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" />
                    All My Orders ({orders.length})
                  </h3>
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search by Order ID..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-20 text-emerald-700 font-semibold">
                    Loading your orders...
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="font-bold text-gray-800 text-lg">
                      No orders found
                    </h4>
                    <p className="text-gray-500 text-sm mt-1 mb-4">
                      When you purchase produce, order details and delivery status will appear here.
                    </p>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md"
                    >
                      Shop Produce Now
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <div
                        key={order._id}
                        className="p-6 space-y-4 hover:bg-gray-50/50 transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                          <div>
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                              #{order._id.slice(-6).toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-400 ml-2">
                              Placed on{' '}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div>{getStatusBadge(order.status)}</div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2">
                          {order.items?.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-800 font-medium">
                                {item.product?.name || 'Produce Item'}
                                <span className="text-gray-400 text-xs ml-1">
                                  × {item.quantity}
                                </span>
                              </span>
                              <span className="font-bold text-gray-900">
                                ₹
                                {(item.price || item.product?.price || 0) *
                                  item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-gray-500 pt-1 gap-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            Shipping to:{' '}
                            <strong className="text-gray-700">
                              {order.shippingAddress}
                            </strong>
                          </span>
                          <span className="text-base font-black text-emerald-700">
                            Total: ₹{order.totalAmount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ═══ 4. PROFILE TAB ═══ */}
            {activeTab === 'profile' && (
              <Profile
                role="buyer"
                ordersCount={orders.length}
                cartCount={cartItems.length}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default BuyerDashboard;
