import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import './Footer.css';

const API_KATEGORIYA = 'http://gulbozor.loc/backend/kategoriya';

// Ijtimoiy tarmoqlar (linklar oʻzgarmagan)
const socialMedia = [
  { name: 'Telegram',  icon: 'fab fa-telegram-plane', link: 'https://t.me/gulbozor_uz',                color: '#29a9eb' },
  { name: 'Instagram', icon: 'fab fa-instagram',      link: 'https://instagram.com/gulbozor_uz_optom', color: '#e1306c' },
  { name: 'YouTube',   icon: 'fab fa-youtube',        link: 'https://youtube.com/@gulbozor_uz',        color: '#ff3d3d' },
  { name: 'Facebook',  icon: 'fab fa-facebook-f',     link: 'https://facebook.com/gulbozor_uz',        color: '#1877f2' },
  { name: 'WeChat',    icon: 'fab fa-weixin',         link: '#wechat',                                 color: '#07c160' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Bazadan kategoriyalarni yuklash
  useEffect(() => {
    let cancelled = false;
    axios
      .get(API_KATEGORIYA)
      .then((res) => {
        if (!cancelled && Array.isArray(res.data)) setCategories(res.data);
      })
      .catch((err) => console.error('Futer uchun API yuklanmadi:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Kategoriya bosilganda Home sahifasiga oʻtkazish
  const handleCategoryClick = (id) => {
    if (id === null) {
      navigate('/');
    } else {
      navigate(`/?category=${id}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="gulbozor-footer">
      <div className="footer-main-wrapper">
        {/* --- CHAP: LOGO VA IJTIMOIY TARMOQLAR --- */}
        <motion.div className="footer-left-block footer-glass" {...fadeUp}>
          <motion.div
            className="footer-logo-box"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>gulbozor uz</span>
          </motion.div>

          <div className="footer-social-section">
            <h4 className="section-title">Ijtimoiy tarmoqlarimiz</h4>
            <div className="social-icons-row">
              {socialMedia.map((social, index) => {
                const external = social.link.startsWith('http');
                return (
                  <motion.a
                    key={social.name}
                    href={social.link}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    onClick={external ? undefined : (e) => e.preventDefault()}
                    className="social-icon-item"
                    style={{ '--brand': social.color }}
                    aria-label={social.name}
                    whileTap={{ scale: 0.94 }}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + index * 0.07, duration: 0.45 }}
                  >
                    <div className="icon-circle">
                      <i className={social.icon} aria-hidden="true"></i>
                    </div>
                    <span className="icon-name">{social.name}</span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* --- OʻNG: KATEGORIYALAR --- */}
        <motion.div
          className="footer-right-block footer-glass"
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.1 }}
        >
          <h4 className="section-title">Kategoriyalar</h4>
          <div className="footer-categories-grid">
            <motion.button
              type="button"
              className="footer-category-btn"
              onClick={() => handleCategoryClick(null)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Barchasi
            </motion.button>

            {categories.map((item) => (
              <motion.button
                type="button"
                key={item.id}
                className="footer-category-btn"
                onClick={() => handleCategoryClick(item.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {item.mavzunomi || item.nomi}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- PASTKI QISM --- */}
      <div className="footer-bottom-bar">
        <div className="bottom-bar-container">
          <p className="copyright-text">
            © {new Date().getFullYear()} gulbozor.uz. Barcha huquqlar himoyalangan
          </p>
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