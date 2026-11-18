import React, { useState, useEffect } from "react";
import "./Savat.css";
import emptyCartImg from "../assets/hmm.png"; // O'zingiz qo'yadigan rasm yo'li

const Savat = () => {
  const [cartItems, setCartItems] = useState([]);

  // Mahsulotning maksimal soni (ombordagi qoldiq). Yo'q bo'lsa — cheklanmagan
  const getMaxSon = (item) => {
    const max = Number(item.maxSoni);
    return max > 0 ? max : Infinity;
  };

  // LocalStorage dan savat ma'lumotlarini yuklash
  const loadCart = () => {
    try {
      const savatData = JSON.parse(localStorage.getItem("savat"));
      const list = Array.isArray(savatData) ? savatData : [];

      // Agar savatdagi miqdor zaxiradan oshib ketgan bo'lsa, zaxiraga tenglaymiz
      const fixed = list.map((item) => {
        const maxSon = getMaxSon(item);
        if (item.miqdori > maxSon) {
          return {
            ...item,
            miqdori: maxSon,
            jamiNarxi: maxSon * Number(item.narxi),
          };
        }
        return item;
      });

      setCartItems(fixed);
    } catch (error) {
      console.error("Savatni o'qishda xatolik:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
    // Savat yangilanganini eshitish paneli
    window.addEventListener("cartUpdated", loadCart);
    return () => {
      window.removeEventListener("cartUpdated", loadCart);
    };
  }, []);

  // Soni ko'paytirish (+)
  const handleIncrement = (id) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const maxSon = getMaxSon(item);

        // Zaxiradan oshib ketmasligi uchun tekshiruv
        if (item.miqdori >= maxSon) {
          alert(`Omborda faqat ${maxSon} ta mavjud`);
          return item;
        }

        const yangiMiqdor = item.miqdori + 1;
        return {
          ...item,
          miqdori: yangiMiqdor,
          jamiNarxi: yangiMiqdor * Number(item.narxi),
        };
      }
      return item;
    });
    updateLocalStorage(updatedCart);
  };

  // Soni kamaytirish (-)
  const handleDecrement = (id) => {
    const updatedCart = cartItems
      .map((item) => {
        if (item.id === id) {
          if (item.miqdori > 1) {
            const yangiMiqdor = item.miqdori - 1;
            return {
              ...item,
              miqdori: yangiMiqdor,
              jamiNarxi: yangiMiqdor * Number(item.narxi),
            };
          }
          return null; // Soni 1 dan kamaysa savatdan o'chadi
        }
        return item;
      })
      .filter(Boolean);
    updateLocalStorage(updatedCart);
  };

  // Savatdan butunlay o'chirish (X tugmasi)
  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updatedCart);
  };

  const updateLocalStorage = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("savat", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Jami summani hisoblash (Xatolarsiz xavfsiz holatda)
  const totalSumma = cartItems.reduce(
    (acc, item) => acc + (Number(item.jamiNarxi) || 0),
    0
  );

  return (
    <div className="savat-page">
      <div className="savat-container">
        <h1 className="savat-main-title">Savatingiz</h1>

        {cartItems.length > 0 ? (
          <div className="savat-wrapper">
            {/* MAHSULOTLAR GRID QISMI */}
            <div className="savat-products-grid">
              {cartItems.map((item) => {
                const limitgaYetdi = item.miqdori >= getMaxSon(item);

                return (
                  <div className="savat-card" key={item.id}>
                    {/* Chap tomondagi kvadrat rasm */}
                    <div className="savat-card-img">
                      <img
                        src={`http://gulbozor.loc/frontend/web/images/${item.rasmi}`}
                        alt={item.nomi}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100?text=Gul";
                        }}
                      />
                    </div>

                    {/* O'ng tomondagi ma'lumotlar paneli */}
                    <div className="savat-card-info">
                      <div className="savat-card-header">
                        <h3 className="savat-item-name">{item.nomi}</h3>
                        <button
                          className="savat-item-remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          &times;
                        </button>
                      </div>

                      <p className="savat-item-price">
                        {Number(item.narxi).toLocaleString()} UZS
                      </p>

                      {/* Boshqaruv paneli: [+] soni X [-] */}
                      <div className="savat-counter-box">
                        <button
                          className="savat-cnt-btn plus"
                          onClick={() => handleIncrement(item.id)}
                          disabled={limitgaYetdi}
                          title={
                            limitgaYetdi
                              ? `Omborda faqat ${item.maxSoni} ta mavjud`
                              : ""
                          }
                        >
                          +
                        </button>
                        <span className="savat-cnt-text">
                          soni: {item.miqdori}
                          {item.maxSoni ? ` / ${item.maxSoni}` : ""}
                        </span>
                        <button
                          className="savat-cnt-btn minus"
                          onClick={() => handleDecrement(item.id)}
                        >
                          &minus;
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* JAMI SUMMA VA XARID QILISH OYNASI */}
            <div className="savat-summary-panel">
              <h3 className="summary-title">Buyurtma Hisobi</h3>
              <div className="summary-row">
                <span>Maxsulotlar turi:</span>
                <span>{cartItems.length} xil</span>
              </div>
              <div className="summary-row total-row">
                <span>Jami summa:</span>
                <span className="total-price-green">
                  {totalSumma.toLocaleString()} UZS
                </span>
              </div>
              <button
                className="savat-submit-btn"
                onClick={() =>
                  alert("Buyurtmangiz muvaffaqiyatli rasmiylashtirildi!")
                }
              >
                Xaridni rasmiylashtirish
              </button>
            </div>
          </div>
        ) : (
          /* SAVAT BO'SH BO'LGANDA RASM + MATN */
          <div className="savat-empty-screen">
            <img
              src={emptyCartImg}
              alt="Savat bo'sh"
              className="savat-empty-img"
            />
            <h2 className="savat-empty-title">Savatingiz bo'sh</h2>
            <p className="savat-empty-text">
              Savatingizda hozircha hech narsa yo'q.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Savat;