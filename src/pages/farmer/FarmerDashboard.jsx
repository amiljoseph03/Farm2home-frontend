import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Package,
  PlusCircle,
  X,
  Image as ImageIcon,
  DollarSign,
  Layers,
  LayoutDashboard,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  User,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Search,
  Trash2,
  Edit,
  AlertTriangle,
} from 'lucide-react';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'settings'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [productData, setProductData] = useState({
    name: '',
    category: 'Vegetables',
    price: '',
    stock: '',
    unit: 'kg',
    description: '',
    imageUrl: '',
  });

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Pulses',
    'Spices',
    'Organic Fertilizers',
    'Seeds',
    'Other',
  ];
  const units = ['kg', 'gram', 'litre', 'piece', 'box', 'packet'];

  // --- FETCHING DATA ---
  useEffect(() => {
    if (activeTab === 'orders') fetchFarmerOrders();
    if (activeTab === 'products') fetchMyProducts();
  }, [activeTab]);

  const fetchFarmerOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await API.get('/orders/farmer-orders');
      setOrders(response.data.data.orders || response.data.data || []);
    } catch (error) {
      toast.error('Failed to load farmer orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMyProducts = async () => {
    setLoadingProducts(true);
    try {
      // Calls the new backend route we created
      const response = await API.get('/products/my-products');
      setProducts(response.data.data.products || []);
    } catch (error) {
      toast.error('Failed to load your products');
    } finally {
      setLoadingProducts(false);
    }
  };

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);
    try {
      await API.post('/products', {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
      });
      toast.success('New product added successfully!');
      setIsModalOpen(false);
      setProductData({
        name: '',
        category: 'Vegetables',
        price: '',
        stock: '',
        unit: 'kg',
        description: '',
        imageUrl: '',
      });
      fetchMyProducts(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this product? This action cannot be undone.',
      )
    )
      return;

    try {
      await API.delete(`/products/${id}`);
      toast.success('Product deleted successfully');
      setProducts(products.filter((p) => p._id !== id)); // Instantly remove from UI
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchFarmerOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.buyer?.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 flex flex-col shadow-2xl`}
      >
        <div className="h-20 flex items-center px-6 border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-wide">Farm2Home</h2>
              <p className="text-[10px] text-emerald-300 uppercase tracking-widest">
                Farmer Portal
              </p>
            </div>
          </div>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
            Menu
          </p>

          <button
            onClick={() => {
              setActiveTab('orders');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'orders' ? 'bg-emerald-800 text-white shadow-inner border-l-4 border-emerald-400' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium text-sm">Order Management</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'products' ? 'bg-emerald-800 text-white shadow-inner border-l-4 border-emerald-400' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="font-medium text-sm">My Products</span>
          </button>

          <p className="px-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mt-8 mb-3">
            Account
          </p>

          <button
            onClick={() => {
              setActiveTab('settings');
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'settings' ? 'bg-emerald-800 text-white shadow-inner border-l-4 border-emerald-400' : 'text-emerald-100 hover:bg-emerald-800/50'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium text-sm">Profile Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-emerald-800 bg-emerald-950/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center border-2 border-emerald-500">
              <User className="w-5 h-5 text-emerald-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">
                {user?.name || 'Farmer Name'}
              </p>
              <p className="text-xs text-emerald-400 truncate">
                {user?.email || 'farmer@example.com'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-lg transition-colors text-sm font-semibold border border-red-500/20"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-gray-800">Farmer Portal</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {activeTab === 'orders' && 'Order Management'}
                  {activeTab === 'products' && 'My Products'}
                  {activeTab === 'settings' && 'Account Settings'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === 'orders' &&
                    'Manage incoming orders from your customers.'}
                  {activeTab === 'products' &&
                    'View, edit, and manage your listed farm produce.'}
                  {activeTab === 'settings' &&
                    'Update your personal information and preferences.'}
                </p>
              </div>

              {activeTab !== 'settings' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" /> Add New Product
                </button>
              )}
            </div>

            {/* ================= TAB: ORDERS ================= */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-600" /> Recent
                    Orders
                  </h2>
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search by Order ID or Buyer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-emerald-700 font-medium">
                      Loading orders...
                    </p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-20 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      No orders found
                    </h3>
                    <p className="text-gray-500 text-sm">
                      When customers buy your produce, orders will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => (
                      <div
                        key={order._id}
                        className="p-4 sm:p-6 hover:bg-gray-50/50 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                                #{order._id.slice(-6).toUpperCase()}
                              </span>
                              <span className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                                <User className="w-4 h-4" />{' '}
                                {order.buyer?.name || 'Customer'}
                              </span>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                              {order.items?.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span className="text-gray-700 font-medium">
                                    {item.product?.name}{' '}
                                    <span className="text-gray-400 text-xs ml-1">
                                      × {item.quantity}
                                    </span>
                                  </span>
                                  <span className="font-bold text-gray-900">
                                    ₹{(item.price || 0) * item.quantity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="lg:w-48 flex flex-col justify-between lg:items-end gap-4 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                            <div className="text-left lg:text-right">
                              <p className="text-xs text-gray-500 mb-1">
                                Total Amount
                              </p>
                              <p className="text-2xl font-black text-emerald-700">
                                ₹{order.totalAmount}
                              </p>
                            </div>
                            <div className="w-full">
                              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                                Update Status
                              </label>
                              <div className="relative">
                                <select
                                  value={order.status}
                                  onChange={(e) =>
                                    handleStatusUpdate(
                                      order._id,
                                      e.target.value,
                                    )
                                  }
                                  className={`w-full appearance-none pl-9 pr-8 py-2 rounded-lg text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${order.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' : order.status === 'shipped' ? 'bg-blue-50 border-blue-200 text-blue-700' : order.status === 'delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  {getStatusIcon(order.status)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB: PRODUCTS ================= */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                {loadingProducts ? (
                  <div className="text-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-emerald-700 font-medium">
                      Loading your products...
                    </p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-20 px-4">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Layers className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      No products listed yet
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      You haven't listed any farm produce. Click the button
                      below to add your first product and start selling.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
                    >
                      + Add Your First Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product._id}
                        className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col"
                      >
                        {/* Image Area */}
                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                              <ImageIcon className="w-10 h-10" />
                            </div>
                          )}
                          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm border border-gray-100">
                            {product.category}
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="font-black text-emerald-600 text-lg">
                              ₹{product.price}
                              <span className="text-xs text-gray-400 font-medium">
                                /{product.unit}
                              </span>
                            </p>
                          </div>

                          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                            {product.description}
                          </p>

                          <div className="flex items-center justify-between text-sm py-3 border-t border-gray-100 mb-4">
                            <span className="text-gray-500">Stock:</span>
                            <span
                              className={`font-bold ${product.stock > 10 ? 'text-emerald-600' : 'text-red-500'}`}
                            >
                              {product.stock} {product.unit}s
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                toast.success('Edit functionality coming soon!')
                              }
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold transition-colors border border-gray-200"
                            >
                              <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-colors border border-red-100"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ================= TAB: SETTINGS ================= */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
                  Profile Information
                </h2>
                <div className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name || ''}
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                        disabled
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm border border-blue-100 flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">
                        Need to update your details?
                      </p>
                      <p>
                        Profile editing functionality can be connected to a
                        `PATCH /users/profile` endpoint here.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ================= ADD PRODUCT MODAL ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center bg-emerald-700 text-white px-6 py-5 rounded-t-2xl">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> List New Farm Produce
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleAddProduct}
              className="p-6 space-y-5 max-h-[75vh] overflow-y-auto"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Organic Tomatoes"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={productData.unit}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Price (₹)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="number"
                      name="price"
                      required
                      min="1"
                      value={productData.price}
                      onChange={handleInputChange}
                      placeholder="40"
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Stock Qty
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="number"
                      name="stock"
                      required
                      min="1"
                      value={productData.stock}
                      onChange={handleInputChange}
                      placeholder="100"
                      className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Image URL (Optional)
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="url"
                    name="imageUrl"
                    value={productData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  required
                  value={productData.description}
                  onChange={handleInputChange}
                  placeholder="Freshly harvested organic vegetables..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all resize-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productLoading}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/20 text-sm disabled:opacity-50 active:scale-95"
                >
                  {productLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
