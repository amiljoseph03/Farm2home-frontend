import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // 1. ആപ്പ് ലോഡ് ആകുമ്പോൾ LocalStorage-ൽ നിന്ന് യൂസർ ഡാറ്റയും ടോക്കണും റീഡ് ചെയ്യുന്നു
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  // 2. ലോഗിൻ ചെയ്യുമ്പോൾ State-ഉം LocalStorage-ഉം അപ്‌ഡേറ്റ് ചെയ്യാനുള്ള ഫംഗ്ഷൻ
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  // 3. ലോഗൗട്ട് ചെയ്യുമ്പോൾ Context-ഉം Storage-ഉം ക്ലിയർ ചെയ്യാനുള്ള ഫംഗ്ഷൻ
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom Hook: ഏത് കോമ്പോണന്റിലും `const { user, login } = useAuth();` എന്ന് എളുപ്പത്തിൽ വിളിക്കാൻ
export const useAuth = () => useContext(AuthContext);
