import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="dark-footer">
      <div className="footer-container">
        <div className="footer-grid">
          
          {/* 1. Brend va Tavsif */}
          <div className="footer-box brand">
            <h2 className="logo">Gulbozor</h2>
            <p className="desc">
              Tabiatning go'zalligini qadrlaydiganlar uchun eng sifatli gullar va zamonaviy yechimlar.
            </p>
            <div className="social-icons-wrap">
              <a href="https://t.me/gulbozor" target="_blank" rel="noreferrer" className="s-link tg">
                <i className="fa-brands fa-telegram"></i>
              </a>
              <a href="#" className="s-link inst">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="s-link fb">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="s-link yt">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="#" className="s-link x">
                <i className="fa-brands fa-twitter"></i>
              </a>
            </div>
          </div>

          {/* 2. Menyu Linklari */}
          <div className="footer-box links">
            <h3>Katalog</h3>
            <ul>
              <li><a href="#">Xonaki o'simliklar</a></li>
              <li><a href="#">Dala gullari</a></li>
              <li><a href="#">Urug'lar va o'g'itlar</a></li>
              <li><a href="#">Bog'dorchilik asboblari</a></li>
            </ul>
          </div>

          {/* 3. Obuna va Kontakt */}
          <div className="footer-box subscribe">
            <h3>Yangiliklarga obuna</h3>
            <div className="sub-input-group">
              <input type="email" placeholder="Email manzilingiz" />
              <button><i className="fa-solid fa-paper-plane"></i></button>
            </div>
            <div className="contact-info">
              <span><i className="fa-solid fa-phone"></i> +998 97 233 24 05</span>
            </div>
          </div>

        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p>© 2026 Gulbozor.uz. Barcha huquqlar himoyalangan.</p>
          <div className="bottom-links">
            <a href="#">Maxfiylik siyosati</a>
            <a href="#">Foydalanish shartlari</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;