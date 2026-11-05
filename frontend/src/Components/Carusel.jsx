import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Carusel.css";
import img1 from "../assets/carusel/1.png";
import img2 from "../assets/carusel/2.png";
import img3 from "../assets/carusel/3.png";
import img4 from "../assets/carusel/4.png";

/*
  4 ta slayd. Rasmlarni React loyihangizdagi  public/carusel/  papkasiga qoʻying:
  public/carusel/1.png, 2.png, 3.png, 4.png   (fonsiz PNG, taxminan 700×600 yaxshi)
  Rasm topilmasa, oʻrniga emoji koʻrinadi — sahifa buzilmaydi.
*/
const SLIDES = [
  {
    id: 1,
    label: "Yangi mavsum",
    title: "Xonaki gullar uyingizga hayot olib kiradi",
    text: "Parvarishi oson, havoni tozalaydigan chiroyli gullar.",
    btn: "Koʻrish",
    image: img1,
    bg: "linear-gradient(120deg,#dff3e6 0%,#ffffff 58%,#e8f7ee 100%)",
  },
  {
    id: 2,
    label: "Bogʻ uchun",
    title: "Meva beruvchi koʻchatlar",
    text: "Oʻz bogʻingizda oʻz mevangizni yetishtiring.",
    btn: "Koʻrish",
    image: img2,
    bg: "linear-gradient(120deg,#e6f6dd 0%,#ffffff 58%,#fff4dc 100%)",
  },
  {
    id: 3,
    label: "Sogʻlom oʻsish",
    title: "Tuproq, oʻgʻit va dori-darmonlar",
    text: "Gullaringiz baquvvat va chiroyli boʻlishi uchun.",
    btn: "Koʻrish",
    image: img3,
    bg: "linear-gradient(120deg,#d9f1e2 0%,#ffffff 58%,#ece9dc 100%)",
  },
  {
    id: 4,
    label: "Aksessuarlar",
    title: "Tuvak, purkagich va bogʻ asboblari",
    text: "Gul parvarishi uchun kerakli hamma narsa bir joyda.",
    btn: "Koʻrish",
    image: img4,
    bg: "linear-gradient(120deg,#e2f4ea 0%,#ffffff 58%,#fde9e1 100%)",
  },
];

/**
 * <Carusel />                               → 4 ta standart slayd
 * <Carusel targetId="mahsulotlar" />        → "Koʻrish" bosilganda shu id li blokka oʻtadi
 */
export default function Carusel({ slides = SLIDES, targetId = "mahsulotlar", interval = 5000 }) {
  const [i, setI] = useState(0);
  const [pause, setPause] = useState(false);
  const [broken, setBroken] = useState({});
  const x0 = useRef(null);
  const n = slides.length;

  const go = useCallback((k) => setI((k + n) % n), [n]);

  // Avtomatik almashish (qoʻlda bosilganda taymer qaytadan boshlanadi)
  useEffect(() => {
    if (pause || n < 2) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), interval);
    return () => clearTimeout(t);
  }, [i, pause, n, interval]);

  // "Koʻrish" tugmasi → mahsulotlar boʻlimiga silliq oʻtish
  const scrollToProducts = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onTouchEnd = (e) => {
    if (x0.current === null) return;
    const dx = e.changedTouches[0].clientX - x0.current;
    if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
    x0.current = null;
  };

  const onKey = (e) => {
    if (e.key === "ArrowLeft") go(i - 1);
    if (e.key === "ArrowRight") go(i + 1);
  };

  return (
    <div className="crs-wrap">
      <section
        className="crs"
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label="Yangiliklar"
        onKeyDown={onKey}
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
        onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
        onTouchEnd={onTouchEnd}
      >
        <div className="crs-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {slides.map((s, k) => (
            <article
              key={s.id}
              className={`crs-slide ${k === i ? "active" : ""}`}
              style={{ background: s.bg }}
              aria-hidden={k !== i}
            >
              <div className="crs-txt">
                <small>{s.label}</small>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <button className="crs-btn" onClick={scrollToProducts} tabIndex={k === i ? 0 : -1}>
                  {s.btn} <span>→</span>
                </button>
              </div>

              <div className="crs-pic">
                {broken[s.id] ? (
                  <div className="crs-emoji">{s.emoji}</div>
                ) : (
                  <img
                    src={s.image}
                    alt={s.title}
                    loading={k === 0 ? "eager" : "lazy"}
                    onError={() => setBroken((b) => ({ ...b, [s.id]: true }))}
                  />
                )}
              </div>
            </article>
          ))}
        </div>

        {n > 1 && (
          <>
            <button className="crs-arr l" onClick={() => go(i - 1)} aria-label="Oldingi">‹</button>
            <button className="crs-arr r" onClick={() => go(i + 1)} aria-label="Keyingi">›</button>
            <div className="crs-dots">
              {slides.map((s, k) => (
                <button
                  key={s.id}
                  className={k === i ? "on" : ""}
                  onClick={() => go(k)}
                  aria-label={`${k + 1}-slayd`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}