import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Mahsulotlar.css';

const Mahsulotlar = () => {
    const [gullar, setGullar] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://gulbozor.loc/backend/gullar', {
            headers: { 'Accept': 'application/json' }
        })
        .then(res => {
            setGullar(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Xato:", err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="loader">Gullar yuklanmoqda...</div>;

    return (
        <section className="catalog-section">
            <div className="custom-container">
                <h2 className="catalog-title">Gullar Katalogi</h2>
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
            </div>
        </section>
    );
};

export default Mahsulotlar;