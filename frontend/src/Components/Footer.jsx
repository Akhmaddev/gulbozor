import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Bazadan kategoriyalarni yuklab olish (o'zgarmagan)
  useEffect(() => {
    axios.get('http://gulbozor.loc/backend/kategoriya')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => console.error("Futer uchun API yuklanmadi:", err));
  }, []);

  // Kategoriya bosilganda Home sahifasiga o'tkazish (o'zgarmagan)
  const handleCategoryClick = (id) => {
    if (id === null) {
      navigate('/');
    } else {
      navigate(`/?category=${id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Ijtimoiy tarmoqlar (linklar o'zgarmagan, faqat har biriga o'z rangi qo'shildi)
  const socialMedia = [
    { name: 'Telegram',  icon: 'fab fa-telegram-plane', link: 'https://t.me/gulbozor_uz',                        color: '#29a9eb' },
    { name: 'Instagram', icon: 'fab fa-instagram',      link: 'https://instagram.com/gulbozor_uz_optom',         color: '#e1306c' },
    { name: 'YouTube',   icon: 'fab fa-youtube',        link: 'https://youtube.com/yourchannel',                 color: '#ff3d3d' },
    { name: 'Facebook',  icon: 'fab fa-facebook-f',     link: 'https://facebook.com/yourpage',                   color: '#1877f2' },
    { name: 'WeChat',    icon: 'fab fa-weixin',         link: '#wechat',                                         color: '#07c160' }
  ];

  return (
    <footer className="gulbozor-footer">
      <div className="footer-main-wrapper">

        {/* --- CHAP: LOGO VA IJTIMOIY TARMOQLAR --- */}
        <div className="footer-left-block footer-glass">
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
                  key={social.name}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon-item"
                  style={{ '--brand': social.color }}
                  aria-label={social.name}
                  whileTap={{ scale: 0.93 }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div className="icon-circle">
                    <i className={social.icon} aria-hidden="true"></i>
                  </div>
                  <span className="icon-name">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* --- O'NG: KATEGORIYALAR --- */}
        <div className="footer-right-block footer-glass">
          <h4 className="section-title">kategoriyalar</h4>
          <div className="footer-categories-grid">
            <motion.button
              className="footer-category-btn"
              onClick={() => handleCategoryClick(null)}
              whileTap={{ scale: 0.97 }}
            >
              Barchasi
            </motion.button>

            {categories.map((item) => (
              <motion.button
                key={item.id}
                className="footer-category-btn"
                onClick={() => handleCategoryClick(item.id)}
                whileTap={{ scale: 0.97 }}
              >
                {item.mavzunomi}
              </motion.button>
            ))}
          </div>
        </div>

      </div>

      {/* --- PASTKI QISM --- */}
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