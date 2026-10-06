import { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get('/orders/my-orders');
      setOrders(response.data.data.orders || response.data.data || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'shipped':
        return (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Package className="w-7 h-7 text-emerald-600" />
        My Orders
      </h1>

      {loading ? (
        <div className="text-center py-20 text-emerald-700 font-semibold">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                <div>
                  <span className="text-xs text-gray-400 block">
                    Order ID: #{order._id}
                  </span>
                  <span className="text-xs text-gray-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>{getStatusBadge(order.status)}</div>
              </div>

              <div className="space-y-2">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product?.name || 'Product'} × {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-800">
                      ₹
                      {(item.price || item.product?.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  Shipping Address:{' '}
                  <span className="text-gray-700">{order.shippingAddress}</span>
                </span>
                <span className="text-base font-bold text-emerald-700">
                  Total: ₹{order.totalAmount}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
