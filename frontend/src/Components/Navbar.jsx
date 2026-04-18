import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Yii2 API-dan navbar elementlarini olish
    axios.get('http://gulbozor.loc/backend/navbar', {
      headers: { 'Accept': 'application/json' }
    })
    .then(res => setMenuItems(res.data))
    .catch(err => console.error("API xatosi:", err));
  }, []);

  return (
    <nav className="glass-nav">
      <div className="nav-container">
        
        {/* Logotip qismi - Home sahifasiga yo'naltiradi */}
        <Link to="/" className="logo">
          Gulbozor<span>.uz</span>
        </Link>

        {/* Qidiruv inputi */}
        <div className="search-wrapper">
          <input type="text" placeholder="Gullarni qidirish..." />
          <button className="search-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        {/* Dinamik menyu (Savat, Yordamchi) */}
        <div className="nav-actions">
          {menuItems.map(item => (
            <Link key={item.id} to={item.manzili} className="action-link">
              <div className="icon-box">
                {item.nomi.toLowerCase().includes('yordamchi') ? (
                  <i className="fa-solid fa-robot ai-icon"></i>
                ) : (
                  <i className="fa-solid fa-cart-shopping"></i>
                )}
              </div>
              <span className="link-label">{item.nomi}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;