import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Package, Store, User } from 'lucide-react';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickLinks = [
    {
      icon: <Store className="w-8 h-8 text-emerald-600" />,
      label: 'Browse Products',
      description: 'Explore fresh produce from local farmers',
      path: '/products',
      bg: 'bg-emerald-50',
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-blue-600" />,
      label: 'My Cart',
      description: 'View items in your cart and checkout',
      path: '/buyer/cart',
      bg: 'bg-blue-50',
    },
    {
      icon: <Package className="w-8 h-8 text-orange-600" />,
      label: 'My Orders',
      description: 'Track your past and current orders',
      path: '/buyer/orders',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
          <User className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name || 'Buyer'}!
          </h1>
          <p className="text-gray-500 text-sm">
            Your farm-fresh marketplace dashboard
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {quickLinks.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`${item.bg} p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition duration-200 text-left cursor-pointer group`}
          >
            <div className="mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">
              {item.icon}
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">
              {item.label}
            </h3>
            <p className="text-gray-500 text-sm">{item.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BuyerDashboard;
