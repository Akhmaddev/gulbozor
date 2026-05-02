import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Mahsulotlar.css";
import emptyIcon from "../assets/empty.png";
import closeIcon from "../assets/close.png";

const Mahsulotlar = ({ categoryId, searchTerm, categories }) => {
  const [gullar, setGullar] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedGul, setSelectedGul] = useState(null);
  const [count, setCount] = useState(1);

  useEffect(() => {
    setIsRefreshing(true);
    let url = `http://gulbozor.loc/backend/gullar?q=${searchTerm || ""}`;
    if (categoryId && !searchTerm) {
      url += `&kategoriya_id=${categoryId}`;
    }
    axios
      .get(url)
      .then((res) => {
        setGullar(res.data);
        setIsRefreshing(false);
      })
      .catch(() => setIsRefreshing(false));
  }, [categoryId, searchTerm]);

  const increment = (e) => {
    e.stopPropagation();
    // Bazadagi 'soni' ustuni bilan solishtirish
    if (count < Number(selectedGul.soni)) setCount((prev) => prev + 1);
  };

  const decrement = (e) => {
    e.stopPropagation();
    if (count > 1) setCount((prev) => prev - 1);
  };

  const getCatName = (id) => {
    const cat = categories?.find((c) => Number(c.id) === Number(id));
    return cat ? cat.nomi : "Kategoriya";
  };

  // SAVATGA QO'SHISH FUNKSIYASI
  const handleAddToCart = () => {
    if (!selectedGul || Number(selectedGul.soni) === 0) {
      alert("Kechirasiz, ushbu mahsulot omborda qolmagan.");
      return;
    }

    const cartItem = {
      id: selectedGul.id,
      nomi: selectedGul.gulnomi,
      narxi: selectedGul.gulnarxi,
      rasmi: selectedGul.gulrasmi,
      miqdori: count,
      jamiNarxi: count * Number(selectedGul.gulnarxi)
    };

    // LocalStorage dan mavjud savatni olish
    let currentCart = JSON.parse(localStorage.getItem("savat")) || [];
    
    // Agar mahsulot savatda bo'lsa, miqdorini yangilash
    const existingIndex = currentCart.findIndex(item => item.id === cartItem.id);
    if (existingIndex > -1) {
      currentCart[existingIndex].miqdori += count;
      currentCart[existingIndex].jamiNarxi = currentCart[existingIndex].miqdori * Number(selectedGul.gulnarxi);
    } else {
      currentCart.push(cartItem);
    }

    localStorage.setItem("savat", JSON.stringify(currentCart));
    alert(`${selectedGul.gulnomi} savatga qo'shildi!`);
    setSelectedGul(null); // Modalni yopish
  };

  return (
    <section className="catalog-section">
      <div className="custom-container">
        {gullar.length > 0 ? (
          <div className={`product-grid ${isRefreshing ? "refreshing" : ""}`}>
            {gullar.map((gul) => (
              <div
                className="flower-card"
                key={gul.id}
                onClick={() => {
                  setSelectedGul(gul);
                  setCount(1);
                }}
              >
                <div className="flower-img-box">
                  <img
                    src={`http://gulbozor.loc/frontend/web/images/${gul.gulrasmi}`}
                    alt={gul.gulnomi}
                  />
                </div>
                <div className="flower-info">
                  <h3 className="flower-name">{gul.gulnomi}</h3>
                  <p className="flower-price">
                    {Number(gul.gulnarxi).toLocaleString()} UZS
                  </p>
                  <button className="view-btn">Batafsil</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isRefreshing && (
            <div className="empty-state-container">
              <div className="empty-state-content">
                <div className="empty-image-wrapper">
                  <img src={emptyIcon} alt="Topilmadi" className="empty-img" />
                </div>
                <h3 className="empty-title">Hech narsa topilmadi</h3>
                <p className="empty-text">
                  Siz qidirgan gul malumotlari saytda mavjud emas <br /> Boshqa
                  kategoriyalarni sinab ko'ring. 
                </p>
              </div>
            </div>
          )
        )}

        {selectedGul && (
          <div className="modal-overlay" onClick={() => setSelectedGul(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-x-btn"
                onClick={() => setSelectedGul(null)}
              >
                <img src={closeIcon} alt="X" />
              </button>
              <div className="modal-content-flex">
                <div className="modal-image-side">
                  <img
                    src={`http://gulbozor.loc/frontend/web/images/${selectedGul.gulrasmi}`}
                    alt=""
                  />
                </div>
                <div className="modal-details-side">
                  <span className="modal-category-tag">
                    {getCatName(selectedGul.kategoriya_id)}
                  </span>
                  <h2 className="modal-product-title">{selectedGul.gulnomi}</h2>
                  <div className="modal-description-box">
                    <p>
                      {selectedGul.gulmalumoti ||
                        "Ma'lumot tez kunda qo'shiladi."}
                    </p>
                  </div>
                  <div className="modal-info-grid">
                    <div className="info-item">
                      <span className="label">Narxi:</span>
                      <span className="value">
                        {Number(selectedGul.gulnarxi).toLocaleString()} UZS
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Omborda:</span>
                      {/* Soni 0 bo'lsa qizil rangda chiqadi */}
                      <span className={`value ${Number(selectedGul.soni) === 0 ? "out-of-stock" : ""}`}>
                        {selectedGul.soni || 0} dona
                      </span>
                    </div>
                  </div>
                  <div className="modal-footer-controls">
                    <div className="counter-wrapper">
                      <button onClick={decrement} disabled={count <= 1}>
                        −
                      </button>
                      <span className="count-display">{count}</span>
                      <button
                        onClick={increment}
                        disabled={count >= Number(selectedGul.soni)}
                      >
                        +
                      </button>
                    </div>
                    {/* Omborda 0 bo'lsa tugma o'chadi */}
                    <button 
                      className="add-to-cart-btn" 
                      onClick={handleAddToCart}
                      disabled={Number(selectedGul.soni) === 0}
                    >
                      {Number(selectedGul.soni) === 0 ? "Zaxirada yo'q" : "Savatga qo'shish"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Mahsulotlar;