import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './CategorySwiper.css';

import img1 from '../assets/xonaki.png';
import img2 from '../assets/daraxtlar.png';
import img3 from '../assets/butalar.png';
import img5 from '../assets/meva.png';
import img6 from '../assets/ogitlar.png';
import img7 from '../assets/tuproq.png';
import img8 from '../assets/aksessuar.png';
import allFlowersImg from '../assets/barchasi.png';

// Kategoriya ID lari
const INDOOR_ID = 1;  // Xonaki gullar
const EXOTIC_ID = 4;  // Ekzotik gullar (ro'yxatdan olib tashlanadi)

// Xonaki gullar tanlanganda ekzotik gullar ham shu yerga qo'shiladi
const MERGED_IDS = {
  [INDOOR_ID]: [INDOOR_ID, EXOTIC_ID],
};

// Ekzotik rasmi (img4) endi kerak emas
const categoryImages = {
  1: img1,
  2: img2,
  3: img3,
  5: img5,
  6: img6,
  7: img7,
  8: img8,
};

const isExotic = (item) =>
  Number(item.id) === EXOTIC_ID ||
  String(item.mavzunomi || '').toLowerCase().includes('ekzotik');

const CategorySwiper = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    axios
      .get('http://gulbozor.loc/backend/kategoriya')
      .then((res) => {
        if (!cancelled) {
          setCategories(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch((err) => console.error('API yuklanmadi:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Ekzotik kategoriyani ro'yxatdan chiqarib tashlaymiz
  const visibleCategories = useMemo(
    () => categories.filter((item) => !isExotic(item)),
    [categories]
  );

  const handleCategoryClick = (id) => {
    setActiveId(id);

    if (typeof onSelectCategory !== 'function') return;

    // 1-argument: tanlangan ID (eski kod bilan mos ishlaydi)
    // 2-argument: birlashtirilgan ID lar ro'yxati (xonaki + ekzotik)
    const ids = id === null ? null : MERGED_IDS[id] || [id];
    onSelectCategory(id, ids);
  };

  const handleKeyDown = (e, id) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(id);
    }
  };

  return (
    <div className="compact-category-wrapper">
      {loading ? (
        <div className="story-skeleton-row" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div className="story-skeleton" key={i}>
              <div className="skeleton-circle" />
              <div className="skeleton-line" />
            </div>
          ))}
        </div>
      ) : (
        <Swiper
          spaceBetween={8}
          slidesPerView={4.5}
          speed={500}
          grabCursor={true}
          breakpoints={{
            640: { slidesPerView: 5.5, spaceBetween: 10 },
            1024: { slidesPerView: 8, spaceBetween: 12 },
          }}
          className="compact-swiper"
        >
          {/* 1. Barchasi */}
          <SwiperSlide key="all">
            <div
              className={`story-card ${activeId === null ? 'active-story' : ''}`}
              onClick={() => handleCategoryClick(null)}
              onKeyDown={(e) => handleKeyDown(e, null)}
              role="button"
              tabIndex={0}
              aria-pressed={activeId === null}
            >
              <div className="story-img-circle">
                <img src={allFlowersImg} alt="Barchasi" />
              </div>
              <span className="story-name">Hammasi</span>
            </div>
          </SwiperSlide>

          {/* 2. Bazadan kelgan kategoriyalar (ekzotiksiz) */}
          {visibleCategories.map((item) => (
            <SwiperSlide key={item.id}>
              <div
                className={`story-card ${
                  activeId === item.id ? 'active-story' : ''
                }`}
                onClick={() => handleCategoryClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                role="button"
                tabIndex={0}
                aria-pressed={activeId === item.id}
              >
                <div className="story-img-circle">
                  <img
                    src={categoryImages[item.id] || img1}
                    alt={item.mavzunomi}
                  />
                </div>
                <span className="story-name">{item.mavzunomi}</span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default CategorySwiper;