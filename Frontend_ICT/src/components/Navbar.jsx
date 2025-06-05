import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Simulate current path - in real app, this would use useLocation from react-router-dom
    setCurrentPath(window.location.pathname);

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
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="/" className="nav-logo" onClick={closeMobileMenu}>
            <img src="/assets/logo.png" alt="ICTAK Logo" className="logo-img" />
            <div className="logo-text">
              <span className="logo-title">ICT Academy</span>
              <span className="logo-subtitle">of Kerala</span>
            </div>
          </a>

          <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
            <a 
              href="/" 
              className={`nav-link ${currentPath === '/' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Home
            </a>
            <a 
              href="/about" 
              className={`nav-link ${currentPath === '/about' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              About
            </a>
            <a 
              href="/courses" 
              className={`nav-link ${currentPath === '/courses' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Courses
            </a>
            <a 
              href="/placements" 
              className={`nav-link ${currentPath === '/placements' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Placements
            </a>
            <a 
              href="/contact" 
              className={`nav-link ${currentPath === '/contact' ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              Contact
            </a>
            
            <div className="nav-buttons">
              <a 
                href="/login" 
                className="nav-btn login-btn"
                onClick={closeMobileMenu}
              >
                Login
              </a>
              <a 
                href="/signup" 
                className="nav-btn signup-btn"
                onClick={closeMobileMenu}
              >
                Get Started
              </a>
            </div>
          </div>

          <div className="hamburger" onClick={toggleMobileMenu}>
            <span className={`bar ${isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMobileMenuOpen ? 'active' : ''}`}></span>
            <span className={`bar ${isMobileMenuOpen ? 'active' : ''}`}></span>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }

        .navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 0.25rem 0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 70px;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: #1e293b;
          transition: transform 0.3s ease;
        }

        .nav-logo:hover {
          transform: scale(1.02);
        }

        .logo-img {
          width: 45px;
          height: 45px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .navbar.scrolled .logo-img {
          width: 40px;
          height: 40px;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }

        .logo-title {
          font-size: 1.2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #1e293b, #334155);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-subtitle {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          color: #475569;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          position: relative;
          transition: all 0.3s ease;
          padding: 0.5rem 0;
        }

        .nav-link:hover {
          color: #ff6b35;
        }

        .nav-link.active {
          color: #ff6b35;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .nav-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: 1rem;
        }

        .nav-btn {
          padding: 0.6rem 1.5rem;
          border-radius: 25px;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .login-btn {
          color: #475569;
          background: transparent;
          border-color: #e2e8f0;
        }

        .login-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #1e293b;
        }

        .signup-btn {
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          color: white;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
        }

        .signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
        }

        .hamburger {
          display: none;
          flex-direction: column;
          cursor: pointer;
          padding: 0.25rem;
        }

        .bar {
          width: 25px;
          height: 3px;
          background: #475569;
          margin: 3px 0;
          transition: all 0.3s ease;
          border-radius: 2px;
        }

        .bar.active:nth-child(1) {
          transform: rotate(-45deg) translate(-5px, 6px);
          background: #ff6b35;
        }

        .bar.active:nth-child(2) {
          opacity: 0;
        }

        .bar.active:nth-child(3) {
          transform: rotate(45deg) translate(-5px, -6px);
          background: #ff6b35;
        }

        @media screen and (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }

          .logo-text {
            display: none;
          }

          .hamburger {
            display: flex;
          }

          .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
            padding: 2rem 0;
            gap: 1.5rem;
          }

          .nav-menu.active {
            left: 0;
          }

          .nav-link {
            font-size: 1.1rem;
            padding: 0.75rem 0;
          }

          .nav-buttons {
            flex-direction: column;
            margin-left: 0;
            margin-top: 1rem;
            gap: 1rem;
          }

          .nav-btn {
            padding: 0.75rem 2rem;
            font-size: 1rem;
          }
        }

        @media screen and (max-width: 480px) {
          .nav-container {
            height: 60px;
          }

          .logo-img {
            width: 35px;
            height: 35px;
          }

          .navbar.scrolled .logo-img {
            width: 32px;
            height: 32px;
          }

          .nav-menu {
            top: 60px;
          }
        }

        /* Enhanced animations and effects */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .nav-menu.active .nav-link,
        .nav-menu.active .nav-btn {
          animation: fadeInUp 0.5s ease forwards;
        }

        .nav-menu.active .nav-link:nth-child(1) { animation-delay: 0.1s; }
        .nav-menu.active .nav-link:nth-child(2) { animation-delay: 0.15s; }
        .nav-menu.active .nav-link:nth-child(3) { animation-delay: 0.2s; }
        .nav-menu.active .nav-link:nth-child(4) { animation-delay: 0.25s; }
        .nav-menu.active .nav-link:nth-child(5) { animation-delay: 0.3s; }
        .nav-menu.active .nav-buttons { animation-delay: 0.35s; }

        /* Glass morphism effect for mobile menu */
        @media screen and (max-width: 768px) {
          .nav-menu {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
        }

        /* Smooth scroll behavior when menu is open */
        body.menu-open {
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Navbar;