import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Truck,
  Check,
  Star,
  Users,
  TrendingUp,
  Leaf,
  Award,
  Heart,
  MapPin,
  PhoneCall,
  Quote,
  Settings,
  Egg,
} from 'lucide-react';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const subscriptionPlans = [
    {
      name: 'Standard Basket',
      price: '₹1,499',
      period: '/month',
      description:
        'Essential seasonal vegetables delivered weekly to your doorstep.',
      features: [
        'Weekly fresh vegetable box (5-7 kg)',
        '100% Organically grown',
        'Directly from local farmers',
        'Free doorstep delivery',
      ],
      popular: false,
    },
    {
      name: 'Family Harvest',
      price: '₹2,799',
      period: '/month',
      description: 'Comprehensive farm produce box for a family of 4+ members.',
      features: [
        'Weekly fresh produce box (12-15 kg)',
        'Assorted fruits, vegetables & greens',
        'Priority early-morning delivery',
        'Customizable item preferences',
      ],
      popular: true,
    },
    {
      name: 'Farmer Partner',
      price: '₹499',
      period: '/month',
      description:
        'Empowering farmers with direct store listing and analytics tools.',
      features: [
        'Zero-commission sales channel',
        'Unlimited product listings',
        'Real-time inventory management',
        'Direct payout to bank account',
      ],
      popular: false,
    },
  ];

  const testimonials = [
    {
      quote:
        'Farm2Home completely transformed how our family buys produce. Everything is incredibly fresh, and we love supporting local farmers directly.',
      name: 'Anjali Sharma',
      role: 'Organic Food Enthusiast, Delhi',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    },
    {
      quote:
        'Selling directly through this platform cut out middlemen and increased my farm revenue by 30%. The dashboard is super easy to manage.',
      name: 'Ramesh Patel',
      role: 'Organic Vegetable Farmer, Gujarat',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    {
      quote:
        'The weekly subscription box is hassle-free. Deliveries are always on time and the produce stays fresh much longer than store-bought ones.',
      name: 'Vikram Nair',
      role: 'Subscriber, Mumbai',
      rating: 5,
      image:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
  ];

  return (
    <div className="home-wrapper">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-split">
        <div className="hero-text-side">
          <span className="section-tag">100% Organic & Farm Fresh</span>
          <h1 className="hero-main-title">
            Raised With Care,
            <br />
            Delivered With Quality
          </h1>
          <p className="hero-desc">
            Farm2Home is committed to producing high-quality agricultural
            products while maintaining the highest standards of sustainability
            and fairness. Skip the middleman and taste the difference.
          </p>
          <div className="hero-buttons">
            <button className="btn-green" onClick={() => navigate('/products')}>
              EXPLORE PRODUCTS
            </button>
            <button
              className="btn-outline"
              onClick={() => navigate('/register')}
            >
              JOIN AS A FARMER
            </button>
          </div>
        </div>
        <div className="hero-image-side"></div>
      </section>

      {/* ===== HERO FEATURES BAR ===== */}
      <section className="hero-features-bar">
        <div className="hero-feature-item">
          <ShieldCheck className="hero-feature-icon" size={28} />
          <span className="hero-feature-title">100% Direct</span>
          <span className="hero-feature-sub">Fair pricing for all</span>
        </div>
        <div className="hero-feature-item">
          <Truck className="hero-feature-icon" size={28} />
          <span className="hero-feature-title">Farm Fresh</span>
          <span className="hero-feature-sub">Harvested on demand</span>
        </div>
        <div className="hero-feature-item">
          <TrendingUp className="hero-feature-icon" size={28} />
          <span className="hero-feature-title">Empowering</span>
          <span className="hero-feature-sub">Max returns for farmers</span>
        </div>
        <div className="hero-feature-item">
          <Leaf className="hero-feature-icon" size={28} />
          <span className="hero-feature-title">Sustainable</span>
          <span className="hero-feature-sub">Eco-friendly practices</span>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="container about-split">
        <div>
          <span className="section-tag">About Us</span>
          <h2 className="section-title">
            A Network Built on Trust & Transparency
          </h2>
          <p className="hero-desc" style={{ maxWidth: '100%' }}>
            Farm2Home was built to decentralize food distribution. By giving
            farmers a direct digital marketplace and buyers guaranteed
            farm-fresh produce, we create a sustainable ecosystem where quality
            meets fairness.
          </p>

          <ul className="about-list">
            <li>
              <Check className="about-list-icon" size={18} /> Locally owned &
              operated network
            </li>
            <li>
              <Check className="about-list-icon" size={18} /> Focused on
              quality, health & hygiene
            </li>
            <li>
              <Check className="about-list-icon" size={18} /> Direct digital
              marketplace for farmers
            </li>
            <li>
              <Check className="about-list-icon" size={18} /> Dedicated to
              customer satisfaction
            </li>
          </ul>

          <button className="btn-green" onClick={() => navigate('/register')}>
            LEARN MORE ABOUT US
          </button>
        </div>

        <div className="about-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?w=800&h=600&fit=crop"
            alt="Farm landscape"
            className="about-img"
          />
          <div className="about-stats-box">
            <div className="stat-item">
              <Award className="stat-icon" size={24} />
              <span className="stat-number">500+</span>
              <span className="stat-label">Verified Farmers</span>
            </div>
            <div className="stat-item">
              <Users className="stat-icon" size={24} />
              <span className="stat-number">10K+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-item">
              <ShieldCheck className="stat-icon" size={24} />
              <span className="stat-number">100%</span>
              <span className="stat-label">Quality Assured</span>
            </div>
            <div className="stat-item">
              <MapPin className="stat-icon" size={24} />
              <span className="stat-number">INDIA</span>
              <span className="stat-label">Locally Sourced</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUBSCRIPTIONS / PRODUCTS SECTION ===== */}
      <section
        className="products-section"
        style={{ backgroundColor: 'white' }}
      >
        <div className="container">
          <span className="section-tag">Our Plans</span>
          <h2 className="section-title">Premium Subscription Boxes</h2>

          <div className="products-grid">
            {subscriptionPlans.map((plan, index) => (
              <div className="product-card" key={index}>
                <div className="product-img-wrapper">
                  <img
                    src={
                      index === 0
                        ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop'
                        : index === 1
                          ? 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&h=400&fit=crop'
                          : 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=400&fit=crop'
                    }
                    alt={plan.name}
                  />
                  <div className="product-icon-badge">
                    {index === 0 ? (
                      <Leaf size={20} />
                    ) : index === 1 ? (
                      <Heart size={20} />
                    ) : (
                      <Sprout size={20} />
                    )}
                  </div>
                </div>
                <div className="product-body">
                  <h3 className="product-name">{plan.name}</h3>
                  <div className="product-price">
                    {plan.price}{' '}
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        fontWeight: 'normal',
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: '#6b7280',
                      marginBottom: '1rem',
                    }}
                  >
                    {plan.description}
                  </p>

                  <ul className="product-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <Check size={14} /> {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="product-btn"
                    onClick={() => navigate('/products')}
                  >
                    SUBSCRIBE NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US BANNER ===== */}
      <section className="why-choose-banner">
        <div className="container why-choose-inner">
          <div className="why-item">
            <Leaf className="why-icon" size={28} />
            <h4 className="why-title">Natural Nutrition</h4>
            <p className="why-desc">
              We use high-quality, organic farming practices to ensure healthy
              growth and great taste.
            </p>
          </div>
          <div className="why-item">
            <ShieldCheck className="why-icon" size={28} />
            <h4 className="why-title">Strict Hygiene</h4>
            <p className="why-desc">
              Clean, sanitized, and well-maintained packing environments for
              your safety.
            </p>
          </div>
          <div className="why-item">
            <Truck className="why-icon" size={28} />
            <h4 className="why-title">Reliable Delivery</h4>
            <p className="why-desc">
              On-time delivery across the country with care and responsibility.
            </p>
          </div>
          <div className="why-item">
            <Users className="why-icon" size={28} />
            <h4 className="why-title">Customer Focused</h4>
            <p className="why-desc">
              Your satisfaction is our priority. We are always here to help.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="testimonials-section">
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <span className="section-tag">What Our Customers Say</span>
            <h2 className="section-title">Trusted by Families & Farmers</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((item, idx) => (
              <div className="testimonial-card" key={idx}>
                <Quote className="testimonial-quote" size={48} />
                <div className="testimonial-stars">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill="var(--accent-gold)"
                      stroke="none"
                    />
                  ))}
                </div>
                <p className="testimonial-text">{item.quote}</p>
                <div className="testimonial-author">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="testimonial-avatar"
                  />
                  <div>
                    <p className="testimonial-name">{item.name}</p>
                    <p className="testimonial-role">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="bottom-cta">
        <div className="container bottom-cta-inner">
          <div>
            <h2 className="bottom-cta-title">
              Healthy Food,
              <br />
              Happy Life!
            </h2>
            <p className="bottom-cta-desc">Choose quality. Choose Farm2Home.</p>
          </div>

          <div className="cta-box">
            <div className="cta-box-icon">
              <PhoneCall size={24} />
            </div>
            <div className="cta-box-text">
              <h4>Ready to Place an Order?</h4>
              <p>Call us today or browse our marketplace.</p>
              <button
                className="btn-green"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  marginTop: '0.5rem',
                  width: '100%',
                }}
                onClick={() => navigate('/products')}
              >
                GET IN TOUCH
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
