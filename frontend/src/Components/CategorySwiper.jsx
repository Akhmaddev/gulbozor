import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './CategorySwiper.css';

// Rasmlar importi
import img1 from '../assets/xonaki.png';
import img2 from '../assets/daraxtlar.png';
import img3 from '../assets/butalar.png';
import img4 from '../assets/ekzotik.png';
import img5 from '../assets/meva.png';
import img6 from '../assets/ogitlar.png';
import img7 from '../assets/tuproq.png';
import img8 from '../assets/aksessuar.png';

const CategorySwiper = () => {
  const [categories, setCategories] = useState([]);

  const categoryImages = {
    1: img1, 2: img2, 3: img3, 4: img4,
    5: img5, 6: img6, 7: img7, 8: img8
  };

  useEffect(() => {
    // API-dan ma'lumot olish
    axios.get('http://gulbozor.loc/backend/kategoriya')
    .then(res => {
        console.log("Kategoriyalar :", res.data);
        // Faqat bitta setCategories qolsin
        setCategories(res.data);
    })
    .catch(err => {
        console.error("API yuklanmadi:", err);
    });
}, []);

  return (
    <div className="compact-category-wrapper">
      <Swiper
        spaceBetween={8}
        slidesPerView={4.5} // Telefonlarda yarimta slayd ko'rinib turishi uchun
        breakpoints={{
          640: { slidesPerView: 5.5 },
          1024: { slidesPerView: 8 }, // Kompyuterda 8 ta to'liq
        }}
        className="compact-swiper"
      >
        {categories.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="story-card">
              <div className="story-img-circle">
                <img src={categoryImages[item.id] || img1} alt={item.mavzunomi} />
              </div>
              <span className="story-name">{item.mavzunomi}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
   
  );
};

export default CategorySwiper;