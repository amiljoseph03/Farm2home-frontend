import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import FarmerDashboard from './pages/FarmerDashboard';

import Home from './pages/Home';

// Custom Home Redirection Logic
const HomeRedirect = () => {
  const { user } = useAuth();
  if (user?.role?.toLowerCase() === 'farmer') {
    return <Navigate to="/farmer/dashboard" replace />;
  }
  return <Products />;
};

function App() {
  return (
    <div className="min-h-screen bg-[#F7F8F3] text-[#0B2118] flex flex-col font-body selection:bg-[#2E7D5B] selection:text-white overflow-x-hidden">
      <Navbar />
      <main className="flex-grow w-full">
        <Routes>
          {/* Role-Based Landing Page */}
          {/* <Route path="/" element={<HomeRedirect />} /> */}
          <Route path="/" element={<Home />} />

          {/* Public Routes */}
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Buyer Only Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Farmer Only Routes */}
          <Route
            path="/farmer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
