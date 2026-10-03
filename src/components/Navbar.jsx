import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, User, Leaf } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 1. Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl hover:text-emerald-200 transition"
          >
            <Leaf className="w-6 h-6 text-emerald-300" />
            <span>Farm2Home</span>
          </Link>

          {/* 2. Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/products" className="hover:text-emerald-200 transition">
              Products
            </Link>

            {user ? (
              <>
                {/* Buyer Navigation Links */}
                {user.role === 'buyer' && (
                  <Link
                    to="/cart"
                    className="flex items-center gap-1 hover:text-emerald-200 transition"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                  </Link>
                )}

                {/* Farmer Navigation Links */}
                {user.role === 'farmer' && (
                  <Link
                    to="/farmer/dashboard"
                    className="hover:text-emerald-200 transition font-medium"
                  >
                    Farmer Dashboard
                  </Link>
                )}

                {/* User Profile Badge & Logout Button */}
                <div className="flex items-center gap-3 bg-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-600">
                  <User className="w-4 h-4 text-emerald-300" />
                  <span className="text-sm font-medium capitalize">
                    {user.name}{' '}
                    <span className="text-xs text-emerald-300">
                      ({user.role})
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="ml-2 hover:text-red-300 transition cursor-pointer"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              /* Guest User Navigation */
              <div className="flex items-center gap-4">
                <Link to="/login" className="hover:text-emerald-200 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold hover:bg-emerald-50 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
