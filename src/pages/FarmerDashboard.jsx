import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import {
  Package,
  PlusCircle,
  X,
  Image,
  Tag,
  DollarSign,
  Layers,
} from 'lucide-react';

const FarmerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State & Form State
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

  const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Other'];
  const units = ['kg', 'gram', 'litre', 'piece', 'box', 'packet'];

  useEffect(() => {
    fetchFarmerOrders();
  }, []);

  const fetchFarmerOrders = async () => {
    try {
      const response = await API.get('/orders/farmer-orders');
      setOrders(response.data.data.orders || response.data.data || []);
    } catch (error) {
      toast.error('Failed to load farmer orders');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  // Add New Product Submission Logic
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductLoading(true);

    try {
      // Backend POST /products Endpoint-ലേക്ക് റിക്വസ്റ്റ് അയക്കുന്നു
      await API.post('/products', {
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
      });

      toast.success('New product added successfully!');
      setIsModalOpen(false); // Modal close ചെയ്യുന്നു

      // Form reset ചെയ്യുന്നു
      setProductData({
        name: '',
        category: 'Vegetables',
        price: '',
        stock: '',
        unit: 'kg',
        description: '',
        imageUrl: '',
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add product';
      toast.error(errorMsg);
    } finally {
      setProductLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Top Header & Add Product Trigger Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Farmer Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Manage your listed produce and incoming orders
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition cursor-pointer shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Product
        </button>
      </div>

      {/* Orders List */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Package className="w-5 h-5 text-emerald-600" />
          Customer Orders Received
        </h2>

        {loading ? (
          <div className="text-center py-10 font-medium text-emerald-700">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No orders received for your products yet.
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="p-4 border border-gray-200 rounded-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-gray-100 pb-2">
                  <div>
                    <span className="text-xs text-gray-400 block">
                      Order ID: #{order._id}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      Buyer: {order.buyer?.name || 'Customer'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="text-xs font-semibold px-2 py-1 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>
                        {item.product?.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        ₹{(item.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 flex justify-between">
                  <span>Address: {order.shippingAddress}</span>
                  <span className="font-bold text-emerald-700 text-sm">
                    Total: ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🟢 Add Product Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-emerald-700 text-white px-6 py-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                List New Farm Produce
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:text-emerald-200 transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={productData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Organic Tomatoes"
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={productData.category}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <select
                    name="unit"
                    value={productData.unit}
                    onChange={handleInputChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="1"
                    value={productData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. 40"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    min="1"
                    value={productData.stock}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                    className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={productData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={productData.description}
                  onChange={handleInputChange}
                  placeholder="Freshly harvested organic vegetables from farm..."
                  className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={productLoading}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition cursor-pointer text-sm disabled:opacity-50"
                >
                  {productLoading ? 'Saving...' : 'Add Product'}
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
