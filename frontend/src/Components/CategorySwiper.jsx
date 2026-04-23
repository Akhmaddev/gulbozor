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
import allFlowersImg from '../assets/barchasi.png';

// ... oldingi importlar qoladi ...

const CategorySwiper = ({ onSelectCategory }) => { // onSelectCategory propini qo'shdik
  const [categories, setCategories] = useState([]);
  const [activeId, setActiveId] = useState(null); // Qaysi kategoriya tanlanganini bilish uchun

  const categoryImages = {
      1: img1, 2: img2, 3: img3, 4: img4,
      5: img5, 6: img6, 7: img7, 8: img8
  };

  useEffect(() => {
      axios.get('http://gulbozor.loc/backend/kategoriya') // Endpointni tekshiring (kategoriyalar yoki kategoriya)
      .then(res => {
          setCategories(res.data);
      })
      .catch(err => console.error("API yuklanmadi:", err));
  }, []);

  const handleCategoryClick = (id) => {
      setActiveId(id);
      onSelectCategory(id); // Home.jsx ga xabar beradi
  };

  return (
      <div className="compact-category-wrapper">
          <Swiper
              spaceBetween={8}
              slidesPerView={4.5}
              breakpoints={{
                  640: { slidesPerView: 5.5 },
                  1024: { slidesPerView: 9 }, // "Barchasi" qo'shilgani uchun 9 qildik
              }}
              className="compact-swiper"
          >
              

<SwiperSlide key="all">
    <div 
        className={`story-card ${activeId === null ? 'active-story' : ''}`}
        onClick={() => handleCategoryClick(null)}
    >
        <div className="story-img-circle">
            {/* 2. Span o'rniga rasm qoyamiz */}
            <img src={allFlowersImg} alt="Barchasi" />
        </div>
        <span className="story-name">Barchasi</span>
    </div>
</SwiperSlide>

              {/* --- 2. Bazadan kelgan kategoriyalar --- */}
              {categories.map((item) => (
                  <SwiperSlide key={item.id}>
                      <div 
                          className={`story-card ${activeId === item.id ? 'active-story' : ''}`}
                          onClick={() => handleCategoryClick(item.id)}
                      >
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