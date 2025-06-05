import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
          </div>
        </div>

        <div className="navbar-hamburger" onClick={toggleMobileMenu}>
          <span className={`navbar-hamburger-bar ${isMobileMenuOpen ? 'navbar-hamburger-bar-active' : ''}`}></span>
          <span className={`navbar-hamburger-bar ${isMobileMenuOpen ? 'navbar-hamburger-bar-active' : ''}`}></span>
          <span className={`navbar-hamburger-bar ${isMobileMenuOpen ? 'navbar-hamburger-bar-active' : ''}`}></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;