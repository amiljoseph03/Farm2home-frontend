import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ShoppingBag,
  Sprout,
  ShieldCheck,
  Truck,
  Check,
  Star,
  ArrowRight,
  Users,
  TrendingUp,
  Leaf,
  Calendar,
  Clock,
  Heart,
  Wrench,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Award,
  RefreshCw,
  CheckCircle2,
  X,
  Eye,
  Sparkles,
  Package,
  CheckCircle,
  Search,
  Filter,
  ArrowUpRight,
  Flame,
  Home as HomeIcon
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Products & Interactivity State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [cartLoading, setCartLoading] = useState({});
  const [wishlist, setWishlist] = useState({});
  const [activeSubscriptionPlan, setActiveSubscriptionPlan] = useState('weekly');
  const [activeEquipmentCategory, setActiveEquipmentCategory] = useState('All');
  const [activeProductCategory, setActiveProductCategory] = useState('All');
  const [activeMapPin, setActiveMapPin] = useState(0);

  // Modals State
  const [subscriptionModal, setSubscriptionModal] = useState(null);
  const [equipmentModal, setEquipmentModal] = useState(null);

  // 1. HERO CAROUSEL SLIDES DATA
  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=80',
      tag: '🌱 100% ORGANIC & FRESH',
      title: 'Fresh From Our Farms To Your Family.',
      subtitle: 'Good food begins with good farming. Discover organic vegetables, fresh fruits, and raw milk delivered directly from local fields.',
      buttonText: 'Shop Fresh Products',
      buttonAction: () => navigate('/products')
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb12765?auto=format&fit=crop&w=1800&q=80',
      tag: '👨‍🌾 SUPPORT LOCAL FARMERS',
      title: 'Support The People Who Grow Your Food.',
      subtitle: 'Connect directly with verified local producers. Skip traditional middlemen and guarantee fair returns for rural farming families.',
      buttonText: 'Meet Our Farmers',
      buttonAction: () => scrollToSection('farmers')
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1800&q=80',
      tag: '🥦 DAILY & WEEKLY HARVEST',
      title: "Nature's Freshest Bounty, Delivered.",
      subtitle: 'Harvested on-demand upon your order placement to preserve maximum nutrients, crisp taste, and natural flavor.',
      buttonText: 'Explore Products',
      buttonAction: () => navigate('/products')
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1800&q=80',
      tag: '🚜 AGRICULTURAL MACHINERY',
      title: 'The Right Equipment For Every Farm.',
      subtitle: 'Rent modern tractors, rotavators, harvesters, and irrigation pumps directly from local owners at affordable daily rates.',
      buttonText: 'Explore Rentals',
      buttonAction: () => scrollToSection('rentals')
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1800&q=80',
      tag: '❤️ DIRECT MARKETPLACE',
      title: 'From Farm. With Love.',
      subtitle: 'One seamless digital platform connecting passionate local producers, farm-fresh harvest, and health-conscious families.',
      buttonText: 'Get Started Today',
      buttonAction: () => navigate('/register')
    }
  ];

  // Multi-directional Scroll Reveal Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      { threshold: 0.12 }
    );

    const elements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-scale');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [loadingProducts, activeProductCategory, activeEquipmentCategory, activeSubscriptionPlan]);

  // Carousel Autoplay Timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, heroSlides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Fetch products from backend API
  useEffect(() => {
    fetchHomeProducts();
  }, []);

  const fetchHomeProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await API.get('/products');
      const apiData = response.data?.data?.products || response.data?.data || [];
      if (Array.isArray(apiData) && apiData.length > 0) {
        setProducts(apiData);
      } else {
        setProducts(fallbackProducts);
      }
    } catch (error) {
      setProducts(fallbackProducts);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Add to Cart handler preserving backend auth logic
  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error('Please login to add items to your cart');
      navigate('/login');
      return;
    }

    if (user.role === 'farmer') {
      toast.error('Farmer accounts cannot place orders. Please log in with a buyer account.');
      return;
    }

    const prodId = product._id || product.id;

    try {
      setCartLoading((prev) => ({ ...prev, [prodId]: true }));
      await API.post('/cart', { productId: prodId, quantity: 1 });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to add item to cart';
      toast.error(errorMsg);
    } finally {
      setCartLoading((prev) => ({ ...prev, [prodId]: false }));
    }
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const nextState = { ...prev, [id]: !prev[id] };
      toast.success(nextState[id] ? 'Added to wishlist' : 'Removed from wishlist');
      return nextState;
    });
  };

  // Fallback demo products for empty database
  const fallbackProducts = [
    {
      _id: 'demo-1',
      name: 'Organic Vine Tomatoes',
      category: 'Vegetables',
      price: 45,
      unit: 'kg',
      seller: { name: 'Ramesh Patel' },
      stock: 50,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80'],
      description: 'Sun-ripened organic farm tomatoes picked fresh daily.'
    },
    {
      _id: 'demo-2',
      name: 'Fresh Farm A2 Cow Milk',
      category: 'Dairy',
      price: 65,
      unit: 'litre',
      seller: { name: 'Sunil Kumar' },
      stock: 120,
      rating: 5.0,
      images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=80'],
      description: 'Chilled pure raw A2 milk directly from pasture-fed cows.'
    },
    {
      _id: 'demo-3',
      name: 'Crisp Shimla Apples',
      category: 'Fruits',
      price: 140,
      unit: 'kg',
      seller: { name: 'Anita Sharma' },
      stock: 40,
      rating: 4.8,
      images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80'],
      description: 'Sweet and juicy mountain-grown Himachal apples.'
    },
    {
      _id: 'demo-4',
      name: 'Free-Range Country Eggs (12 Pack)',
      category: 'Dairy',
      price: 90,
      unit: 'pack',
      seller: { name: 'Vikram Singh' },
      stock: 80,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=700&q=80'],
      description: 'Naturally raised free-range country eggs full of essential nutrients.'
    },
    {
      _id: 'demo-5',
      name: 'Hydroponic Green Spinach',
      category: 'Vegetables',
      price: 30,
      unit: 'bunch',
      seller: { name: 'Gurpreet Singh' },
      stock: 65,
      rating: 4.7,
      images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80'],
      description: 'Crisp green spinach harvested fresh upon order placement.'
    },
    {
      _id: 'demo-6',
      name: 'Organic Basmati Rice',
      category: 'Farm Products',
      price: 120,
      unit: 'kg',
      seller: { name: 'Harpreet Kaur' },
      stock: 200,
      rating: 4.9,
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=700&q=80'],
      description: 'Long-grain aromatic organic basmati rice harvested directly.'
    },
  ];

  // Subscription Plans Data
  const subscriptionPlans = [
    {
      id: 'daily',
      frequency: 'daily',
      name: 'Daily Fresh A2 Milk & Greens',
      price: '₹49',
      period: 'per day',
      billing: 'Billed monthly (₹1,470/mo)',
      description: 'Raw A2 milk and morning greens delivered every day by 7:00 AM.',
      deliveryTime: 'Every day by 7:00 AM',
      estQty: '1 Litre Milk + Daily Greens',
      savings: 'Save 20%',
      popular: false,
      itemsIncluded: ['Fresh A2 Milk (1L)', 'Leafy Spinach / Greens', 'Country Eggs (Alternate Days)'],
      badgeText: 'DAILY ESSENTIALS'
    },
    {
      id: 'weekly',
      frequency: 'weekly',
      name: 'Weekly Harvest Basket',
      price: '₹599',
      period: 'per week',
      billing: 'Billed monthly (₹2,396/mo)',
      description: 'Comprehensive weekly organic produce box curated for a healthy family.',
      deliveryTime: 'Every Saturday / Sunday morning',
      estQty: '8–10 kg Organic Produce',
      savings: 'Save 25%',
      popular: true,
      itemsIncluded: ['6-7 kg Fresh Vegetables', '2-3 kg Seasonal Fruits', 'Bonus Organic Dairy Item', 'Free Glass Container Box'],
      badgeText: 'MOST POPULAR'
    },
    {
      id: 'monthly',
      frequency: 'monthly',
      name: 'Monthly Family Pantry Pass',
      price: '₹2,299',
      period: 'per month',
      billing: 'Billed per month',
      description: 'Bulk monthly harvest pass containing farm grains, oils, dairy & produce.',
      deliveryTime: '4 Scheduled Weekly Deliveries',
      estQty: '35–40 kg Total Harvest Produce',
      savings: 'Save 30%',
      popular: false,
      itemsIncluded: ['4x Weekly Produce Baskets', '10 kg Organic Rice / Wheat', 'Cold-Pressed Cooking Oils', 'Dedicated Support Manager'],
      badgeText: 'BEST VALUE'
    }
  ];

  // Equipment Rental Data
  const equipmentItems = [
    {
      id: 'eq-1',
      name: 'John Deere 5050D Power Tractor',
      category: 'Tractors',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      description: '50 HP heavy duty tractor ideal for plowing, tilling, and heavy farm transport.',
      owner: 'Ramesh Patel',
      location: 'Kottayam, Kerala',
      priceDay: 2500,
      priceWeek: 14000,
      available: true,
      rating: 5.0,
      specs: '50 HP • Diesel • 4WD • Power Steering'
    },
    {
      id: 'eq-2',
      name: 'Heavy Duty Multi-Blade Rotavator',
      category: 'Tillage',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
      description: 'High efficiency rotavator for fine seedbed preparation and soil mixing.',
      owner: 'Gurpreet Singh',
      location: 'Palakkad, Kerala',
      priceDay: 600,
      priceWeek: 3500,
      available: true,
      rating: 4.8,
      specs: '6 Feet Width • 36 Blades • Category II'
    },
    {
      id: 'eq-3',
      name: 'Automatic Multi-Crop Harvester',
      category: 'Harvesting',
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
      description: 'Combine harvester for paddy, wheat, and maize with maximum grain recovery.',
      owner: 'Vikram Nair',
      location: 'Thrissur, Kerala',
      priceDay: 2500,
      priceWeek: 15000,
      available: true,
      rating: 4.9,
      specs: '75 HP Turbo • 2.5m Cutter • Grain Tank 1.5T'
    },
    {
      id: 'eq-4',
      name: 'Precision Pneumatic Seed Drill',
      category: 'Planting',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      description: 'Accurate seed & fertilizer placer designed to optimize seed depth.',
      owner: 'Sunil Kumar',
      location: 'Wayanad, Kerala',
      priceDay: 450,
      priceWeek: 2600,
      available: true,
      rating: 4.7,
      specs: '9 Rows • Depth Control • Double Disc'
    },
    {
      id: 'eq-5',
      name: 'Solar-Powered Irrigation Pump (5HP)',
      category: 'Irrigation',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
      description: 'Eco-friendly high pressure solar water pump for fields and orchards.',
      owner: 'Anita Sharma',
      location: 'Idukki, Kerala',
      priceDay: 400,
      priceWeek: 2200,
      available: true,
      rating: 4.9,
      specs: '5 HP • 300 GPM • Solar Array Included'
    }
  ];

  // Local Farmers Map Mockup Data
  const mapFarmers = [
    { name: 'Ramesh Patel', region: 'Kottayam, KL', produce: 'Vine Tomatoes & Leafy Greens', rating: '5.0 ★', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { name: 'Sunil Kumar', region: 'Palakkad, KL', produce: 'Raw A2 Milk & Dairy', rating: '4.9 ★', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' },
    { name: 'Anita Sharma', region: 'Shimla / Wayanad', produce: 'Orchard Apples & Strawberries', rating: '4.9 ★', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
    { name: 'Gurpreet Singh', region: 'Idukki, KL', produce: 'Organic Spinach & Herbs', rating: '4.8 ★', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80' }
  ];

  const filteredEquipment = activeEquipmentCategory === 'All'
    ? equipmentItems
    : equipmentItems.filter(e => e.category === activeEquipmentCategory);

  const filteredProductsShowcase = activeProductCategory === 'All'
    ? products
    : products.filter(p => p.category?.toLowerCase().includes(activeProductCategory.toLowerCase()));

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubscriptionSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to complete subscription');
      navigate('/login');
      return;
    }
    toast.success(`Subscribed to ${subscriptionModal.name}! Details sent to your account.`);
    setSubscriptionModal(null);
  };

  const handleEquipmentBookSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to rent equipment');
      navigate('/login');
      return;
    }
    toast.success(`Rental request sent for ${equipmentModal.name}! Owner will contact you shortly.`);
    setEquipmentModal(null);
  };

  return (
    <div className="bg-[#F7F8F3] text-[#0B2118] font-body w-full relative overflow-x-hidden">
      
      {/* Subtle Floating Decorative Particles */}
      <div className="fixed top-20 right-8 text-2xl z-40 opacity-75 pointer-events-none animate-leaf-sway">🌿</div>
      <div className="fixed top-[45%] left-4 text-xl z-40 opacity-70 pointer-events-none animate-float-slow">🍃</div>
      <div className="fixed top-[75%] right-6 text-2xl z-40 opacity-70 pointer-events-none animate-float">🌱</div>

      {/* ------------------------------------------------------------- */}
      {/* 1. CINEMATIC 100VH FULL-SCREEN HERO CAROUSEL                   */}
      {/* ------------------------------------------------------------- */}
      <section
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full h-screen min-h-[100vh] flex items-center justify-center overflow-hidden bg-[#0B2118] text-white"
      >
        {/* Slides Container */}
        {heroSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Image with Ken Burns Zoom Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full object-cover transform ${
                    isActive ? 'animate-kenburns scale-105' : 'scale-100'
                  } transition-transform duration-[12000ms]`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2118] via-[#0B2118]/70 to-[#0B2118]/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B2118]/90 via-[#0B2118]/50 to-transparent" />
              </div>

              {/* Text & Content Overlay */}
              <div className="relative z-20 max-w-7xl mx-auto h-full px-6 sm:px-10 lg:px-16 flex flex-col justify-center items-start space-y-6 pt-20">
                
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-pill border border-emerald-400/30 text-xs font-bold font-heading text-[#A8D86E] uppercase tracking-widest shadow-lg reveal-left">
                  <Sparkles className="w-4 h-4 text-[#A8D86E] animate-bounce" />
                  <span>{slide.tag}</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-[1.08] text-white max-w-3xl reveal-left delay-100">
                  {slide.title}
                </h1>

                <p className="text-emerald-100/90 text-base sm:text-xl font-normal leading-relaxed max-w-2xl reveal-right delay-200">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4 reveal-up delay-300">
                  <button
                    onClick={slide.buttonAction}
                    className="bg-gradient-to-r from-[#2E7D5B] to-[#12372A] hover:from-[#358e67] hover:to-[#174636] text-white font-heading font-extrabold px-9 py-4 rounded-full text-sm tracking-wide shadow-2xl hover:shadow-emerald-500/30 transition duration-300 flex items-center gap-3 cursor-pointer group hover:scale-105 border border-emerald-400/40"
                  >
                    <ShoppingBag className="w-5 h-5 text-[#A8D86E]" />
                    <span>{slide.buttonText}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}

        {/* Floating Glassmorphism Hero Cards */}
        <div className="hidden lg:flex absolute top-1/3 right-12 z-30 flex-col gap-4">
          <div className="glass-card-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-float">
            <span className="text-2xl">🌱</span>
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#A8D86E]">Fresh Today</span>
              <span className="text-xs font-bold font-heading">Locally Harvested</span>
            </div>
          </div>

          <div className="glass-card-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-float-delayed">
            <span className="text-2xl">🚚</span>
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#A8D86E]">Fast Express</span>
              <span className="text-xs font-bold font-heading">Farm → Doorstep</span>
            </div>
          </div>

          <div className="glass-card-dark text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-float-slow">
            <span className="text-2xl">👨‍🌾</span>
            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#A8D86E]">500+ Farmers</span>
              <span className="text-xs font-bold font-heading">Growing for you</span>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Controls & Progress */}
        <div className="absolute bottom-8 left-6 sm:left-16 right-6 sm:right-16 z-30 flex flex-wrap items-center justify-between gap-4 glass-card-dark px-6 py-3.5 rounded-full border border-white/20">
          
          <div className="flex items-center gap-3 font-heading font-extrabold text-sm text-white">
            <span className="text-[#A8D86E]">0{currentSlide + 1}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/60">0{heroSlides.length}</span>
          </div>

          <div className="flex items-center gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  idx === currentSlide ? 'w-8 bg-[#A8D86E]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. SECTION 2 — WELCOME / FARM STORY (FULL-WIDTH SECTION)       */}
      {/* ------------------------------------------------------------- */}
      <section id="about" className="w-full bg-gradient-to-b from-[#F7F8F3] via-[#EAF3E5]/60 to-[#F7F8F3] py-20 border-b border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="bg-white rounded-[3rem] p-8 sm:p-14 border border-gray-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
            
            {/* Left Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EAF3E5] text-[#2E7D5B] text-xs font-bold font-heading uppercase tracking-widest border border-emerald-200 reveal-left">
                <Sprout className="w-4 h-4 text-[#2E7D5B]" /> Our Farming Mission
              </div>

              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B2118] tracking-tight leading-tight reveal-left delay-100">
                Good Food Starts With <br />
                <span className="bg-gradient-to-r from-[#2E7D5B] to-[#12372A] bg-clip-text text-transparent">
                  Good Farming.
                </span>
              </h2>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-normal reveal-right delay-200">
                Farm2Home was built to bridge the gap between rural agricultural producers and urban households. We deliver fresh organic vegetables, fruits, and raw A2 milk directly from fields to your kitchen—ensuring maximum nutrition and 100% fair earnings for local farming families.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-[#0B2118] reveal-up delay-300">
                <div>
                  <span className="text-2xl font-heading font-extrabold block text-[#2E7D5B]">100%</span>
                  <span className="text-xs text-gray-500 font-medium">Traceable Produce</span>
                </div>
                <div>
                  <span className="text-2xl font-heading font-extrabold block text-[#2E7D5B]">0%</span>
                  <span className="text-xs text-gray-500 font-medium">Middleman Markups</span>
                </div>
                <div>
                  <span className="text-2xl font-heading font-extrabold block text-[#2E7D5B]">Same-Day</span>
                  <span className="text-xs text-gray-500 font-medium">Field Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Image Frame with Cute Badges */}
            <div className="lg:col-span-5 relative flex justify-center reveal-scale delay-200">
              <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-[#EAF3E5] shadow-2xl w-full h-[380px]">
                <img
                  src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80"
                  alt="Farmer carrying fresh harvest"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2118]/80 via-transparent to-transparent" />
              </div>

              {/* Cute Badges */}
              <div className="absolute -top-4 -left-4 glass-card px-4 py-2.5 rounded-2xl shadow-lg text-xs font-bold font-heading text-[#0B2118] flex items-center gap-2 border border-white/80 animate-float">
                🌱 Freshly Harvested
              </div>
              <div className="absolute -bottom-4 -right-4 glass-card px-4 py-2.5 rounded-2xl shadow-lg text-xs font-bold font-heading text-[#0B2118] flex items-center gap-2 border border-white/80 animate-float-delayed">
                👨‍🌾 Local Farmers
              </div>
              <div className="absolute top-1/2 -right-6 -translate-y-1/2 glass-card px-3.5 py-2 rounded-2xl shadow-lg text-xs font-bold font-heading text-[#0B2118] flex items-center gap-1.5 border border-white/80 animate-float-slow">
                ❤️ Grown With Care
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. SECTION 3 — PRODUCT CATEGORIES ("What's Fresh Today?")     */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full bg-[#F7F8F3] py-20 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 reveal-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D5B] bg-[#EAF3E5] px-3.5 py-1 rounded-full border border-emerald-200">
                Organic Selection
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B2118] tracking-tight">
                What's Fresh Today?
              </h2>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#2E7D5B] hover:text-[#12372A] cursor-pointer group reveal-right"
            >
              <span>View All Categories</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Vegetables',
                icon: '🥕',
                desc: 'Organic greens, vine tomatoes & root veggies',
                count: '150+ Items',
                image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=600&q=80',
                delay: 'delay-100'
              },
              {
                name: 'Fruits',
                icon: '🍎',
                desc: 'Handpicked seasonal apples, mangoes & berries',
                count: '90+ Items',
                image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=600&q=80',
                delay: 'delay-200'
              },
              {
                name: 'Dairy',
                icon: '🥛',
                desc: 'Raw A2 cow milk, fresh butter, paneer & curd',
                count: '40+ Items',
                image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=600&q=80',
                delay: 'delay-300'
              },
              {
                name: 'Farm Products',
                icon: '🌾',
                desc: 'Aromatic basmati rice, organic pulses & spices',
                count: '110+ Items',
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
                delay: 'delay-400'
              }
            ].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setActiveProductCategory(cat.name);
                  navigate('/products');
                }}
                className={`group relative h-80 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col justify-end p-6 border border-white/40 hover:-translate-y-2 reveal-up ${cat.delay}`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2118]/90 via-[#0B2118]/40 to-transparent group-hover:from-[#0B2118]/95 transition" />

                <div className="relative z-10 space-y-2 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{cat.icon}</span>
                    <span className="text-xs font-semibold glass-pill px-3 py-1 rounded-full border border-white/20">
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="text-2xl font-heading font-extrabold text-white group-hover:text-[#A8D86E] transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-300 line-clamp-2">{cat.desc}</p>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#A8D86E]">
                    <span>Explore Harvest</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-[#2E7D5B] group-hover:text-white flex items-center justify-center transition">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. SECTION 4 — FRESH PRODUCTS ("Straight From The Farm")      */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full bg-[#EAF3E5]/40 py-20 border-b border-emerald-100/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
            <div className="space-y-2 reveal-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D5B] bg-white px-3.5 py-1 rounded-full border border-emerald-200">
                Direct Field Produce
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B2118] tracking-tight">
                Straight From The Farm
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 reveal-right">
              {['All', 'Vegetables', 'Fruits', 'Dairy', 'Farm Products'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveProductCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold font-heading transition cursor-pointer ${
                    activeProductCategory === cat
                      ? 'bg-[#12372A] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-[#EAF3E5] border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {loadingProducts ? (
            <div className="text-center py-20 text-[#2E7D5B] font-bold">
              Loading Fresh Harvest...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProductsShowcase.slice(0, 6).map((product, idx) => {
                const prodId = product._id || product.id;
                const price = product.pricePerUnit ?? product.price ?? 0;
                const unit = product.unit || 'kg';
                const sellerName = product.seller?.name || product.farmer?.name || 'Local Farmer';
                const isWishlisted = !!wishlist[prodId];
                const imageSrc = product.images?.[0] && product.images[0] !== 'default-product.jpg'
                  ? product.images[0]
                  : product.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80';

                const delayClass = `delay-${((idx % 3) + 1) * 100}`;

                return (
                  <div
                    key={prodId}
                    className={`bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5 reveal-up ${delayClass}`}
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative h-56 bg-emerald-50 overflow-hidden">
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        
                        <button
                          onClick={() => toggleWishlist(prodId)}
                          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition shadow-md cursor-pointer ${
                            isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
                          }`}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>

                        <span className="absolute bottom-4 left-4 glass-pill text-[#0B2118] text-[11px] font-bold px-3 py-1 rounded-full border border-white/60">
                          {product.category || 'Organic'}
                        </span>
                      </div>

                      {/* Product Meta */}
                      <div className="p-6 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-heading font-extrabold text-[#0B2118] text-lg group-hover:text-[#2E7D5B] transition">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating || 4.9}</span>
                          </div>
                        </div>

                        <p className="text-gray-500 text-xs line-clamp-2">
                          {product.description || 'Harvested fresh from verified local fields upon order placement.'}
                        </p>

                        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                          <span className="font-medium text-gray-700">👨‍🌾 {sellerName}</span>
                          <span className="text-[#2E7D5B] font-semibold bg-[#EAF3E5] px-2.5 py-0.5 rounded-md">
                            In Stock
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Button */}
                    <div className="p-6 pt-0 flex items-center justify-between border-t border-gray-100 mt-2">
                      <div>
                        <span className="text-2xl font-heading font-extrabold text-[#0B2118]">₹{price}</span>
                        <span className="text-xs text-gray-500"> / {unit}</span>
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={cartLoading[prodId]}
                        className="bg-[#12372A] hover:bg-[#2E7D5B] text-white font-heading font-bold px-5 py-2.5 rounded-full text-xs flex items-center gap-2 transition duration-200 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {cartLoading[prodId] ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <ShoppingBag className="w-4 h-4" />
                        )}
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. SECTION 5 — SUBSCRIPTIONS ("Freshness, On Repeat.")        */}
      {/* ------------------------------------------------------------- */}
      <section id="subscriptions" className="w-full bg-gradient-to-br from-[#EAF3E5] via-[#F7F8F3] to-[#EAF3E5] py-24 border-b border-emerald-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto reveal-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D5B] bg-white px-3.5 py-1 rounded-full border border-emerald-200 shadow-sm">
              Recurring Harvest
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B2118] tracking-tight">
              Freshness, On Repeat.
            </h2>

            <p className="text-gray-600 text-base sm:text-lg">
              Choose how often you want your favorite farm products delivered. Pause, modify, or cancel anytime.
            </p>

            {/* Selector Pills */}
            <div className="pt-4 flex justify-center">
              <div className="bg-white p-1.5 rounded-full inline-flex gap-1 border border-emerald-200 shadow-md">
                {[
                  { id: 'daily', label: 'DAILY' },
                  { id: 'weekly', label: 'WEEKLY' },
                  { id: 'monthly', label: 'MONTHLY' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubscriptionPlan(tab.id)}
                    className={`px-8 py-3 rounded-full text-xs font-heading font-extrabold transition cursor-pointer ${
                      activeSubscriptionPlan === tab.id
                        ? 'bg-gradient-to-r from-[#2E7D5B] to-[#12372A] text-white shadow-lg scale-105'
                        : 'text-gray-600 hover:text-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subscription Highlight & Basket Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Plan Info Card (Column 1-7) */}
            <div className="lg:col-span-7 reveal-left delay-100">
              {subscriptionPlans.map((plan) => {
                if (plan.id !== activeSubscriptionPlan) return null;

                return (
                  <div
                    key={plan.id}
                    className="bg-white rounded-3xl p-8 border border-emerald-300 shadow-2xl space-y-6 relative"
                  >
                    {plan.popular && (
                      <span className="absolute top-6 right-6 bg-gradient-to-r from-[#2E7D5B] to-[#12372A] text-white text-[10px] font-extrabold font-heading px-4 py-1 rounded-full uppercase shadow-md">
                        ⭐ MOST POPULAR
                      </span>
                    )}

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#2E7D5B] uppercase tracking-widest">
                        {plan.badgeText}
                      </span>
                      <h3 className="text-3xl font-heading font-extrabold text-[#0B2118]">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#EAF3E5]/60 border border-emerald-200 flex justify-between items-baseline">
                      <div>
                        <span className="text-4xl font-heading font-extrabold text-[#12372A]">{plan.price}</span>
                        <span className="text-xs text-gray-600 font-semibold"> / {plan.period}</span>
                      </div>
                      <span className="text-xs font-bold text-[#2E7D5B] bg-white px-3 py-1 rounded-full border border-emerald-300">
                        {plan.savings}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 font-heading">
                        Products Included:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {plan.itemsIncluded.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                            <CheckCircle2 className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSubscriptionModal(plan)}
                      className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#2E7D5B] to-[#12372A] hover:from-[#358e67] hover:to-[#174636] text-white font-heading font-extrabold text-sm tracking-wide shadow-xl transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Subscribe {plan.frequency.toUpperCase()}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Basket Image & Badges (Column 8-12) */}
            <div className="lg:col-span-5 relative flex justify-center reveal-right delay-200">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#0B2118] w-full h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80"
                  alt="Farm Fresh Basket"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2118]/80 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 glass-card px-3.5 py-2 rounded-2xl text-xs font-bold text-[#0B2118] border border-white/80 animate-float">
                  🌱 100% Fresh
                </div>
                <div className="absolute bottom-4 left-4 glass-card px-3.5 py-2 rounded-2xl text-xs font-bold text-[#0B2118] border border-white/80 animate-float-delayed">
                  🚚 Flexible Delivery
                </div>
                <div className="absolute top-4 right-4 glass-card px-3.5 py-2 rounded-2xl text-xs font-bold text-[#0B2118] border border-white/80 animate-float-slow">
                  💰 Save More
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. SECTION 6 — HOW SUBSCRIPTIONS WORK (CUTE 4-STEP FLOW)       */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full bg-white py-20 border-b border-gray-200/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto reveal-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D5B] bg-[#EAF3E5] px-3.5 py-1 rounded-full border border-emerald-200">
              Simple Step Process
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B2118]">
              How Subscriptions Work
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { step: '01', icon: '🛒', title: 'Choose Products', desc: 'Select organic produce or milk plans', delay: 'delay-100' },
              { step: '02', icon: '📅', title: 'Select Plan', desc: 'Choose Daily, Weekly, or Monthly', delay: 'delay-200' },
              { step: '03', icon: '⏰', title: 'Set Schedule', desc: 'Confirm delivery time & address', delay: 'delay-300' },
              { step: '04', icon: '🧺', title: 'Enjoy Freshness', desc: 'Arrives fresh to your door', delay: 'delay-400' }
            ].map((item, idx) => (
              <div key={idx} className={`bg-[#F7F8F3] p-6 rounded-3xl border border-gray-200 space-y-2 relative group hover:border-emerald-300 transition reveal-up ${item.delay}`}>
                <span className="text-4xl block mb-2">{item.icon}</span>
                <span className="text-2xl font-heading font-extrabold text-[#2E7D5B]">{item.step}</span>
                <h4 className="font-heading font-extrabold text-base text-[#0B2118]">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. SECTION 7 — EQUIPMENT RENTAL ("Power Your Farm.")          */}
      {/* ------------------------------------------------------------- */}
      <section id="rentals" className="w-full bg-gradient-to-br from-[#0B2118] via-[#12372A] to-[#071811] text-white py-24 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div className="space-y-2 reveal-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#A8D86E] glass-pill px-3.5 py-1 rounded-full border border-white/20">
                Machinery Marketplace
              </span>
              <h2 className="text-3xl sm:text-5xl font-heading font-extrabold tracking-tight">
                Power Your Farm.
              </h2>
              <p className="text-emerald-100/80 text-sm">
                Get the equipment you need without the cost of owning it.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 reveal-right">
              {['All', 'Tractors', 'Tillage', 'Planting', 'Harvesting', 'Irrigation'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveEquipmentCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-bold font-heading transition cursor-pointer ${
                    activeEquipmentCategory === cat
                      ? 'bg-[#A8D86E] text-[#0B2118] shadow-md'
                      : 'glass-pill text-white hover:bg-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Huge Featured Tractor Highlight */}
          {filteredEquipment[0] && (
            <div className="bg-[#0B2118]/80 rounded-3xl p-8 border border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center reveal-up">
              <div className="lg:col-span-7 relative h-72 sm:h-80 rounded-2xl overflow-hidden">
                <img
                  src={filteredEquipment[0].image}
                  alt={filteredEquipment[0].name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 glass-card-dark text-white px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                  FEATURED MACHINERY
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-bold text-[#A8D86E] uppercase tracking-widest">
                  {filteredEquipment[0].category}
                </span>
                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  {filteredEquipment[0].name}
                </h3>
                <p className="text-xs text-gray-300">{filteredEquipment[0].description}</p>
                
                <div className="flex justify-between items-baseline pt-2">
                  <span className="text-3xl font-heading font-extrabold text-[#A8D86E]">₹{filteredEquipment[0].priceDay} <span className="text-xs text-gray-300 font-normal">/ day</span></span>
                  <span className="text-xs text-emerald-200">👨‍🌾 Owner: {filteredEquipment[0].owner}</span>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setEquipmentModal(filteredEquipment[0])}
                    className="glass-pill hover:bg-white/20 text-white font-heading font-bold py-3 rounded-full text-xs transition cursor-pointer"
                  >
                    View Specs
                  </button>
                  <button
                    onClick={() => setEquipmentModal(filteredEquipment[0])}
                    className="bg-[#A8D86E] hover:bg-[#84cc16] text-[#0B2118] font-heading font-extrabold py-3 rounded-full text-xs transition cursor-pointer shadow-md"
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Surrounding Machinery Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEquipment.slice(1, 5).map((eq, idx) => (
              <div
                key={eq.id}
                className={`glass-card-dark rounded-3xl p-5 border border-white/10 flex flex-col justify-between space-y-3 reveal-up delay-${(idx + 1) * 100}`}
              >
                <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-900">
                  <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#A8D86E] uppercase">{eq.category}</span>
                  <h4 className="font-heading font-extrabold text-white text-base mt-0.5">{eq.name}</h4>
                  <p className="text-xs text-gray-400">👨‍🌾 {eq.owner}</p>
                </div>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-lg font-heading font-bold text-white">₹{eq.priceDay}/day</span>
                  <button
                    onClick={() => setEquipmentModal(eq)}
                    className="bg-[#A8D86E] text-[#0B2118] font-heading font-bold px-4 py-1.5 rounded-full text-xs"
                  >
                    Rent
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. SECTION 8 — FARMER COMMUNITY                               */}
      {/* ------------------------------------------------------------- */}
      <section id="farmers" className="w-full relative bg-[#0B2118] text-white py-24 border-b border-white/10 shadow-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1592417817098-8f3d6eb12765?auto=format&fit=crop&w=1600&q=80"
          alt="Farmer in field"
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2118] via-[#0B2118]/80 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
          <div className="max-w-2xl space-y-6">
            <span className="text-xs font-bold text-[#A8D86E] uppercase tracking-widest reveal-left">
              Community First
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold leading-tight reveal-left delay-100">
              Behind Every Fresh Meal <br />
              <span className="text-[#A8D86E]">Is A Farmer.</span>
            </h2>
            <p className="text-emerald-100/90 text-base leading-relaxed reveal-right delay-200">
              Join our growing community of local producers. Reach thousands of customers directly, sell your produce without commissions, and earn supplemental income through equipment rentals.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4 reveal-up delay-300">
              <button
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-[#2E7D5B] to-[#A8D86E] text-[#0B2118] font-heading font-extrabold px-8 py-4 rounded-full text-sm shadow-xl transition hover:scale-105 cursor-pointer"
              >
                Join as a Farmer
              </button>
            </div>

            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-center reveal-up delay-400">
              <div>
                <span className="block text-2xl font-extrabold text-[#A8D86E]">500+</span>
                <span className="text-xs text-gray-300">Local Farmers</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#A8D86E]">1K+</span>
                <span className="text-xs text-gray-300">Fresh Products</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-[#A8D86E]">5K+</span>
                <span className="text-xs text-gray-300">Happy Families</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. SECTION 9 — WHY CHOOSE US ("Why You'll Love Farm-to-Home") */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full bg-[#F7F8F3] py-20 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto reveal-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D5B] bg-[#EAF3E5] px-3.5 py-1 rounded-full border border-emerald-200">
              Platform Benefits
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B2118]">
              Why You'll Love Farm-to-Home
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🌱', title: 'Fresh & Local', desc: 'Harvested on demand directly from organic local fields.', delay: 'delay-100' },
              { icon: '👨‍🌾', title: 'Direct From Farmers', desc: '0% middleman commission markups so producers thrive.', delay: 'delay-200' },
              { icon: '🚚', title: 'Home Delivery', desc: 'Temperature-controlled express logistics ensure crisp quality.', delay: 'delay-300' },
              { icon: '🔄', title: 'Flexible Subscriptions', desc: 'Pause, edit, or customize daily milk & weekly produce plans.', delay: 'delay-400' },
              { icon: '🚜', title: 'Equipment Rentals', desc: 'Rent modern tractors & machinery at low daily rates.', delay: 'delay-500' },
              { icon: '❤️', title: 'Support Local Farmers', desc: 'Directly boost rural farming families and local economies.', delay: 'delay-600' }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 space-y-4 hover:-translate-y-1.5 reveal-up ${item.delay}`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EAF3E5] text-2xl flex items-center justify-center font-bold">
                  {item.icon}
                </div>
                <h3 className="text-xl font-heading font-bold text-[#0B2118]">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. SECTION 10 — FARM TO HOME JOURNEY (ANIMATED PATHWAY)     */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full bg-[#0B2118] text-white py-20 border-b border-white/10 shadow-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          
          <div className="space-y-3 text-center reveal-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#A8D86E] glass-pill px-3.5 py-1 rounded-full border border-white/20">
              Interactive Pathway
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold">
              The Farm-to-Home Journey
            </h2>
          </div>

          {/* Truck Animated Pathway */}
          <div className="relative py-8 overflow-hidden reveal-scale">
            <div className="h-2 bg-emerald-900 rounded-full w-full relative mb-8">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 text-3xl animate-drive-truck">
                🚚
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { icon: '🌱', step: 'FARM', desc: 'Cultivated with organic care' },
                { icon: '🌾', step: 'HARVEST', desc: 'Picked fresh on demand' },
                { icon: '📦', step: 'PACK', desc: 'Eco-friendly container packaging' },
                { icon: '🚚', step: 'DELIVERY', desc: 'Express temperature transport' },
                { icon: '🏠', step: 'HOME', desc: 'Enjoyed at your family table' }
              ].map((stage, i) => (
                <div key={i} className="glass-card-dark p-4 rounded-2xl border border-white/10 text-center space-y-1">
                  <span className="text-2xl block">{stage.icon}</span>
                  <span className="font-heading font-extrabold text-xs text-[#A8D86E] block">{stage.step}</span>
                  <span className="text-[11px] text-gray-300 block">{stage.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 11. SECTION 11 — TESTIMONIALS                                 */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full bg-gradient-to-b from-[#F7F8F3] via-[#EAF3E5]/40 to-[#F7F8F3] py-20 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto reveal-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D5B] bg-[#EAF3E5] px-3.5 py-1 rounded-full border border-emerald-200">
              Real Reviews
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B2118]">
              Loved by Buyers & Farmers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md space-y-6 relative reveal-left delay-100">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-gray-700 text-base italic font-medium leading-relaxed">
                "It feels like having a farm right at our doorstep. Everything arrives insanely fresh, and knowing we support local farmers directly makes every meal special."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  alt="Anjali Sharma"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#2E7D5B]"
                />
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-[#0B2118]">Anjali Sharma</h4>
                  <p className="text-xs text-gray-500">Kochi, Kerala • Verified Buyer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-md space-y-6 relative reveal-right delay-200">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-gray-700 text-base italic font-medium leading-relaxed">
                "Selling directly removed commission traps and boosted my farm revenue by 35%. Renting out my rotavator also adds steady monthly income."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Ramesh Patel"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#2E7D5B]"
                />
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-[#0B2118]">Ramesh Patel</h4>
                  <p className="text-xs text-gray-500">Kottayam, Kerala • Organic Producer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 12. SECTION 12 — INTERACTIVE LOCAL FARMERS MAP MOCKUP          */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full bg-white py-20 border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto reveal-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D5B] bg-[#EAF3E5] px-3.5 py-1 rounded-full border border-emerald-200">
              Local Network
            </span>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B2118]">
              Farmers Growing Near You
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Map Farmers Pins List */}
            <div className="lg:col-span-5 space-y-3 reveal-left delay-100">
              {mapFarmers.map((f, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveMapPin(idx)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-center gap-4 ${
                    activeMapPin === idx
                      ? 'bg-[#EAF3E5] border-[#2E7D5B] shadow-md scale-102'
                      : 'bg-[#F7F8F3] border-gray-200 hover:bg-white'
                  }`}
                >
                  <img src={f.avatar} alt={f.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#2E7D5B]" />
                  <div className="flex-1">
                    <h4 className="font-heading font-extrabold text-sm text-[#0B2118]">{f.name}</h4>
                    <p className="text-xs text-[#2E7D5B] font-semibold">{f.region}</p>
                    <p className="text-[11px] text-gray-500">{f.produce}</p>
                  </div>
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{f.rating}</span>
                </div>
              ))}
            </div>

            {/* Stylized Map View Mockup */}
            <div className="lg:col-span-7 relative h-[360px] rounded-3xl overflow-hidden bg-[#0B2118] border border-white/20 p-6 flex flex-col justify-between text-white reveal-right delay-200">
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
                alt="Kerala Farm Map Region"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B2118] via-transparent to-[#0B2118]/60" />

              <div className="relative z-10 flex justify-between items-center">
                <span className="glass-pill px-3.5 py-1 rounded-full text-xs font-bold text-[#A8D86E]">📍 Verified Farm Hub</span>
                <span className="text-xs font-semibold text-gray-300">Live Location Network</span>
              </div>

              <div className="relative z-10 glass-card-dark p-6 rounded-2xl border border-white/20 max-w-md space-y-2">
                <div className="flex items-center gap-3">
                  <img src={mapFarmers[activeMapPin].avatar} alt="" className="w-10 h-10 rounded-full border-2 border-[#A8D86E]" />
                  <div>
                    <h5 className="font-heading font-bold text-sm text-white">{mapFarmers[activeMapPin].name}</h5>
                    <span className="text-xs text-[#A8D86E]">{mapFarmers[activeMapPin].region}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300">Specializes in {mapFarmers[activeMapPin].produce} harvested fresh on demand.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 13. SECTION 13 — FINAL CTA ("Bring The Farm Home.")          */}
      {/* ------------------------------------------------------------- */}
      <section className="w-full relative bg-[#0B2118] text-white py-24 border-b border-white/10 shadow-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80"
          alt="Golden Hour Farm"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B2118] via-[#0B2118]/90 to-[#0B2118]" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10 text-center space-y-8">
          <h2 className="text-4xl sm:text-6xl font-heading font-extrabold tracking-tight reveal-up">
            Bring The Farm Home.
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base font-normal max-w-2xl mx-auto reveal-up delay-100">
            Start ordering organic produce, set up your recurring milk & vegetable subscriptions, or list your equipment for rental today.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4 reveal-up delay-200">
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-[#2E7D5B] to-[#A8D86E] text-[#0B2118] font-heading font-extrabold px-9 py-4 rounded-full text-sm shadow-xl transition hover:scale-105 cursor-pointer"
            >
              Shop Fresh Products
            </button>
            <button
              onClick={() => scrollToSection('rentals')}
              className="glass-pill text-white border border-white/30 font-heading font-bold px-8 py-4 rounded-full text-sm shadow-lg transition hover:scale-105 cursor-pointer"
            >
              Explore Rentals
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* FOOTER                                                        */}
      {/* ------------------------------------------------------------- */}
      <footer className="w-full bg-[#071811] text-gray-400 py-16 border-t border-white/10 text-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 text-white font-heading font-extrabold text-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2E7D5B] to-[#A8D86E] flex items-center justify-center text-[#0B2118]">
                  <Leaf className="w-4 h-4" />
                </div>
                <span>Farm2Home</span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                Connecting local agricultural producers directly with urban households. Organic produce, daily milk subscriptions, and farm equipment rental marketplace.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm">Quick Links</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/products')} className="hover:text-[#A8D86E] transition cursor-pointer">Products Store</button></li>
                <li><button onClick={() => scrollToSection('subscriptions')} className="hover:text-[#A8D86E] transition cursor-pointer">Subscriptions</button></li>
                <li><button onClick={() => scrollToSection('rentals')} className="hover:text-[#A8D86E] transition cursor-pointer">Equipment Rentals</button></li>
                <li><button onClick={() => navigate('/register')} className="hover:text-[#A8D86E] transition cursor-pointer">Farmer Registration</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm">Produce Categories</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate('/products')} className="hover:text-[#A8D86E] transition cursor-pointer">Organic Vegetables</button></li>
                <li><button onClick={() => navigate('/products')} className="hover:text-[#A8D86E] transition cursor-pointer">Seasonal Fruits</button></li>
                <li><button onClick={() => navigate('/products')} className="hover:text-[#A8D86E] transition cursor-pointer">Raw A2 Cow Milk</button></li>
                <li><button onClick={() => navigate('/products')} className="hover:text-[#A8D86E] transition cursor-pointer">Farm Grains</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-heading font-bold text-white text-sm">Contact Support</h4>
              <ul className="space-y-2 text-xs">
                <li>Kottayam, Kerala, India</li>
                <li>+91 98765 43210</li>
                <li>support@farm2home.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500">
            <p>© {new Date().getFullYear()} Farm2Home Agriculture Marketplace. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------- */}
      {/* MODAL: SUBSCRIPTION CONFIRMATION                              */}
      {/* ------------------------------------------------------------- */}
      {subscriptionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSubscriptionModal(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-[#2E7D5B] bg-[#EAF3E5] px-2.5 py-1 rounded-full uppercase tracking-wider">
                {subscriptionModal.frequency} Subscription
              </span>
              <h3 className="text-2xl font-heading font-extrabold text-[#0B2118]">{subscriptionModal.name}</h3>
              <p className="text-xs text-gray-500">{subscriptionModal.description}</p>
            </div>

            <div className="p-4 bg-[#EAF3E5]/60 rounded-2xl border border-emerald-200/80 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-heading font-extrabold text-[#12372A]">{subscriptionModal.price}</span>
                <span className="text-xs text-[#2E7D5B] font-semibold">{subscriptionModal.period}</span>
              </div>
              <p className="text-xs text-[#2E7D5B]">{subscriptionModal.billing}</p>
            </div>

            <form onSubmit={handleSubscriptionSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  placeholder="House no, Street, City, Pincode"
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E7D5B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E7D5B] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#12372A] hover:bg-[#2E7D5B] text-white font-heading font-bold py-3.5 rounded-full transition cursor-pointer text-xs shadow-md"
                >
                  Confirm Subscription Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL: EQUIPMENT RENTAL BOOKING & SPECS                       */}
      {/* ------------------------------------------------------------- */}
      {equipmentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEquipmentModal(null)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4 items-start">
              <img
                src={equipmentModal.image}
                alt={equipmentModal.name}
                className="w-24 h-24 rounded-2xl object-cover border shrink-0"
              />
              <div>
                <span className="text-[9px] font-bold text-[#2E7D5B] bg-[#EAF3E5] px-2.5 py-0.5 rounded-md uppercase">
                  {equipmentModal.category}
                </span>
                <h3 className="text-xl font-heading font-extrabold text-[#0B2118] mt-1">{equipmentModal.name}</h3>
                <p className="text-xs text-gray-500">{equipmentModal.specs}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-gray-600">Daily Rental:</span>
                <span className="font-bold text-[#0B2118]">₹{equipmentModal.priceDay} / day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Discounted Rate:</span>
                <span className="font-bold text-[#2E7D5B]">₹{equipmentModal.priceWeek} / week</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-600">Owner Contact:</span>
                <span className="font-semibold text-gray-900">👨‍🌾 {equipmentModal.owner} ({equipmentModal.location})</span>
              </div>
            </div>

            <form onSubmit={handleEquipmentBookSubmit} className="space-y-4 text-xs font-medium">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Rental Start Date</label>
                  <input
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E7D5B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    defaultValue="2"
                    required
                    className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E7D5B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Delivery/Pickup Location</label>
                <input
                  type="text"
                  required
                  placeholder="Enter farm location or district"
                  className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#2E7D5B] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#12372A] hover:bg-[#2E7D5B] text-white font-heading font-bold py-3.5 rounded-full transition cursor-pointer text-xs shadow-md"
                >
                  Submit Rental Booking Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
