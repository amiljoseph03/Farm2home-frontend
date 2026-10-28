import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import Products from './pages/farmer/Products';

// Buyer pages
import BuyerDashboard from './pages/buyer/BuyerDashboard';
import Cart from './pages/buyer/Cart';
import Orders from './pages/buyer/Orders';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow w-full overflow-x-hidden">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Public Routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Farmer Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/products"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <Products />
              </ProtectedRoute>
            }
          />

          {/* Buyer Routes */}
          <Route
            path="/buyer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/cart"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/buyer/orders"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Legacy redirect aliases so old links still work */}
          <Route path="/cart" element={<Navigate to="/buyer/cart" replace />} />
          <Route path="/orders" element={<Navigate to="/buyer/orders" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
