import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header" id="header" role="banner">
      <div className="header-container">
        <Link to="/" className="logo" title="Shree Jagdamba School Home">
          <img src="/images/logo.png" alt="Shree Jagdamba Convent School Logo" width="55" height="55" loading="eager" />
          <h2>Shree Jagdamba Convent School</h2>
        </Link>
        <nav className="desktop-nav" role="navigation" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About Us</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Gallery</NavLink>
          <NavLink to="/progress" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Student Progress</NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
