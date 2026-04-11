import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Car, LogOut } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = localStorage.getItem('vc_user');

  const handleLogout = () => {
    localStorage.removeItem('vc_user');
    navigate('/');
  };

  // Don't show navbar on landing page
  if (location.pathname === '/') return null;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <Car size={28} />
        <span>VehicleNet</span>
      </Link>

      <div className="nav-links">
        {isAuth ? (
          <>
            <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <button className="nav-logout" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
              Login
            </Link>
            <Link to="/signup" className="nav-cta">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
