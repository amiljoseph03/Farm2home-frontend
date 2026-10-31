import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Profile from '../../components/Profile';
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
  Eye,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const daysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return null;
  return Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
};

const isProductExpired = (p) =>
  p.expiryDate && new Date(p.expiryDate) <= new Date();

const ExpiryBadge = ({ expiryDate }) => {
  if (!expiryDate) return null;
  const days = daysUntilExpiry(expiryDate);
  if (days <= 0)
    return (
      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
        <AlertCircle className="w-3 h-3" /> Expired
      </span>
    );
  if (days <= 3)
    return (
      <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200">
        <Clock className="w-3 h-3" /> {days}d left
      </span>
    );
  if (days <= 7)
    return (
      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
        <Clock className="w-3 h-3" /> {days}d left
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
      <CheckCircle className="w-3 h-3" /> {days}d left
    </span>
  );
};

// ─── EMPTY FORM ────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '',
  category: 'Vegetables',
  price: '',
  stock: '',
  unit: 'kg',
  description: '',
  imageUrl: '',
  expiryDate: '',
};
const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Spices',
  'Organic Fertilizers',
  'Seeds',
  'Other',
];
const UNITS = ['kg', 'gram', 'litre', 'piece', 'box', 'packet'];

// ─── PRODUCT FORM (shared Add/Edit) ───────────────────────────────────────────
const ProductForm = ({
  data,
  onChange,
  onSubmit,
  loading,
  isEdit,
  onCancel,
}) => (
  <form
    onSubmit={onSubmit}
    className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
  >
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">
        Product Name *
      </label>
      <input
        type="text"
        name="name"
        required
        value={data.name}
        onChange={onChange}
        placeholder="e.g. Organic Tomatoes"
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Category *
        </label>
        <select
          name="category"
          value={data.category}
          onChange={onChange}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Unit *
        </label>
        <select
          name="unit"
          value={data.unit}
          onChange={onChange}
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
        >
          {UNITS.map((u) => (
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
          Price (₹) *
        </label>
        <div className="relative">
          <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="number"
            name="price"
            required
            min="1"
            value={data.price}
            onChange={onChange}
            placeholder="40"
            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1.5">
          Stock Qty *
        </label>
        <div className="relative">
          <Layers className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          <input
            type="number"
            name="stock"
            required
            min="1"
            value={data.stock}
            onChange={onChange}
            placeholder="100"
            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
          />
        </div>
      </div>
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">
        Expiry Date *
        <span className="text-xs text-gray-400 font-normal ml-2">
          Auto-hidden after this date
        </span>
      </label>
      <div className="relative">
        <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
        <input
          type="date"
          name="expiryDate"
          required
          value={data.expiryDate}
          onChange={onChange}
          min={new Date().toISOString().split('T')[0]}
          className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
        />
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
          value={data.imageUrl}
          onChange={onChange}
          placeholder="https://images.unsplash.com/..."
          className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all"
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1.5">
        Description *
      </label>
      <textarea
        name="description"
        rows="3"
        required
        value={data.description}
        onChange={onChange}
        placeholder="Freshly harvested organic vegetables..."
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:bg-white transition-all resize-none"
      />
    </div>
    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
      <button
        type="button"
        onClick={onCancel}
        className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/20 text-sm disabled:opacity-50 active:scale-95"
      >
        {loading
          ? isEdit
            ? 'Saving...'
            : 'Adding...'
          : isEdit
            ? 'Save Changes'
            : 'Add Product'}
      </button>
    </div>
  </form>
);

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
const FarmerDashboard = ({ initialTab = 'orders' }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [activeTab, setActiveTab] = useState(initialTab || 'orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSubTab, setProductSubTab] = useState('active');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Form data
  const [productData, setProductData] = useState(EMPTY_FORM);
  const [editData, setEditData] = useState(EMPTY_FORM);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') fetchFarmerOrders();
    if (activeTab === 'products') fetchMyProducts();
  }, [activeTab]);

  // ── Fetchers ─────────────────────────────────────────────────────────────
  const fetchFarmerOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await API.get('/orders/farmer-orders');
      setOrders(res.data.data.orders || res.data.data || []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMyProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const res = await API.get('/products/my-products');
      setProducts(res.data.data.products || []);
    } catch {
      toast.error('Failed to load your products');
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const makeChangeHandler = (setter) => (e) =>
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/products', {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
      });
      toast.success('Product added successfully!');
      setIsAddModalOpen(false);
      setProductData(EMPTY_FORM);
      fetchMyProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (product) => {
    const price = product.pricePerUnit ?? product.price ?? '';
    const stock = product.quantityAvailable ?? product.stock ?? '';
    const imageUrl =
      product.images?.[0] && product.images[0] !== 'default-product.jpg'
        ? product.images[0]
        : (product.imageUrl ?? '');
    const expiry = product.expiryDate
      ? new Date(product.expiryDate).toISOString().split('T')[0]
      : '';
    setEditData({
      name: product.name || '',
      category: product.category || 'Vegetables',
      price: String(price),
      stock: String(stock),
      unit: product.unit || 'kg',
      description: product.description || '',
      imageUrl,
      expiryDate: expiry,
    });
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.patch(`/products/${selectedProduct._id}`, {
        ...editData,
        price: Number(editData.price),
        stock: Number(editData.stock),
      });
      toast.success('Product updated!');
      setIsEditModalOpen(false);
      fetchMyProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  const openDetail = (product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };
  const openDeleteConfirm = (product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await API.delete(`/products/${productToDelete._id}`);
      toast.success('Product deleted');
      setIsDeleteConfirmOpen(false);
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchFarmerOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  const getStatusIcon = (status) =>
    ({
      pending: <Clock className="w-4 h-4 text-amber-500" />,
      shipped: <Truck className="w-4 h-4 text-blue-500" />,
      delivered: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      cancelled: <XCircle className="w-4 h-4 text-red-500" />,
    })[status] || <Clock className="w-4 h-4 text-gray-400" />;

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.buyer?.name || '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const activeProducts = products.filter((p) => !isProductExpired(p));
  const expiredProducts = products.filter(isProductExpired);

  // ── Product Card ────────────────────────────────────────────────────────
  const ProductCard = ({ product, expired = false }) => {
    const price = product.pricePerUnit ?? product.price ?? 0;
    const stock = product.quantityAvailable ?? product.stock ?? 0;
    const imageSrc =
      product.images?.[0] && product.images[0] !== 'default-product.jpg'
        ? product.images[0]
        : product.imageUrl;

    return (
      <div
        className={`border rounded-2xl overflow-hidden flex flex-col group transition-all duration-200 ${expired ? 'border-red-200 opacity-80' : 'border-gray-200 bg-white hover:shadow-xl hover:-translate-y-0.5'}`}
      >
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageIcon className="w-12 h-12" />
            </div>
          )}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm border border-gray-100">
            {product.category}
          </div>
          {expired && (
            <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
              <span className="bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                Expired
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex-1 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-1">
              {product.name}
            </h3>
            <p className="font-black text-emerald-700 text-base shrink-0">
              ₹{price}
              <span className="text-xs text-gray-400 font-normal">
                /{product.unit}
              </span>
            </p>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 flex-1">
            {product.description || 'No description.'}
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              Stock:{' '}
              <strong
                className={`ml-1 ${stock <= 0 ? 'text-red-500' : 'text-gray-700'}`}
              >
                {stock} {product.unit}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              Added:{' '}
              <strong className="ml-1 text-gray-700">
                {fmtDate(product.dateAdded || product.createdAt)}
              </strong>
            </span>
            <span className="col-span-2 flex items-center gap-1.5 flex-wrap">
              <Calendar className="w-3.5 h-3.5 text-red-400 shrink-0" />
              Expires:{' '}
              <strong className="text-gray-700">
                {fmtDate(product.expiryDate)}
              </strong>
              <ExpiryBadge expiryDate={product.expiryDate} />
            </span>
          </div>
        </div>

        <div className="px-4 pb-4 grid grid-cols-3 gap-2">
          <button
            onClick={() => openDetail(product)}
            className="flex items-center justify-center gap-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors border border-blue-100"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </button>
          <button
            onClick={() => openEdit(product)}
            className="flex items-center justify-center gap-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-semibold transition-colors border border-amber-100"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => openDeleteConfirm(product)}
            className="flex items-center justify-center gap-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors border border-red-100"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    );
  };

  // ── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* SIDEBAR (Sticky on Desktop, Icon-Only Rail Expanding on Hover) */}
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
              <Package className="w-6 h-6 text-white" />
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
                Farmer Portal
              </p>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            className="ml-auto lg:hidden text-emerald-200 hover:text-white p-1"
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
            Menu
          </p>

          {[
            {
              id: 'orders',
              icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
              label: 'Order Management',
            },
            {
              id: 'products',
              icon: <ShoppingBag className="w-5 h-5 shrink-0" />,
              label: 'My Products',
              badge: expiredProducts.length || null,
            },
            {
              id: 'profile',
              icon: <User className="w-5 h-5 shrink-0" />,
              label: 'My Profile & Farm',
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
                  {/* Small badge dot in collapsed rail */}
                  {!isSidebarHovered && !isSidebarOpen && badge && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[#071811]" />
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
                    <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full ml-2 shadow-sm">
                      {badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

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
                activeTab === 'profile' || activeTab === 'settings'
                  ? 'bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-lg shadow-emerald-950/50 font-bold'
                  : 'text-emerald-200/80 hover:bg-emerald-900/40 hover:text-white'
              } ${isSidebarHovered || isSidebarOpen ? 'px-4 py-3 gap-3.5 justify-start' : 'p-3 justify-center'}`}
            >
              {(activeTab === 'profile' || activeTab === 'settings') && (
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
                ? `${user?.name || 'Farmer'} (Profile)`
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
                  alt={user?.name || 'Farmer'}
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
                {user?.name || 'Farmer'}
              </p>
              <p className="text-[11px] text-emerald-400 truncate">
                {user?.farmName || user?.email || 'Manage Profile →'}
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

      {/* MAIN CONTAINER (Shifts and adjusts width when sidebar expands) */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarHovered ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-gray-800">Farmer Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('profile')}
              className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border border-emerald-300 cursor-pointer shadow-sm shrink-0 aspect-square"
              title="Farmer Profile"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'Farmer'}
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  {activeTab === 'orders' && 'Order Management'}
                  {activeTab === 'products' && 'My Products'}
                  {(activeTab === 'profile' || activeTab === 'settings') &&
                    'Farmer Profile & Farm Details'}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === 'orders' &&
                    'Manage incoming orders from your customers.'}
                  {activeTab === 'products' &&
                    'View, edit, and manage your listed farm produce.'}
                  {(activeTab === 'profile' || activeTab === 'settings') &&
                    'View, edit, and manage your personal credentials and farm details.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {activeTab === 'products' && (
                  <button
                    onClick={fetchMyProducts}
                    title="Refresh"
                    className="p-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                {activeTab !== 'settings' && activeTab !== 'profile' && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                  >
                    <PlusCircle className="w-5 h-5" /> Add New Product
                  </button>
                )}
              </div>
            </div>

            {/* ─── ORDERS TAB ─── */}
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
                    <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
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
                                    {item.product?.name}
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
                            {order.shippingAddress && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />{' '}
                                {order.shippingAddress}
                              </p>
                            )}
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
                                  className={`w-full appearance-none pl-9 pr-8 py-2 rounded-lg text-sm font-bold border focus:outline-none transition-all ${
                                    order.status === 'pending'
                                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                                      : order.status === 'shipped'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                                        : order.status === 'delivered'
                                          ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                          : 'bg-red-50 border-red-200 text-red-700'
                                  }`}
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

            {/* ─── PRODUCTS TAB ─── */}
            {activeTab === 'products' && (
              <div className="space-y-6">
                {/* Sub-tab pills */}
                <div className="flex items-center gap-1 bg-white rounded-2xl border border-gray-200 p-1.5 shadow-sm w-fit">
                  <button
                    onClick={() => setProductSubTab('active')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${productSubTab === 'active' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Active
                    <span
                      className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${productSubTab === 'active' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {activeProducts.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setProductSubTab('expired')}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${productSubTab === 'expired' ? 'bg-red-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <AlertTriangle className="w-4 h-4" /> Expired
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${productSubTab === 'expired' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'}`}
                    >
                      {expiredProducts.length}
                    </span>
                  </button>
                </div>

                {/* Warning banner on active tab when there are expired products */}
                {expiredProducts.length > 0 && productSubTab === 'active' && (
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-amber-800">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                    <p className="text-sm font-medium">
                      You have <strong>{expiredProducts.length}</strong> expired
                      product{expiredProducts.length > 1 ? 's' : ''}. Expired
                      products are <strong>automatically hidden</strong> from
                      the public marketplace.{' '}
                      <button
                        onClick={() => setProductSubTab('expired')}
                        className="underline text-amber-700 hover:text-amber-900"
                      >
                        View them →
                      </button>
                    </p>
                  </div>
                )}

                {/* ACTIVE PRODUCTS PANEL */}
                {productSubTab === 'active' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                    {loadingProducts ? (
                      <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-emerald-700 font-medium">
                          Loading products...
                        </p>
                      </div>
                    ) : activeProducts.length === 0 ? (
                      <div className="text-center py-20 px-4">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Layers className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          No active products
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                          You haven't listed any farm produce yet.
                        </p>
                        <button
                          onClick={() => setIsAddModalOpen(true)}
                          className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
                        >
                          + Add Your First Product
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeProducts.map((p) => (
                          <ProductCard key={p._id} product={p} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* EXPIRED PRODUCTS PANEL */}
                {productSubTab === 'expired' && (
                  <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-4 sm:p-6">
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-6">
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-800">
                          Expired Products
                        </p>
                        <p className="text-xs text-red-600 mt-0.5">
                          These products have passed their expiry date and are{' '}
                          <strong>automatically invisible</strong> in the public
                          marketplace. Edit their expiry date to re-list them,
                          or delete them permanently.
                        </p>
                      </div>
                    </div>
                    {loadingProducts ? (
                      <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-red-600 font-medium">Loading...</p>
                      </div>
                    ) : expiredProducts.length === 0 ? (
                      <div className="text-center py-16 px-4">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          No expired products! 🎉
                        </h3>
                        <p className="text-gray-500 text-sm">
                          All your products are fresh and within their expiry
                          dates.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {expiredProducts.map((p) => (
                          <ProductCard key={p._id} product={p} expired />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ─── PROFILE & SETTINGS TAB ─── */}
            {(activeTab === 'profile' || activeTab === 'settings') && (
              <Profile
                role="farmer"
                productsCount={products.length}
                ordersCount={orders.length}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ══ ADD PRODUCT MODAL ══ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex justify-between items-center bg-emerald-700 text-white px-6 py-5 rounded-t-2xl">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5" /> List New Farm Produce
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductForm
              data={productData}
              onChange={makeChangeHandler(setProductData)}
              onSubmit={handleAddProduct}
              loading={submitting}
              isEdit={false}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ══ EDIT PRODUCT MODAL ══ */}
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="flex justify-between items-center bg-amber-600 text-white px-6 py-5 rounded-t-2xl">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Edit className="w-5 h-5" /> Edit Product
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductForm
              data={editData}
              onChange={makeChangeHandler(setEditData)}
              onSubmit={handleEditProduct}
              loading={submitting}
              isEdit={true}
              onCancel={() => setIsEditModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ══ PRODUCT DETAIL MODAL ══ */}
      {isDetailModalOpen &&
        selectedProduct &&
        (() => {
          const p = selectedProduct;
          const price = p.pricePerUnit ?? p.price ?? 0;
          const stock = p.quantityAvailable ?? p.stock ?? 0;
          const imageSrc =
            p.images?.[0] && p.images[0] !== 'default-product.jpg'
              ? p.images[0]
              : p.imageUrl;
          const expired = isProductExpired(p);
          return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8 overflow-hidden">
                <div className="relative h-56 bg-gray-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/40 p-2 rounded-xl transition-colors text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  {expired && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                      Expired
                    </div>
                  )}
                  <div className="absolute bottom-4 left-5">
                    <h2 className="text-2xl font-extrabold text-white drop-shadow-lg capitalize">
                      {p.name}
                    </h2>
                    <span className="inline-block mt-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {p.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                      <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                        Price
                      </p>
                      <p className="text-3xl font-black text-emerald-700">
                        ₹{price}
                      </p>
                      <p className="text-xs text-emerald-500 mt-0.5">
                        per {p.unit || 'kg'}
                      </p>
                    </div>
                    <div
                      className={`rounded-2xl p-4 border ${stock <= 0 ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'}`}
                    >
                      <p
                        className={`text-xs font-semibold uppercase tracking-wider mb-1 ${stock <= 0 ? 'text-red-500' : 'text-blue-600'}`}
                      >
                        Stock
                      </p>
                      <p
                        className={`text-3xl font-black ${stock <= 0 ? 'text-red-600' : 'text-blue-700'}`}
                      >
                        {stock}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${stock <= 0 ? 'text-red-400' : 'text-blue-400'}`}
                      >
                        {p.unit || 'kg'} available
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {p.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        icon: <Calendar className="w-4 h-4 text-emerald-500" />,
                        label: 'Date Added',
                        value: fmtDate(p.dateAdded || p.createdAt),
                      },
                      {
                        icon: <Calendar className="w-4 h-4 text-red-500" />,
                        label: 'Expiry Date',
                        value: fmtDate(p.expiryDate),
                        extra: <ExpiryBadge expiryDate={p.expiryDate} />,
                      },
                      {
                        icon: <MapPin className="w-4 h-4 text-gray-400" />,
                        label: 'Location',
                        value: p.location || 'Not Specified',
                      },
                      {
                        icon: <Tag className="w-4 h-4 text-gray-400" />,
                        label: 'Status',
                        value: expired
                          ? 'Hidden from marketplace'
                          : p.isAvailable
                            ? 'Listed & Active'
                            : 'Unlisted',
                      },
                    ].map(({ icon, label, value, extra }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100"
                      >
                        <div className="mt-0.5 shrink-0">{icon}</div>
                        <div>
                          <p className="text-xs text-gray-400 font-semibold">
                            {label}
                          </p>
                          <p className="text-sm font-bold text-gray-800 mt-0.5">
                            {value}
                          </p>
                          {extra && <div className="mt-1">{extra}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {p.seller?.name && (
                    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3.5 border border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">
                          Listed by
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {p.seller.name}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        openEdit(p);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl font-semibold transition-colors border border-amber-200 text-sm"
                    >
                      <Edit className="w-4 h-4" /> Edit Product
                    </button>
                    <button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        openDeleteConfirm(p);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-colors border border-red-200 text-sm"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ══ DELETE CONFIRM MODAL ══ */}
      {isDeleteConfirmOpen && productToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-gray-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              Delete Product?
            </h3>
            <p className="text-gray-500 text-sm mb-1">
              You're about to permanently delete:
            </p>
            <p className="font-bold text-gray-800 mb-4">
              "{productToDelete.name}"
            </p>
            <p className="text-xs text-red-500 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors text-sm shadow-md shadow-red-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
