import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

import savatIcon from '../assets/savat.png';
import yordamchiIcon from '../assets/yordamchi.png';

// onSearch propini qabul qilamiz
const Navbar = ({ onSearch }) => {
    return (
        <nav className="glass-nav">
            <div className="nav-container">

                {/* Logo */}
                <Link to="/" className="logo">
                    Gulbozor
                </Link>

                {/* Search - Qidiruv */}
                <div className="search-wrapper">
                    <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Gullarni qidirish...." 
                        // Har bir harf yozilganda onSearch ishga tushadi
                        onChange={(e) => onSearch(e.target.value)}
                    />
                    <button className="search-btn" type="submit">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>

                {/* Actions - Savat va Yordamchi */}
                <div className="nav-actions">
                    <Link to="/savat" className="action-link">
                        <div className="icon-box">
                            <img src={savatIcon} alt="Savat" className="nav-custom-icon" />
                            
                        </div>
                        <span className="link-label">Savat</span>
                    </Link>

                    <Link to="/yordamchi" className="action-link">
                        <div className="icon-box">
                            <img src={yordamchiIcon} alt="Yordamchi" className="nav-custom-icon" />
                        </div>
                        <span className="link-label">Yordamchi</span>
                    </Link>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;