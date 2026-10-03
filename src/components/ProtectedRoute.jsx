import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-10 font-semibold">Loading...</div>;
  }

  // 1. ലോഗിൻ ചെയ്തിട്ടില്ലെങ്കിൽ Login പേജിലേക്ക് Redirect ചെയ്യും
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. യൂസറുടെ Role അനുവാദമുള്ളതല്ലെങ്കിൽ Home പേജിലേക്ക് Redirect ചെയ്യും
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
