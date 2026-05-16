import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Bazadan kategoriyalarni yuklab olish (Kategoriya swiper bilan bir xil)
  useEffect(() => {
    axios.get('http://gulbozor.loc/backend/kategoriya')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error("Futer uchun API yuklanmadi:", err));
  }, []);

  // Kategoriya bosilganda Home sahifasiga query parametr bilan o'tkazish
  const handleCategoryClick = (id) => {
    if (id === null) {
      navigate('/');
    } else {
      navigate(`/?category=${id}`);
    }
    // Sahifani tepaga silliq ko'tarish
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ijtimoiy tarmoqlar ro'yxati (Font Awesome ikonkalari bilan)
  const socialMedia = [
    { name: 'Telegram', icon: 'fab fa-telegram-plane', link: 'https://t.me/gulbozor_uz' },
    { name: 'Instagram', icon: 'fab fa-instagram', link: 'https://instagram.com/gulbozor_uz_optom' },
    { name: 'YouTube', icon: 'fab fa-youtube', link: 'https://youtube.com/yourchannel' },
    { name: 'Facebook', icon: 'fab fa-facebook-f', link: 'https://facebook.com/yourpage' },
    { name: 'WeChat', icon: 'fab fa-weixin', link: '#wechat' }
  ];

  return (
    <footer className="gulbozor-footer">
      <div className="footer-main-wrapper">
        
        {/* --- CHAP TOMON: LOGO VA IJTIMOIY TARMOQLAR --- */}
        <div className="footer-left-block">
          <motion.div 
            className="footer-logo-box"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>gulbozor uz</span>
          </motion.div>

          <div className="footer-social-section">
            <h4 className="section-title">ijtimoiy tarmoqlarimiz</h4>
            <div className="social-icons-row">
              {socialMedia.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-item"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="icon-circle">
                    <i className={social.icon}></i>
                  </div>
                  <span className="icon-name">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* --- O'NG TOMON: KATEGORIYALAR SETKASI (2 USTUNLI) --- */}
        <div className="footer-right-block">
          <h4 className="section-title">kategoriyalar</h4>
          <div className="footer-categories-grid">
            {/* "Barchasi" tugmasi */}
            <motion.button 
              className="footer-category-btn"
              onClick={() => handleCategoryClick(null)}
              whileHover={{ x: 5, backgroundColor: '#22c55e', color: '#111827' }}
            >
              Barchasi
            </motion.button>

            {/* Dinamik kategoriyalar */}
            {categories.map((item) => (
              <motion.button
                key={item.id}
                className="footer-category-btn"
                onClick={() => handleCategoryClick(item.id)}
                whileHover={{ x: 5, backgroundColor: '#22c55e', color: '#111827' }}
              >
                {item.mavzunomi}
              </motion.button>
            ))}
          </div>
        </div>

      </div>

      {/* --- PASTKI CHIZIQ: COPYRIGHT BLOKI --- */}
      <div className="footer-bottom-bar">
        <div className="bottom-bar-container">
          <p className="copyright-text">barcha huquqlar himoyalangan gulbozor.uz</p>
          <p className="center-logo-text">gulbozor uz</p>
          <div className="developer-box">
            <span>powered by Akhmaddev</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;