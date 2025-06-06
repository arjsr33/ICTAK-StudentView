import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status on component mount and route changes
  useEffect(() => {
    checkAuthStatus();
  }, [location.pathname]);

  // Set up a listener for localStorage changes (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuthStatus = () => {
    const authenticated = api.utils.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      // Get user data from localStorage
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }
  };

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear authentication data
      api.utils.removeToken();
      localStorage.removeItem('user');
      
      // Update state
      setIsAuthenticated(false);
      setUser(null);
      
      // Close mobile menu if open
      setIsMobileMenuOpen(false);
      
      // Navigate to home page
      navigate('/');
      
      // Show success message
      alert('You have been logged out successfully!');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleDashboardClick = () => {
    if (user && user.email) {
      navigate('/StudentDashboard', { state: { s_id: user.email } });
    } else {
      navigate('/StudentDashboard', { state: { s_id: localStorage.getItem('userEmail') || '' } });
    }
    closeMobileMenu();
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src="/assets/logo.png" alt="ICTAK Logo" className="navbar-logo-img" />
          <div className="navbar-logo-text">
            <span className="navbar-logo-title">ICT Academy</span>
            <span className="navbar-logo-subtitle">of Kerala</span>
          </div>
        </Link>

        <div className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu-active' : ''}`}>
          <Link 
            to="/" 
            className={`navbar-link ${currentPath === '/' ? 'navbar-link-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`navbar-link ${currentPath === '/about' ? 'navbar-link-active' : ''}`}
            onClick={closeMobileMenu}
          >
            About
          </Link>
          <Link 
            to="/courses" 
            className={`navbar-link ${currentPath === '/courses' ? 'navbar-link-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Courses
          </Link>
          <Link 
            to="/placements" 
            className={`navbar-link ${currentPath === '/placements' ? 'navbar-link-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Placements
          </Link>
          <Link 
            to="/contact" 
            className={`navbar-link ${currentPath === '/contact' ? 'navbar-link-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Contact
          </Link>
          
          <div className="navbar-buttons">
            {isAuthenticated ? (
              // Authenticated user buttons
              <>
                <button 
                  onClick={handleDashboardClick}
                  className="navbar-btn navbar-btn-dashboard"
                >
                  Dashboard
                </button>
                <div className="user-info">
                  {user && (
                    <span className="user-name">
                      Hi, {user.name ? user.name.split(' ')[0] : 'Student'}!
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleLogout}
                  className="navbar-btn navbar-btn-logout"
                >
                  Logout
                </button>
              </>
            ) : (
              // Non-authenticated user buttons
              <>
                <Link 
                  to="/login" 
                  className="navbar-btn navbar-btn-login"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="navbar-btn navbar-btn-signup"
                  onClick={closeMobileMenu}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="navbar-hamburger" onClick={toggleMobileMenu}>
          <span className={`navbar-hamburger-bar ${isMobileMenuOpen ? 'navbar-hamburger-bar-active' : ''}`}></span>
          <span className={`navbar-hamburger-bar ${isMobileMenuOpen ? 'navbar-hamburger-bar-active' : ''}`}></span>
          <span className={`navbar-hamburger-bar ${isMobileMenuOpen ? 'navbar-hamburger-bar-active' : ''}`}></span>
        </div>
      </div>

      <style jsx>{`
        .user-info {
          display: flex;
          align-items: center;
          margin-right: 1rem;
        }

        .user-name {
          color: var(--color-text);
          font-weight: 600;
          font-size: 0.9rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius-md);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .navbar-btn-dashboard {
          background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
          color: var(--color-text-white);
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        }

        .navbar-btn-dashboard:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(78, 205, 196, 0.4);
          color: var(--color-text-white);
          text-decoration: none;
        }

        .navbar-btn-logout {
          background: linear-gradient(135deg, #FF6B6B 0%, #EE5A6F 100%);
          color: var(--color-text-white);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          border: none;
          cursor: pointer;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          transition: all var(--transition-normal);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .navbar-btn-logout:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(255, 107, 107, 0.4);
          background: linear-gradient(135deg, #EE5A6F 0%, #FF6B6B 100%);
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .navbar-buttons {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            gap: 1rem;
          }

          .user-info {
            justify-content: center;
            margin-right: 0;
            margin-bottom: 1rem;
          }

          .user-name {
            text-align: center;
            width: 100%;
          }

          .navbar-btn-dashboard,
          .navbar-btn-logout {
            width: 100%;
            text-align: center;
            justify-content: center;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;