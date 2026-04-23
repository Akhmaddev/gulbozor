import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mahsulotlar.css';
import emptyIcon from '../assets/empty.png';

const Mahsulotlar = ({ categoryId, searchTerm }) => {
    const [gullar, setGullar] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        setIsRefreshing(true);
        
        // Qidiruv bo'lsa barcha kategoriyadan, bo'lmasa tanlangan kategoriyadan qidiradi
        let url = `http://gulbozor.loc/backend/gullar?q=${searchTerm || ''}`;
        if (categoryId && !searchTerm) {
            url += `&kategoriya_id=${categoryId}`;
        }

        axios.get(url)
            .then(res => {
                setGullar(res.data);
                setIsRefreshing(false);
            })
            .catch(() => setIsRefreshing(false));
            
    }, [categoryId, searchTerm]);

    return (
        <section className="catalog-section">
            <div className="custom-container">
                <h2 className="catalog-title">
                    {searchTerm ? `'${searchTerm}' bo'yicha natijalar` : 'Gullar Katalogi'}
                </h2>

                <div className={`product-wrapper ${isRefreshing ? 'refreshing' : ''}`}>
                    {gullar.length > 0 ? (
                        <div className="product-grid">
                            {gullar.map((gul) => (
                                <div className="flower-card" key={gul.id}>
                                    <div className="flower-image-wrapper">
                                        <img 
                                            src={`http://gulbozor.loc/frontend/web/images/${gul.gulrasmi}`} 
                                            alt={gul.gulnomi} 
                                            className="flower-img"
                                        />
                                    </div>
                                    <div className="flower-details">
                                        <h3 className="flower-name">{gul.gulnomi}</h3>
                                        <div className="flower-price">
                                            {Number(gul.gulnarxi).toLocaleString()} so'm
                                        </div>
                                        <button className="details-btn">Batafsil</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !isRefreshing && (
                            <div className="empty-state-wrapper">
        <div className="empty-state-card">
            <div className="empty-icon-box">
                <img src={emptyIcon} alt="Topilmadi" className="empty-state-img" />
            </div>
            <h3 className="empty-state-title">Hech narsa topilmadi</h3>
            <p className="empty-state-text">
                Qidiruv so'zi yoki tanlangan kategoriya bo'yicha mahsulot mavjud emas. 
                Iltimos, ma'lumotlarni qayta tekshirib ko'ring.
            </p>
            <button 
                className="reset-search-btn" 
                onClick={() => window.location.reload()}
            >
                Filtrni tozalash
            </button>
        </div>
    </div>
                        )
                    )}
                </div>
            </div>
        </section>
    );
};

export default Mahsulotlar;