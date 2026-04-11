import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Shield, Zap, Brain, ArrowRight, ChevronRight } from 'lucide-react';
import './Landing.css';

function Landing() {
  return (
    <div className="landing">
      {/* Hero Navbar */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <Car size={28} />
          <span>VehicleNet</span>
        </div>
        <div className="landing-nav-links">
          <Link to="/login" className="landing-nav-link">Login</Link>
          <Link to="/signup" className="landing-nav-cta">Get Started</Link>
        </div>
      </nav>

      {/* Background Effects */}
      <div className="hero-glow hero-glow-1"></div>
      <div className="hero-glow hero-glow-2"></div>
      <div className="hero-grid"></div>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <Zap size={14} />
          <span>Powered by EfficientNetB0 — 98.90% Accuracy</span>
        </div>
        <h1 className="hero-title">
          Intelligent Vehicle<br />
          <span className="gradient-text">Classification</span>
        </h1>
        <p className="hero-desc">
          Upload any vehicle image and our deep learning model instantly identifies 
          whether it's a Bike, Bus, Car, or Truck with state-of-the-art precision.
        </p>
        <div className="hero-actions">
          <Link to="/signup" className="btn-primary-lg">
            Start Classifying
            <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="btn-ghost-lg">
            I have an account
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon feature-icon-purple">
            <Brain size={28} />
          </div>
          <h3>Deep Learning</h3>
          <p>Fine-tuned EfficientNetB0 with a robust 70/15/15 dataset split for maximum accuracy.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon feature-icon-cyan">
            <Zap size={28} />
          </div>
          <h3>Instant Results</h3>
          <p>Get classification results in milliseconds with our optimized inference pipeline.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon feature-icon-red">
            <Shield size={28} />
          </div>
          <h3>4-Class Detection</h3>
          <p>Accurately distinguishes between Bikes, Buses, Cars, and Trucks.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 VehicleNet. Built with TensorFlow & React.</p>
      </footer>
    </div>
  );
}

export default Landing;
