import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1. ആപ്പ് ലോഡ് ആകുമ്പോൾ LocalStorage-ൽ നിന്ന് യൂസർ ഡാറ്റയും ടോക്കണും റീഡ് ചെയ്യുന്നു
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (err) {
        console.error('Failed to parse user from localStorage', err);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // 2. ലോഗിൻ ഫംഗ്ഷൻ
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });

      // Backend Response handling (res.data അല്ലെങ്കിൽ res.data.data)
      const data = res.data.data || res.data;
      const responseToken = data.token || res.data.token;
      const responseUser = data.user || res.data.user;

      if (responseToken && responseUser) {
        // LocalStorage അപ്‌ഡേറ്റ് ചെയ്യുന്നു
        localStorage.setItem('token', responseToken);
        localStorage.setItem('user', JSON.stringify(responseUser));

        // State അപ്‌ഡേറ്റ് ചെയ്യുന്നു 👈 (VERY IMPORTANT)
        setToken(responseToken);
        setUser(responseUser);

        toast.success('Login Successful!');

        // Role അടിസ്ഥാനമാക്കിയുള്ള റൂട്ടിംഗ്
        const userRole = responseUser.role?.toLowerCase();

        if (userRole === 'farmer') {
          navigate('/farmer/dashboard'); // 👈 '/farmer-dashboard'-ന് പകരം ഇത് നൽകുക
        } else if (userRole === 'buyer' || userRole === 'user') {
          navigate('/');
        } else if (userRole === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error(
        error.response?.data?.message ||
          'Login failed! Please check credentials.',
      );
    }
  };

  // 3. ലോഗൗട്ട് ഫംഗ്ഷൻ
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
