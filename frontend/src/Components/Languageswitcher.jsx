// LanguageSwitcher.jsx
// Ishlatish: import LanguageSwitcher from './LanguageSwitcher';
// Flaglar: src/assets/flags/ papkasiga qo'ying:
//   uz.png, ru.png, en.png, kk.png, ky.png, tg.png, tr.png

import { useState, useRef, useEffect, useCallback } from "react";

// === FLAG RASMLARI ===
// Rasmlaringizni src/assets/flags/ papkasiga qo'ying va shu importlarni yoqing:
 import uzFlag from "../assets/flags/uz.png";
 import ruFlag from "../assets/flags/ru.png";
 import enFlag from "../assets/flags/en.png";
 import kkFlag from "../assets/flags/kk.png";
 import kyFlag from "../assets/flags/ky.png";
 import tgFlag from "../assets/flags/tg.png";
 import trFlag from "../assets/flags/tr.png";

// Hozircha placeholder flag URL'lari (o'z rasmlaringizni import qilib almashtiring):


// Agar import ishlatmoqchi bo'lsangiz, yuqoridagi FLAGS ni shu ko'rinishga o'zgartiring:
 const FLAGS = { uz: uzFlag, ru: ruFlag, en: enFlag, kk: kkFlag, ky: kyFlag, tg: tgFlag, tr: trFlag };

const LANGUAGES = [
  { code: "uz", label: "O'zbekcha", gtCode: "uz" },
  { code: "ru", label: "Русский",   gtCode: "ru" },
  { code: "en", label: "English",   gtCode: "en" },
  { code: "kk", label: "Қазақша",  gtCode: "kk" },
  { code: "ky", label: "Кыргызча", gtCode: "ky" },
  { code: "tg", label: "Тоҷикӣ",   gtCode: "tg" },
  { code: "tr", label: "Türkçe",   gtCode: "tr" },
];

// Google Translate cookie yordamida til o'zgartirish
function changeGoogleTranslateLanguage(langCode) {
  // Google Translate cookie'sini o'rnatamiz
  const cookieValue = `/auto/${langCode}`;
  const domain = window.location.hostname;
  document.cookie = `googtrans=${cookieValue};domain=${domain};path=/`;
  document.cookie = `googtrans=${cookieValue};domain=.${domain};path=/`;

  // Sahifani yangilaymiz yoki Google Translate elementini triggerlaymiz
  const selectEl = document.querySelector(".goog-te-combo");
  if (selectEl) {
    selectEl.value = langCode;
    selectEl.dispatchEvent(new Event("change"));
  } else {
    // Widget yuklanmagan bo'lsa, sahifani reload qilamiz
    window.location.reload();
  }
}

// Google Translate skriptini yuklash
function loadGoogleTranslate(defaultLang = "uz") {
  if (document.getElementById("google-translate-script")) return;

  window.googleTranslateElementInit = function () {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: defaultLang,
        includedLanguages: "uz,ru,en,kk,ky,tg,tr",
        autoDisplay: false,
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );
  };

  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src =
    "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

// Globe SVG icon
function GlobeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563EB"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0 }}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

// Chevron icon
function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        color: "#16a34a",
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(LANGUAGES[0]);
  const [imgErrors, setImgErrors] = useState({});
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Google Translate yuklash
  useEffect(() => {
    loadGoogleTranslate(current.gtCode);

    // Saqlangan tilni cookie'dan o'qish
    const match = document.cookie.match(/googtrans=\/[^/]+\/([^;]+)/);
    if (match) {
      const savedLang = LANGUAGES.find((l) => l.gtCode === match[1]);
      if (savedLang) setCurrent(savedLang);
    }
  }, []);

  // Tashqariga bosish — dropdown yopilsin
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectLanguage = useCallback((lang) => {
    setCurrent(lang);
    setOpen(false);
    changeGoogleTranslateLanguage(lang.gtCode);
  }, []);

  const handleImgError = (code) => {
    setImgErrors((prev) => ({ ...prev, [code]: true }));
  };

  return (
    <>
      {/* Google Translate elementi yashirin */}
      <div
        id="google_translate_element"
        style={{ display: "none", position: "absolute", visibility: "hidden" }}
      />

      {/* CSS stillar */}
      <style>{`
        .ls-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          font-family: 'Segoe UI', 'Roboto', sans-serif;
          user-select: none;
        }

        .ls-button {
        margin-left: 100px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #ffffff;
          border: 1.5px solid #d1fae5;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.10);
          transition:
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
          outline: none;
          min-width: 150px;
          justify-content: space-between;
        }
        .ls-button:hover {
          border-color: #16a34a;
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.18);
          background: #f0fdf4;
        }
        .ls-button:focus-visible {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.25);
        }
        .ls-button.ls-open {
          border-color: #16a34a;
          background: #f0fdf4;
          box-shadow: 0 4px 20px rgba(22, 163, 74, 0.20);
        }

        .ls-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ls-flag {
          width: 22px;
          height: 22px;
          object-fit: cover;
          border-radius: 3px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.15);
          flex-shrink: 0;
        }
        .ls-flag-placeholder {
          width: 22px;
          height: 16px;
          background: linear-gradient(135deg, #d1fae5, #86efac);
          border-radius: 3px;
          flex-shrink: 0;
        }

        .ls-label {
          font-size: 14px;
          font-weight: 500;
          color: #15803d;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        /* Dropdown */
        .ls-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 180px;
          background: #ffffff;
          border: 1.5px solid #d1fae5;
          border-radius: 14px;
          box-shadow:
            0 8px 32px rgba(22, 163, 74, 0.13),
            0 2px 8px rgba(0,0,0,0.07);
          z-index: 9999;
          overflow: hidden;
          transform-origin: top right;
          animation: ls-dropdown-in 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes ls-dropdown-in {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(-6px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .ls-dropdown.ls-closing {
          animation: ls-dropdown-out 0.18s ease forwards;
        }
        @keyframes ls-dropdown-out {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.92) translateY(-6px); }
        }

        .ls-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          cursor: pointer;
          transition:
            background 0.18s ease,
            color 0.18s ease;
          border: none;
          background: transparent;
          width: 100%;
          text-align: left;
        }
        .ls-option:hover {
          background: #f0fdf4;
        }
        .ls-option.ls-active {
          background: #dcfce7;
        }
        .ls-option:first-child { border-radius: 13px 13px 0 0; }
        .ls-option:last-child  { border-radius: 0 0 13px 13px; }

        .ls-option-label {
          font-size: 13.5px;
          font-weight: 500;
          color: #166534;
        }
        .ls-option.ls-active .ls-option-label {
          color: #15803d;
          font-weight: 600;
        }

        .ls-check {
          margin-left: auto;
          color: #16a34a;
          opacity: 0;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .ls-option.ls-active .ls-check {
          opacity: 1;
        }

        /* Google Translate bannerni yashirish */
        .goog-te-banner-frame.skiptranslate,
        .goog-te-gadget,
        #goog-gt-tt,
        .goog-te-balloon-frame,
        div#goog-gt- {
          display: none !important;
          visibility: hidden !important;
        }
        body { top: 0 !important; }
        .skiptranslate { display: none !important; }

        /* Divider */
        .ls-divider {
          height: 1px;
          background: #d1fae5;
          margin: 0;
        }
      `}</style>

      <div className="ls-wrapper">
        {/* Asosiy tugma */}
        <button
          ref={buttonRef}
          className={`ls-button${open ? " ls-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Tilni tanlash"
        >
          <span className="ls-left">
            <GlobeIcon />
            {imgErrors[current.code] ? (
              <span className="ls-flag-placeholder" />
            ) : (
              <img
                src={FLAGS[current.code]}
                alt={current.label}
                className="ls-flag"
                onError={() => handleImgError(current.code)}
              />
            )}
            <span className="ls-label">{current.label}</span>
          </span>
          <ChevronIcon open={open} />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            ref={dropdownRef}
            className="ls-dropdown"
            role="listbox"
            aria-label="Tillar"
          >
            {LANGUAGES.map((lang, idx) => (
              <div key={lang.code}>
                <button
                  className={`ls-option${lang.code === current.code ? " ls-active" : ""}`}
                  role="option"
                  aria-selected={lang.code === current.code}
                  onClick={() => selectLanguage(lang)}
                >
                  {imgErrors[lang.code] ? (
                    <span className="ls-flag-placeholder" />
                  ) : (
                    <img
                      src={FLAGS[lang.code]}
                      alt={lang.label}
                      className="ls-flag"
                      onError={() => handleImgError(lang.code)}
                    />
                  )}
                  <span className="ls-option-label">{lang.label}</span>
                  <svg
                    className="ls-check"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                {idx < LANGUAGES.length - 1 && <div className="ls-divider" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}