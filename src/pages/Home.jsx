import React from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      name: 'Standard Basket',
      price: '₹1,499',
      period: 'per month',
      description:
        'Essential seasonal vegetables delivered weekly to your doorstep.',
      features: [
        'Weekly fresh vegetable box (5-7 kg)',
        '100% Organically grown',
        'Directly from local farmers',
        'Free doorstep delivery',
        'Cancel or pause anytime',
      ],
      popular: false,
    },
    {
      name: 'Family Harvest Pass',
      price: '₹2,799',
      period: 'per month',
      description: 'Comprehensive farm produce box for a family of 4+ members.',
      features: [
        'Weekly fresh produce box (12-15 kg)',
        'Assorted fruits, vegetables & greens',
        'Priority early-morning delivery',
        'Customizable item preferences',
        'Exclusive farmer market discounts',
        'Dedicated customer support',
      ],
      popular: true,
    },
    {
      name: 'Farmer Partner Pass',
      price: '₹499',
      period: 'per month',
      description:
        'Empowering farmers with direct store listing and analytics tools.',
      features: [
        'Zero-commission sales channel',
        'Unlimited product listings',
        'Real-time inventory management',
        'Direct payout to bank account',
        'Logistics & delivery support',
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      quote:
        'Farm2Home completely transformed how our family buys produce. Everything is incredibly fresh, and we love supporting local farmers directly.',
      name: 'Anjali Sharma',
      role: 'Organic Food Enthusiast',
      rating: 5,
    },
    {
      quote:
        'Selling directly through this platform cut out middlemen and increased my farm revenue by 30%. The dashboard is super easy to manage.',
      name: 'Ramesh Patel',
      role: 'Organic Vegetable Farmer',
      rating: 5,
    },
    {
      quote:
        'The weekly subscription box is hassle-free. Deliveries are always on time and the produce stays fresh much longer than store-bought ones.',
      name: 'Vikram Nair',
      role: 'Subscriber',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 md:p-16 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-700/50 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide text-emerald-200 border border-emerald-500/30">
            <Sprout className="w-4 h-4" /> Fresh, Fair & Sustainable
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            Connecting Local Farmers Directly to Your Kitchen
          </h1>
          <p className="text-emerald-100 text-lg md:text-xl font-light">
            Skip the middleman. Enjoy fresh, ethically harvested agricultural
            produce delivered straight from verified local fields to your home.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => navigate('/products')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition flex items-center gap-2 cursor-pointer"
            >
              Explore Products
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-7 py-3.5 rounded-xl backdrop-blur-md transition cursor-pointer"
            >
              Join as a Farmer
            </button>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Feature Highlights / Value Proposition */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            100% Direct & Transparent
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Know exactly who grew your food. Fair pricing for consumers and
            maximum returns for local producers.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Farm Fresh Logistics
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Harvested on demand to ensure peak nutrition, maximum flavor, and
            extended shelf life.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Empowering Farmers
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Eliminating traditional supply chain commission traps to boost rural
            farmer livelihood.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-emerald-600 font-bold text-sm tracking-wider uppercase">
            About Our Mission
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Bridging the gap between rural farms and urban dining tables.
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Farm2Home was built to decentralize food distribution. By giving
            farmers a direct digital marketplace and buyers guaranteed
            farm-fresh produce, we create a sustainable ecosystem where quality
            meets fairness.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-1 border-l-4 border-emerald-500 pl-4">
              <span className="text-2xl font-black text-gray-800">500+</span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Verified Farmers
              </p>
            </div>
            <div className="space-y-1 border-l-4 border-emerald-500 pl-4">
              <span className="text-2xl font-black text-gray-800">10,000+</span>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Happy Customers
              </p>
            </div>
          </div>
        </div>

        <div className="relative bg-emerald-50 rounded-2xl p-8 flex items-center justify-center min-h-[320px]">
          <div className="text-center space-y-4">
            <div className="inline-flex p-4 bg-white rounded-full shadow-md text-emerald-600">
              <Users className="w-12 h-12" />
            </div>
            <h4 className="text-xl font-bold text-gray-800">
              Community First Marketplace
            </h4>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Supporting sustainable agriculture, reducing food miles, and
              building resilient local food systems.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-emerald-600 font-bold text-sm tracking-wider uppercase">
            Subscription Plans
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Subscribe & Get Fresh Deliveries Automatically
          </h2>
          <p className="text-gray-600">
            Choose a plan that fits your household needs or farm operations.
            Pause or cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subscriptionPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-8 border flex flex-col justify-between transition relative ${
                plan.popular
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {plan.description}
                  </p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>

                <ul className="space-y-3 pt-2">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => navigate('/products')}
                className={`w-full mt-8 py-3 px-4 rounded-xl font-semibold transition cursor-pointer ${
                  plan.popular
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-emerald-600 font-bold text-sm tracking-wider uppercase">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Loved by Buyers and Farmers Alike
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  "{item.quote}"
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="bg-emerald-600 rounded-3xl p-8 md:p-12 text-center text-white space-y-6 shadow-lg">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Experience Farm-Fresh Quality?
        </h2>
        <p className="text-emerald-100 max-w-xl mx-auto text-sm md:text-base">
          Browse our organic marketplace today or sign up to start selling
          produce directly to thousands of households.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <button
            onClick={() => navigate('/products')}
            className="bg-white text-emerald-800 font-bold px-8 py-3 rounded-xl hover:bg-emerald-50 transition shadow-md cursor-pointer"
          >
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
