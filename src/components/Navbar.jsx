import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, User, Leaf, Menu, X, Search, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      scrolled
        ? 'bg-[#0B2118]/92 backdrop-blur-xl shadow-2xl border-b border-white/15 py-3.5'
        : 'bg-[#0B2118]/70 backdrop-blur-md border-b border-white/10 py-4.5'
    }`}>
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        
        {/* 1. Logo (Positioned Left) */}
        <Link
          to="/"
          className="flex items-center gap-3 font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white hover:opacity-90 transition duration-200 group shrink-0"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2E7D5B] to-[#A8D86E] flex items-center justify-center shadow-lg group-hover:scale-105 transition duration-200">
            <Leaf className="w-5 h-5 text-[#0B2118]" />
          </div>
          <span className="bg-gradient-to-r from-white via-emerald-100 to-[#A8D86E] bg-clip-text text-transparent font-black tracking-tight">
            Farm2Home
          </span>
        </Link>

        {/* 2. Navigation Links (Distributed Center) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-widest text-emerald-100/90 font-heading">
          <Link
            to="/"
            className={`relative py-1 transition-all duration-200 hover:text-[#A8D86E] group ${
              isActivePath('/') ? 'text-[#A8D86E] font-bold' : ''
            }`}
          >
            <span>Home</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#A8D86E] transition-all duration-300 rounded-full ${
              isActivePath('/') ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </Link>

          <Link
            to="/products"
            className={`relative py-1 transition-all duration-200 hover:text-[#A8D86E] group ${
              isActivePath('/products') ? 'text-[#A8D86E] font-bold' : ''
            }`}
          >
            <span>Products</span>
            <span className={`absolute bottom-0 left-0 h-[2px] bg-[#A8D86E] transition-all duration-300 rounded-full ${
              isActivePath('/products') ? 'w-full' : 'w-0 group-hover:w-full'
            }`} />
          </Link>

          <button
            onClick={() => scrollToSection('subscriptions')}
            className="relative py-1 transition-all duration-200 hover:text-[#A8D86E] group cursor-pointer"
          >
            <span>Subscriptions</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#A8D86E] transition-all duration-300 rounded-full group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('rentals')}
            className="relative py-1 transition-all duration-200 hover:text-[#A8D86E] group cursor-pointer"
          >
            <span>Equipment</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#A8D86E] transition-all duration-300 rounded-full group-hover:w-full" />
          </button>

          <button
            onClick={() => scrollToSection('about')}
            className="relative py-1 transition-all duration-200 hover:text-[#A8D86E] group cursor-pointer"
          >
            <span>About Us</span>
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#A8D86E] transition-all duration-300 rounded-full group-hover:w-full" />
          </button>
        </nav>

        {/* 3. Action Buttons & Auth Badges (Positioned Right) */}
        <div className="hidden md:flex items-center gap-4">
          
          <button
            onClick={() => navigate('/products')}
            className="p-2.5 text-emerald-200 hover:text-[#A8D86E] hover:bg-white/10 rounded-full transition duration-200 cursor-pointer"
            title="Search Products"
          >
            <Search className="w-4 h-4" />
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'buyer' && (
                <Link
                  to="/cart"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md transition duration-200 border border-white/20 shadow-md hover:scale-105"
                >
                  <ShoppingCart className="w-4 h-4 text-[#A8D86E]" />
                  <span>Cart</span>
                </Link>
              )}

              {user.role === 'farmer' && (
                <Link
                  to="/farmer/dashboard"
                  className="bg-gradient-to-r from-[#2E7D5B] to-[#12372A] hover:from-[#358e67] hover:to-[#174636] text-white px-5 py-2 rounded-full text-xs font-bold font-heading transition duration-200 shadow-lg border border-emerald-400/30 hover:scale-105"
                >
                  Farmer Portal
                </Link>
              )}

              {/* User Profile Badge */}
              <div className="flex items-center gap-2.5 bg-[#071811]/90 px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-xs font-medium text-emerald-200 shadow-inner">
                <User className="w-3.5 h-3.5 text-[#A8D86E]" />
                <span className="capitalize text-white font-semibold">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-1 text-emerald-300 hover:text-red-300 transition cursor-pointer p-0.5"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-semibold text-emerald-100 hover:text-white transition duration-200 px-3 py-1.5"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-[#2E7D5B] to-[#12372A] hover:from-[#358e67] hover:to-[#174636] text-white px-5 py-2.5 rounded-full text-xs font-bold font-heading shadow-xl transition duration-200 border border-emerald-400/30 hover:scale-105 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#A8D86E]" />
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* 4. Mobile Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 text-white hover:bg-white/10 rounded-full transition"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Full-Width Glass Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#0B2118]/95 backdrop-blur-2xl border-t border-b border-white/15 shadow-2xl p-6 text-white space-y-5 animate-float-slow mt-3">
          <div className="flex flex-col space-y-4 text-sm font-semibold font-heading uppercase tracking-wider">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#A8D86E]">
              Home
            </Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#A8D86E]">
              Products Store
            </Link>
            <button onClick={() => scrollToSection('subscriptions')} className="text-left hover:text-[#A8D86E] cursor-pointer">
              Subscription Plans
            </button>
            <button onClick={() => scrollToSection('rentals')} className="text-left hover:text-[#A8D86E] cursor-pointer">
              Equipment Rentals
            </button>
            <button onClick={() => scrollToSection('about')} className="text-left hover:text-[#A8D86E] cursor-pointer">
              About Us
            </button>
          </div>

          <div className="pt-4 border-t border-white/15 flex flex-col gap-3">
            {user ? (
              <div className="space-y-3">
                <div className="text-xs text-emerald-200">
                  Logged in as <strong className="text-white">{user.name}</strong> ({user.role})
                </div>
                {user.role === 'buyer' && (
                  <Link
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#2E7D5B] text-white py-3 rounded-full text-xs font-bold"
                  >
                    <ShoppingCart className="w-4 h-4" /> View Cart
                  </Link>
                )}
                {user.role === 'farmer' && (
                  <Link
                    to="/farmer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-[#2E7D5B] text-white py-3 rounded-full text-xs font-bold"
                  >
                    Farmer Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 bg-red-500/20 text-red-200 rounded-full text-xs font-bold border border-red-500/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 bg-white/10 text-white rounded-full text-xs font-bold"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 bg-gradient-to-r from-[#2E7D5B] to-[#12372A] text-white rounded-full text-xs font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
