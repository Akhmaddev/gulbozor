import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import Til from '../Components/Languageswitcher';

import savatIcon from '../assets/savat.png';
import yordamchiIcon from '../assets/yordamchi.png';

// Savatdagi jami mahsulotlar sonini localStorage'dan oʻqish
const readCartCount = () => {
  try {
    const cart = JSON.parse(localStorage.getItem('savat')) || [];
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, item) => sum + (Number(item.miqdori) || 1), 0);
  } catch {
    return 0;
  }
};

// onSearch propini qabul qilamiz
const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { pathname } = useLocation();

  // Sahifa aylantirilganda navbar ostida yumshoq soya paydo boʻladi
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Savat sonini yangilab turish (Mahsulotlar sahifasi "cartUpdated" hodisasini yuboradi)
  useEffect(() => {
    const update = () => setCartCount(readCartCount());
    update();
    window.addEventListener('cartUpdated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('cartUpdated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value); // har bir harfda qidiradi
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  const isActive = (path) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className={`glass-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo" aria-label="Gulbozor — bosh sahifa">
          Gulbozor
        </Link>

        {/* Qidiruv */}
        <form className="search-wrapper" role="search" onSubmit={handleSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Gullarni qidirish…"
            aria-label="Gullarni qidirish"
            value={query}
            onChange={handleChange}
            autoComplete="off"
          />

          {query && (
            <button
              type="button"
              className="search-clear"
              onClick={handleClear}
              aria-label="Tozalash"
            >
              ×
            </button>
          )}

          <button className="search-btn" type="submit" aria-label="Qidirish">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
          </button>
        </form>

        {/* Savat, yordamchi, til */}
        <div className="nav-actions">
          <Link
            to="/savat"
            className={`action-link ${isActive('/savat') ? 'active' : ''}`}
            aria-current={isActive('/savat') ? 'page' : undefined}
          >
            <div className="icon-box">
              <img src={savatIcon} alt="Savat" className="nav-custom-icon" />
              {cartCount > 0 && (
                <span className="badge" key={cartCount}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="link-label">Savat</span>
          </Link>

          <Link
            to="/yordamchi"
            className={`action-link ${isActive('/yordamchi') ? 'active' : ''}`}
            aria-current={isActive('/yordamchi') ? 'page' : undefined}
          >
            <div className="icon-box">
              <img src={yordamchiIcon} alt="Yordamchi" className="nav-custom-icon" />
            </div>
            <span className="link-label">Yordamchi</span>
          </Link>

          <div className="nav-lang">
            <Til />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;