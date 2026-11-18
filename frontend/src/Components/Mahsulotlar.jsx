import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Mahsulotlar.css";
import emptyIcon from "../assets/empty.png";
import closeIcon from "../assets/close.png";

const API = "http://gulbozor.loc/backend";
const IMG = "http://gulbozor.loc/frontend/web/images/";

/* ---------- Yulduzchalar ---------- */
// Koʻrsatish uchun (0–5, kasr ham boʻladi: 4.3 → 86% toʻladi)
const Stars = ({ value = 0, size = 16 }) => (
  <span className="stars" style={{ fontSize: size }} aria-label={`${Number(value).toFixed(1)} / 5`}>
    <span className="stars-bg">★★★★★</span>
    <span className="stars-fg" style={{ width: `${(Number(value) / 5) * 100}%` }}>★★★★★</span>
  </span>
);

// Baho tanlash uchun
const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-input" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          type="button"
          key={s}
          className={s <= (hover || value) ? "on" : ""}
          onMouseEnter={() => setHover(s)}
          onClick={() => onChange(s)}
          aria-label={`${s} yulduz`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

/* ---------- Gullarni yuklash yordamchilari ---------- */

// Turli backend formatlaridan massivni ajratib oladi
const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

// Bitta URL boʻyicha BARCHA sahifalarni yuklaydi.
// Backend sahifalab (masalan 20 tadan) qaytarsa ham hammasi olinadi.
// Backend `page` ni eʼtiborsiz qoldirsa — yangi gul chiqmaydi va tsikl toʻxtaydi.
async function fetchAllPages(url) {
  const seen = new Set();
  const all = [];
  const sep = url.includes("?") ? "&" : "?";

  for (let page = 1; page <= 50; page++) {
    let list;
    try {
      const res = await axios.get(`${url}${sep}page=${page}&per-page=200`);
      list = toList(res.data);
    } catch (err) {
      if (page === 1) throw err; // birinchi sahifa xato — butunlay xato
      break; // keyingi sahifa xato — olinganlarini qoldiramiz
    }

    let added = 0;
    list.forEach((g) => {
      if (!seen.has(g.id)) {
        seen.add(g.id);
        all.push(g);
        added++;
      }
    });
    if (list.length === 0 || added === 0) break;
  }
  return all;
}

/* ---------- Izohlar API (backend boʻlmasa brauzerda saqlanadi) ---------- */
const localKey = (id) => `izohlar_${id}`;
const getLocal = (id) => {
  try { return JSON.parse(localStorage.getItem(localKey(id))) || []; } catch { return []; }
};

async function fetchIzohlar(id) {
  try {
    const r = await axios.get(`${API}/izohlar?gul_id=${id}`);
    if (Array.isArray(r.data)) return r.data;
  } catch {}
  return getLocal(id);
}

async function sendIzoh(data) {
  try {
    const r = await axios.post(`${API}/izohlar`, data);
    if (r.data && r.data.id) return r.data;
  } catch {}
  const item = { ...data, id: Date.now(), sana: new Date().toISOString() };
  try { localStorage.setItem(localKey(data.gul_id), JSON.stringify([item, ...getLocal(data.gul_id)])); } catch {}
  return item;
}

const stat = (list) =>
  list.length
    ? { avg: list.reduce((a, r) => a + Number(r.baho), 0) / list.length, n: list.length }
    : { avg: 0, n: 0 };

const fmtDate = (s) => {
  const d = new Date(s);
  return isNaN(d) ? "" : d.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", year: "numeric" });
};

/* ---------- Asosiy komponent ---------- */
// categoryId  — tanlangan kategoriya (null = hammasi)
// categoryIds — birlashtirilgan kategoriyalar ro'yxati (masalan xonaki + ekzotik: [1, 4])
const Mahsulotlar = ({ categoryId, categoryIds, searchTerm, categories }) => {
  const [gullar, setGullar] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedGul, setSelectedGul] = useState(null);
  const [count, setCount] = useState(1);
  const [tab, setTab] = useState("info");
  const [izohlar, setIzohlar] = useState([]);
  const [loadingIz, setLoadingIz] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ ism: "", baho: 0, matn: "" });
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  const showToast = (t) => {
    setToast(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2600);
  };

  // Kategoriyalar kaliti: "1,4" yoki "3" yoki "" (hammasi)
  const idsKey =
    Array.isArray(categoryIds) && categoryIds.length > 0
      ? categoryIds.join(",")
      : categoryId
      ? String(categoryId)
      : "";

  // Barcha kategoriyalar kaliti (massiv har renderda yangilansa ham effekt qayta ishlamasligi uchun)
  const catKey = Array.isArray(categories)
    ? categories.filter((c) => c && c.id).map((c) => c.id).join(",")
    : "";

  // Mahsulotlarni yuklash
  useEffect(() => {
    let cancelled = false;
    setIsRefreshing(true);

    const base = `${API}/gullar?q=${encodeURIComponent(searchTerm || "")}`;
    const allCatIds = catKey ? catKey.split(",") : [];
    const selected = idsKey ? idsKey.split(",") : [];

    // "Hammasi": hech narsa tanlanmagan yoki hamma kategoriya tanlangan
    const coversAll = allCatIds.length > 0 && allCatIds.every((id) => selected.includes(id));
    const isAll = !searchTerm && (selected.length === 0 || coversAll);

    let urls;
    if (searchTerm) {
      urls = [base]; // qidiruv — kategoriyasiz
    } else if (isAll) {
      // Avval filtrsiz (kategoriyasi yoʻq gullar ham chiqadi),
      // keyin har bir kategoriya boʻyicha — natijalar birlashtiriladi
      urls = [base, ...allCatIds.map((id) => `${base}&kategoriya_id=${id}`)];
    } else {
      urls = selected.map((id) => `${base}&kategoriya_id=${id}`);
    }

    Promise.all(urls.map((u) => fetchAllPages(u).catch(() => null))).then((results) => {
      if (cancelled) return;

      // Hamma so'rovlar xato bo'lsa — eski ro'yxat qoladi
      if (results.every((r) => r === null)) {
        setIsRefreshing(false);
        return;
      }

      // Natijalarni birlashtirish va takrorlarni olib tashlash
      const seen = new Set();
      const merged = [];
      results.forEach((list) => {
        (list || []).forEach((gul) => {
          if (!seen.has(gul.id)) {
            seen.add(gul.id);
            merged.push(gul);
          }
        });
      });

      setGullar(merged);
      setIsRefreshing(false);
    });

    return () => {
      cancelled = true;
    };
  }, [idsKey, catKey, searchTerm]);

  // Saqlangan ismni olish
  useEffect(() => {
    try { setForm((f) => ({ ...f, ism: localStorage.getItem("izoh_ism") || "" })); } catch {}
  }, []);

  // Modal ochilganda izohlarni yuklash
  useEffect(() => {
    if (!selectedGul) return;
    let ok = true;
    setLoadingIz(true);
    fetchIzohlar(selectedGul.id).then((d) => {
      if (ok) {
        setIzohlar(d);
        setLoadingIz(false);
      }
    });
    return () => { ok = false; };
  }, [selectedGul?.id]);

  // Modal ochiqligida: sahifa qotadi, Esc bilan yopiladi
  useEffect(() => {
    if (!selectedGul) return;
    const onKey = (e) => e.key === "Escape" && setSelectedGul(null);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedGul]);

  const openGul = (gul) => {
    setSelectedGul(gul);
    setCount(1);
    setTab("info");
    setIzohlar([]);
    setLoadingIz(true);
    setForm((f) => ({ ...f, baho: 0, matn: "" }));
  };

  const increment = (e) => {
    e.stopPropagation();
    if (selectedGul && count < Number(selectedGul.soni)) setCount((p) => p + 1);
  };
  const decrement = (e) => {
    e.stopPropagation();
    if (count > 1) setCount((p) => p - 1);
  };

  const getCatName = (id) => {
    const cat = categories?.find((c) => Number(c.id) === Number(id));
    return cat ? cat.nomi : "Kategoriya";
  };

  // SAVATGA QOʻSHISH
  // SAVATGA QOʻSHISH
const handleAddToCart = () => {
  if (!selectedGul || Number(selectedGul.soni) === 0) {
    showToast("Kechirasiz, ushbu mahsulot omborda qolmagan.");
    return;
  }

  const maxSoni = Number(selectedGul.soni); // bazadagi qoldiq

  const cartItem = {
    id: selectedGul.id,
    nomi: selectedGul.gulnomi,
    narxi: selectedGul.gulnarxi,
    rasmi: selectedGul.gulrasmi,
    miqdori: count,
    jamiNarxi: count * Number(selectedGul.gulnarxi),
    maxSoni: maxSoni, // <-- SHU QATOR QO'SHILDI
  };

  let currentCart = [];
  try {
    const data = JSON.parse(localStorage.getItem("savat"));
    currentCart = Array.isArray(data) ? data : [];
  } catch {
    currentCart = [];
  }

  const idx = currentCart.findIndex((item) => item.id === cartItem.id);
  if (idx > -1) {
    const yangi = currentCart[idx].miqdori + count;
    if (yangi > maxSoni) {
      showToast(`Omborda jami ${maxSoni} dona bor. Savatda ${currentCart[idx].miqdori} dona mavjud.`);
      return;
    }
    currentCart[idx].miqdori = yangi;
    currentCart[idx].jamiNarxi = yangi * Number(selectedGul.gulnarxi);
    currentCart[idx].maxSoni = maxSoni; // <-- SHU QATOR QO'SHILDI (zaxira yangilanadi)
  } else {
    currentCart.push(cartItem);
  }

  localStorage.setItem("savat", JSON.stringify(currentCart));
  window.dispatchEvent(new Event("cartUpdated"));
  showToast(`${selectedGul.gulnomi} savatga qoʻshildi! 🌿`);
  setSelectedGul(null);
};

  // IZOH YUBORISH
  const submitIzoh = async (e) => {
    e.preventDefault();
    if (!form.baho) return showToast("Yulduzcha bosib baho bering");
    if (form.matn.trim().length < 3) return showToast("Izoh matnini yozing");
    setSending(true);
    const item = await sendIzoh({
      gul_id: selectedGul.id,
      ism: form.ism.trim() || "Mehmon",
      baho: form.baho,
      matn: form.matn.trim(),
    });
    const list = [item, ...izohlar];
    const s = stat(list);
    setIzohlar(list);
    setGullar((g) => g.map((x) => (x.id === selectedGul.id ? { ...x, baho: s.avg, izohlar_soni: s.n } : x)));
    try { localStorage.setItem("izoh_ism", form.ism.trim()); } catch {}
    setForm((f) => ({ ...f, baho: 0, matn: "" }));
    setSending(false);
    showToast("Izohingiz uchun rahmat! 🌿");
  };

  const ms = selectedGul
    ? loadingIz
      ? { avg: Number(selectedGul.baho) || 0, n: Number(selectedGul.izohlar_soni) || 0 }
      : stat(izohlar)
    : null;
  const out = selectedGul && Number(selectedGul.soni) === 0;

  return (
    <section className="catalog-section" id="mahsulotlar">
      <div className="custom-container">
        {gullar.length > 0 ? (
          <div className={`product-grid ${isRefreshing ? "refreshing" : ""}`}>
            {gullar.map((gul, i) => {
              const soni = Number(gul.soni) || 0;
              const baho = Number(gul.baho) || 0;
              const n = Number(gul.izohlar_soni) || 0;
              return (
                <div
                  className="flower-card"
                  key={gul.id}
                  style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
                  onClick={() => openGul(gul)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openGul(gul);
                    }
                  }}
                >
                  <div className="flower-img-box">
                    <img
                      ref={(el) => el && el.complete && el.classList.add("loaded")}
                      onLoad={(e) => e.currentTarget.classList.add("loaded")}
                      onError={(e) => e.currentTarget.classList.add("loaded")}
                      loading="lazy"
                      src={`${IMG}${gul.gulrasmi}`}
                      alt={gul.gulnomi}
                    />
                    {soni === 0 && <span className="stock-badge out">Tugagan</span>}
                    {soni > 0 && soni <= 3 && <span className="stock-badge">Oxirgi {soni} ta</span>}
                  </div>

                  <div className="flower-info">
                    <h3 className="flower-name">{gul.gulnomi}</h3>
                    <div className="card-rating">
                      <Stars value={baho} size={15} />
                      <span>{n > 0 ? `${baho.toFixed(1)} (${n})` : "Baho yoʻq"}</span>
                    </div>
                    <p className="flower-price">{Number(gul.gulnarxi).toLocaleString()} UZS</p>
                    <p className={`flower-stock ${soni <= 3 ? "low" : ""}`}>
                      Omborda: <b>{soni}</b> dona
                    </p>
                    <button className="view-btn">Batafsil</button>
                  </div>
                </div>
              );
            })}
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
                  Siz qidirgan gul maʼlumotlari saytda mavjud emas. <br />
                  Boshqa kategoriyalarni sinab koʻring.
                </p>
              </div>
            </div>
          )
        )}

        {/* ===== KATTA MODAL ===== */}
        {selectedGul && (
          <div className="modal-overlay" onClick={() => setSelectedGul(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
              <button className="close-x-btn" onClick={() => setSelectedGul(null)} aria-label="Yopish">
                <img src={closeIcon} alt="X" />
              </button>

              <div className="modal-content-flex">
                <div className="modal-image-side">
                  <img src={`${IMG}${selectedGul.gulrasmi}`} alt={selectedGul.gulnomi} />
                </div>

                <div className="modal-details-side">
                  <span className="modal-category-tag">{getCatName(selectedGul.kategoriya_id)}</span>
                  <h2 className="modal-product-title">{selectedGul.gulnomi}</h2>

                  <div className="modal-meta">
                    <button className="modal-rating" onClick={() => setTab("izoh")}>
                      <Stars value={ms.avg} size={18} />
                      <b>{ms.n ? ms.avg.toFixed(1) : "0.0"}</b>
                      <span>({ms.n} ta izoh)</span>
                    </button>
                    <span className={`modal-stock ${Number(selectedGul.soni) <= 3 ? "low" : ""}`}>
                      Omborda: <b>{Number(selectedGul.soni) || 0}</b> dona
                    </span>
                  </div>

                  <div className="modal-info-grid">
                    <div className="info-item">
                      <span className="label">Narxi:</span>
                      <span className="value">{Number(selectedGul.gulnarxi).toLocaleString()} UZS</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Omborda:</span>
                      <span className={`value ${out ? "out-of-stock" : ""}`}>{selectedGul.soni || 0} dona</span>
                    </div>
                  </div>

                  <div className="modal-tabs" role="tablist">
                    <button className={tab === "info" ? "on" : ""} onClick={() => setTab("info")}>
                      Maʼlumot
                    </button>
                    <button className={tab === "izoh" ? "on" : ""} onClick={() => setTab("izoh")}>
                      Izohlar ({ms.n})
                    </button>
                  </div>

                  <div className="modal-tab-body" key={tab}>
                    {tab === "info" ? (
                      <div className="modal-description-box">
                        <p>{selectedGul.gulmalumoti || "Maʼlumot tez kunda qoʻshiladi."}</p>
                      </div>
                    ) : (
                      <>
                        <div className="rating-summary">
                          <div className="rs-big">
                            <strong>{ms.n ? ms.avg.toFixed(1) : "0.0"}</strong>
                            <Stars value={ms.avg} size={16} />
                            <small>{ms.n} ta izoh</small>
                          </div>
                          <div className="rs-bars">
                            {[5, 4, 3, 2, 1].map((s) => {
                              const c = izohlar.filter((r) => Math.round(r.baho) === s).length;
                              return (
                                <div className="rs-row" key={s}>
                                  <span>{s}★</span>
                                  <i><b style={{ width: `${ms.n ? (c / ms.n) * 100 : 0}%` }} /></i>
                                  <span>{c}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <form className="izoh-form" onSubmit={submitIzoh}>
                          <h4>Izoh qoldiring</h4>
                          <StarInput value={form.baho} onChange={(b) => setForm({ ...form, baho: b })} />
                          <input
                            type="text"
                            placeholder="Ismingiz"
                            maxLength={60}
                            value={form.ism}
                            onChange={(e) => setForm({ ...form, ism: e.target.value })}
                          />
                          <textarea
                            rows={3}
                            maxLength={500}
                            placeholder="Gul haqida fikringiz…"
                            value={form.matn}
                            onChange={(e) => setForm({ ...form, matn: e.target.value })}
                          />
                          <button type="submit" className="send-btn" disabled={sending}>
                            {sending ? "Yuborilmoqda…" : "Yuborish"}
                          </button>
                        </form>

                        <div className="izoh-list">
                          {loadingIz ? (
                            <p className="izoh-empty">Izohlar yuklanmoqda…</p>
                          ) : izohlar.length === 0 ? (
                            <p className="izoh-empty">Hali izoh yoʻq. Birinchi boʻlib fikr bildiring! 🌱</p>
                          ) : (
                            izohlar.map((r) => (
                              <div className="izoh-item" key={r.id}>
                                <div className="avatar">{(r.ism || "M").charAt(0).toUpperCase()}</div>
                                <div className="izoh-body">
                                  <div className="izoh-top">
                                    <b>{r.ism || "Mehmon"}</b>
                                    <Stars value={Number(r.baho)} size={14} />
                                  </div>
                                  <p>{r.matn}</p>
                                  <small>{fmtDate(r.sana)}</small>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="modal-footer">
                    <div className="total-price-box">
                      <span className="total-label">Jami narx:</span>
                      <span className="total-value">
                        {(count * Number(selectedGul.gulnarxi)).toLocaleString()} UZS
                      </span>
                    </div>
                    <div className="modal-footer-controls">
                      <div className="counter-wrapper">
                        <button onClick={decrement} disabled={count <= 1}>−</button>
                        <span className="count-display">{count}</span>
                        <button onClick={increment} disabled={count >= Number(selectedGul.soni)}>+</button>
                      </div>
                      <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={out}>
                        {out ? "Zaxirada yoʻq" : "Savatga qoʻshish"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`gb-toast ${toast ? "on" : ""}`} role="status">{toast}</div>
    </section>
  );
};

export default Mahsulotlar;