import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import CSS stylesheets
import './css/main.css';
import './css/header.css';
import './css/hero.css';
import './css/home.css';
import './css/footer.css';
import './css/about.css';
import './css/gallery.css';
import './css/contact.css';
import './css/progress.css';
import './css/animations.css';
import './css/flip-card.css';
import './css/principal-card.css';

// Import Page Components
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Progress from './pages/Progress';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import WeeklyTestGenerator from './pages/WeeklyTestGenerator';

// Import Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isWeeklyTestPage = location.pathname.includes('weekly-test');
  const isStandalonePage = isAdminPage || isWeeklyTestPage;

  // Dismiss PWA native splash screen with smooth fade once App mounts
  useEffect(() => {
    const splash = document.getElementById('pwa-splash');
    if (splash) {
      // Small timeout ensures smooth initial frame painting
      const timer = setTimeout(() => {
        splash.classList.add('splash-fade-out');
        setTimeout(() => {
          if (splash && splash.parentNode) {
            splash.parentNode.removeChild(splash);
          }
        }, 500);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  // Active state checker for mobile navigation
  const isActiveMobile = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Render Header only on standard public pages */}
      {!isStandalonePage && <Header />}

      {/* Main Pages Router with Page Transitions */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
          <Route path="/progress" element={<PageWrapper><Progress /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/weekly-test" element={<WeeklyTestGenerator />} />
          <Route path="/admin" element={<PageWrapper><Login /></PageWrapper>} />
          <Route path="/admin/dashboard" element={<PageWrapper><Dashboard /></PageWrapper>} />
          <Route path="/admin/weekly-test" element={<WeeklyTestGenerator />} />
        </Routes>
      </AnimatePresence>

      {/* Render Footer only on standard public pages */}
      {!isStandalonePage && <Footer />}

      {/* Mobile Navigation bar - displayed only on public pages */}
      {!isStandalonePage && (
        <nav className="mobile-nav" role="navigation" aria-label="Mobile navigation">
          <Link to="/" className={`nav-item ${isActiveMobile('/') ? 'active' : ''}`} aria-label="Home">
            <i className="fas fa-home" aria-hidden="true"></i>
            <span>Home</span>
          </Link>
          <Link to="/about" className={`nav-item ${isActiveMobile('/about') ? 'active' : ''}`} aria-label="About Us">
            <i className="fas fa-info-circle" aria-hidden="true"></i>
            <span>About</span>
          </Link>
          <Link to="/gallery" className={`nav-item ${isActiveMobile('/gallery') ? 'active' : ''}`} aria-label="Gallery">
            <i className="fas fa-images" aria-hidden="true"></i>
            <span>Gallery</span>
          </Link>
          <Link to="/progress" className={`nav-item ${isActiveMobile('/progress') ? 'active' : ''}`} aria-label="Student Progress">
            <i className="fas fa-users" aria-hidden="true"></i>
            <span>Students</span>
          </Link>
          <Link to="/contact" className={`nav-item ${isActiveMobile('/contact') ? 'active' : ''}`} aria-label="Contact">
            <i className="fas fa-phone" aria-hidden="true"></i>
            <span>Contact</span>
          </Link>
        </nav>
      )}
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
