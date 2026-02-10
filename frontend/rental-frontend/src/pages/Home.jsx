import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/**
 * Home page - Premium landing page with modern design
 */
const Home = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Featured vehicles data
  const featuredVehicles = [
    {
      id: 1,
      name: 'Premium Sedan',
      category: 'Cars',
      image: 'https://images.unsplash.com/photo-1552519507-da3effff991c?w=400&h=300&fit=crop',
      price: '$50/day',
      rating: '4.8',
      reviews: '234'
    },
    {
      id: 2,
      name: 'Sport Motorcycle',
      category: 'Bikes',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
      price: '$25/day',
      rating: '4.9',
      reviews: '156'
    },
    {
      id: 3,
      name: 'Power Tools Set',
      category: 'Tools',
      image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=300&fit=crop',
      price: '$15/day',
      rating: '4.7',
      reviews: '89'
    },
    {
      id: 4,
      name: 'SUV Explorer',
      category: 'Cars',
      image: 'https://images.unsplash.com/photo-1606611013016-969c19d4a42f?w=400&h=300&fit=crop',
      price: '$75/day',
      rating: '4.9',
      reviews: '312'
    }
  ];

  // Why choose us data
  const whyChooseUs = [
    {
      id: 1,
      icon: '🚗',
      title: 'Wide Selection',
      description: 'Choose from 500+ vehicles and equipment options tailored to your needs.',
      color: '#667eea'
    },
    {
      id: 2,
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive rates with transparent pricing. No hidden charges ever.',
      color: '#764ba2'
    },
    {
      id: 3,
      icon: '⚡',
      title: 'Quick Booking',
      description: 'Fast and simple booking process. Get your rental in just minutes.',
      color: '#667eea'
    },
    {
      id: 4,
      icon: '🛡️',
      title: 'Safe & Secure',
      description: 'Insurance included. Verified owners and secure payment gateway.',
      color: '#764ba2'
    },
    {
      id: 5,
      icon: '⭐',
      title: 'Top Rated',
      description: '4.8/5 average rating from 10,000+ happy customers worldwide.',
      color: '#667eea'
    },
    {
      id: 6,
      icon: '📱',
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your rental needs.',
      color: '#764ba2'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      text: 'Amazing service! The rental process was smooth and the vehicle was in perfect condition.',
      rating: 5
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Adventure Enthusiast',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      text: 'Best rental platform I\'ve used. Great prices and excellent customer service.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emma Davis',
      role: 'Home Owner',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      text: 'Tool rental service is fantastic. Tools are well-maintained and delivery is prompt.',
      rating: 5
    }
  ];

  return (
    <div className="home-container">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <div className="hero-text animate-fade-in">
            <h1 className="hero-title">Premium Rental Solutions</h1>
            <p className="hero-subtitle">
              Rent cars, bikes, and professional tools at unbeatable prices
            </p>
            <p className="hero-description">
              Join 50,000+ satisfied customers who trust us for their rental needs
            </p>
            
            <div className="hero-buttons">
              <Link to="/vehicles" className="btn btn-hero btn-primary">
                <i className="fas fa-search"></i> Browse Vehicles
              </Link>
              <Link to="/register" className="btn btn-hero btn-secondary">
                <i className="fas fa-rocket"></i> Get Started
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item animate-fade-in-delay-1">
            <h3>10K+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item animate-fade-in-delay-2">
            <h3>500+</h3>
            <p>Rental Items</p>
          </div>
          <div className="stat-item animate-fade-in-delay-3">
            <h3>4.8★</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </section>

      {/* ===== FEATURED VEHICLES SECTION ===== */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Featured Rentals</h2>
            <p>Handpicked vehicles and equipment for you</p>
          </div>

          <div className="featured-grid">
            {featuredVehicles.map((vehicle, index) => (
              <div
                key={vehicle.id}
                className="featured-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredCard(vehicle.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-image">
                  <img src={vehicle.image} alt={vehicle.name} loading="lazy" />
                  <div className="card-badge">{vehicle.category}</div>
                  <div className="card-overlay"></div>
                </div>

                <div className="card-content">
                  <h3>{vehicle.name}</h3>
                  <div className="card-rating">
                    <span className="stars">
                      <i className="fas fa-star"></i> {vehicle.rating}
                    </span>
                    <span className="reviews">({vehicle.reviews} reviews)</span>
                  </div>

                  <div className="card-footer">
                    <span className="price">{vehicle.price}</span>
                    <Link to="/vehicles" className="btn btn-sm">
                      View <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="featured-cta">
            <Link to="/vehicles" className="btn btn-primary btn-lg">
              View All Rentals <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US SECTION ===== */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>Why Choose Us?</h2>
            <p>Excellence in every rental experience</p>
          </div>

          <div className="features-grid">
            {whyChooseUs.map((feature, index) => (
              <div
                key={feature.id}
                className="feature-card animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="feature-icon" style={{ backgroundColor: feature.color + '20', color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-accent" style={{ backgroundColor: feature.color }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS SECTION ===== */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>How It Works</h2>
            <p>Simple 3-step process to rent</p>
          </div>

          <div className="steps-grid">
            <div className="step-card animate-slide-up" style={{ animationDelay: '0s' }}>
              <div className="step-number">1</div>
              <h3>Browse & Select</h3>
              <p>Explore our wide collection and pick the perfect rental for your needs.</p>
              <i className="fas fa-search"></i>
            </div>

            <div className="step-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>

            <div className="step-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="step-number">2</div>
              <h3>Book & Pay</h3>
              <p>Quick booking process with secure payment options and instant confirmation.</p>
              <i className="fas fa-credit-card"></i>
            </div>

            <div className="step-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>

            <div className="step-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="step-number">3</div>
              <h3>Enjoy & Return</h3>
              <p>Rent with confidence. Easy return process with hassle-free support.</p>
              <i className="fas fa-smile"></i>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header animate-fade-in">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from satisfied renters</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="testimonial-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>

                <p className="testimonial-text">"{testimonial.text}"</p>

                <div className="testimonial-author">
                  <img src={testimonial.image} alt={testimonial.name} loading="lazy" />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of happy renters and experience the difference</p>
          <div className="cta-buttons">
            <Link to="/vehicles" className="btn btn-primary btn-lg">
              Browse Now
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
