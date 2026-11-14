import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './RegisterModal.css';
import hisobImg from '../assets/hisob.png'; // yo'l boshqacha bo'lsa shu qatorni moslang

/*
  Roʻyxatdan oʻtish / Hisobga kirish oynasi.
  Navbar'da shunday chaqiriladi:
    <RegisterModal open={showRegister} onClose={() => setShowRegister(false)} />

  Ixtiyoriy props:
    initialMode   — 'register' (standart) yoki 'login'
    image         — oʻz rasmingiz (masalan "/auth.jpg"); pastdagi AUTH_IMAGE ga ham yozsa boʻladi
    showCaption   — rasm ustidagi yozuvni koʻrsatish (standart: true)
    onRegister    — ({ name, phone, email }) => ...   (async boʻlishi mumkin)
    onLogin       — ({ name, password }) => ...       (async boʻlishi mumkin)
    onGoogleLogin — () => ...

  MUHIM: oyna createPortal orqali <body> ga chiqariladi. Navbar'da backdrop-filter
  bor, shuning uchun portalsiz "position: fixed" oyna butun ekranni emas,
  faqat navbar ichini egallab qolardi.
*/

// Rasm: assets/hisob.png (yuqoridagi import). Props orqali `image` bilan almashtirsa ham boʻladi.
const AUTH_IMAGE = hisobImg;

/* ------------------------------------------------------------------ */
/*  Yordamchi funksiyalar                                              */
/* ------------------------------------------------------------------ */

const noop = () => {};

const EMPTY_REGISTER = { name: '', phone: '', email: '', password: '' };
const EMPTY_LOGIN = { name: '', password: '' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// "901234567" -> "90 123 45 67"
const formatPhone = (raw) => {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('998') && digits.length > 9) {
    digits = digits.slice(3);
  }
  digits = digits.slice(0, 9);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ];
  return parts.filter(Boolean).join(' ');
};

const validateRegister = ({ name, phone, email, password }) => {
  const errors = {};

  if (!name.trim()) errors.name = 'Ismingizni kiriting';
  else if (name.trim().length < 2) errors.name = "Ism kamida 2 ta harfdan iborat bo'lsin";

  if (phone.replace(/\D/g, '').length !== 9) {
    errors.phone = "Telefon raqamni to'liq kiriting";
  }

  if (!email.trim()) errors.email = 'Emailni kiriting';
  else if (!EMAIL_RE.test(email.trim())) errors.email = "Email noto'g'ri kiritilgan";

  if (!password) errors.password = 'Parol yarating';
  else if (password.length < 6) errors.password = "Parol kamida 6 ta belgidan iborat bo'lsin";

  return errors;
};

const validateLogin = ({ name, password }) => {
  const errors = {};
  if (!name.trim()) errors.name = 'Ismingizni kiriting';
  if (!password) errors.password = 'Parolni kiriting';
  return errors;
};

/* ------------------------------------------------------------------ */
/*  Ikonkalar                                                          */
/* ------------------------------------------------------------------ */

const Svg = ({ className, children }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconUser = () => (
  <Svg className="reg-input-icon">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
  </Svg>
);

const IconPhone = () => (
  <Svg className="reg-input-icon">
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
  </Svg>
);

const IconMail = () => (
  <Svg className="reg-input-icon">
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m3 7 9 6 9-6" />
  </Svg>
);

const IconLock = () => (
  <Svg className="reg-input-icon">
    <rect x="5" y="11" width="14" height="9" rx="2.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

const IconEye = () => (
  <Svg className="reg-eye-icon">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
);

const IconEyeOff = () => (
  <Svg className="reg-eye-icon">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    <path d="M4 4l16 16" />
  </Svg>
);

const IconClose = () => (
  <Svg className="reg-close-icon">
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

const GoogleLogo = () => (
  <svg className="reg-google-logo" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Input uchun o'ram (komponent tashqarida — fokus yo'qolmasligi uchun) */
/* ------------------------------------------------------------------ */

const Field = ({ icon, error, children }) => (
  <div className={`reg-field${error ? ' has-error' : ''}`}>
    <div className="reg-input-wrap">
      {icon}
      {children}
    </div>
    <span className="reg-error" role="alert">
      {error || ''}
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Asosiy komponent                                                   */
/* ------------------------------------------------------------------ */

const RegisterModal = ({
  open,
  onClose,
  initialMode = 'register',
  image = AUTH_IMAGE,
  showCaption = true,
  onRegister = noop,
  onLogin = noop,
  onGoogleLogin = noop,
}) => {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER);
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN);
  const [registerErrors, setRegisterErrors] = useState({});
  const [loginErrors, setLoginErrors] = useState({});

  const isLogin = mode === 'login';

  // Oyna yopilganda hammasi boshlang'ich holatga qaytadi
  useEffect(() => {
    if (open) return;
    setMode(initialMode);
    setShowPassword(false);
    setIsSubmitting(false);
    setRegisterForm(EMPTY_REGISTER);
    setLoginForm(EMPTY_LOGIN);
    setRegisterErrors({});
    setLoginErrors({});
  }, [open, initialMode]);

  // Esc bosilganda yopish va oyna ochiq paytda orqa sahifa aylanmasligi
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && typeof onClose === 'function') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const closeModal = () => {
    if (typeof onClose === 'function') onClose();
  };

  const switchMode = (next) => {
    if (isSubmitting) return;
    setRegisterErrors({});
    setLoginErrors({});
    setShowPassword(false);
    setMode(next);
  };

  // Faqat qora fonning o'zi bosilganda yopiladi (oyna ichidan matn belgilab
  // tashqarida qo'yib yuborilsa, oyna yopilib ketmaydi)
  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) closeModal();
  };

  /* ---------- Ro'yxatdan o'tish ---------- */

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: name === 'phone' ? formatPhone(value) : value,
    }));
    setRegisterErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateRegister(registerForm);
    setRegisterErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onRegister({
        name: registerForm.name.trim(),
        phone: `+998${registerForm.phone.replace(/\D/g, '')}`,
        email: registerForm.email.trim(),
        password: registerForm.password,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- Hisobga kirish ---------- */

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    setLoginErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const nextErrors = validateLogin(loginForm);
    setLoginErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      await onLogin({
        name: loginForm.name.trim(),
        password: loginForm.password,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    // onClick stopPropagation: portal ichidagi bosishlar React daraxti bo'ylab
    // Navbar'ga (onClick'lari bor ota elementlarga) chiqib ketmasligi uchun
    <div
      className="reg-overlay"
      onMouseDown={handleOverlayMouseDown}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`reg-modal ${isLogin ? 'is-login' : 'is-register'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={isLogin ? 'reg-title-login' : 'reg-title-register'}
      >
        <button type="button" className="reg-close" onClick={closeModal} aria-label="Yopish">
          <IconClose />
        </button>

        {/* ===================== HISOB YARATISH ===================== */}
        <section
          className={`reg-panel reg-panel--register${!isLogin ? ' is-active' : ''}`}
          aria-hidden={isLogin}
        >
          <form className="reg-form" onSubmit={handleRegisterSubmit} noValidate>
            <header className="reg-head">
              <h2 id="reg-title-register" className="reg-title">
                Hisob yaratish
              </h2>
              <p className="reg-subtitle">Bir necha soniyada ro'yxatdan o'ting</p>
            </header>

            <Field icon={<IconUser />} error={registerErrors.name}>
              <input
                className="reg-input"
                type="text"
                name="name"
                placeholder="Ism"
                value={registerForm.name}
                onChange={handleRegisterChange}
                autoComplete="name"
                aria-invalid={Boolean(registerErrors.name)}
              />
            </Field>

            <Field icon={<IconPhone />} error={registerErrors.phone}>
              <span className="reg-prefix">+998</span>
              <input
                className="reg-input reg-input--phone"
                type="tel"
                inputMode="numeric"
                name="phone"
                placeholder="90 123 45 67"
                value={registerForm.phone}
                onChange={handleRegisterChange}
                autoComplete="tel-national"
                aria-invalid={Boolean(registerErrors.phone)}
              />
            </Field>

            <Field icon={<IconMail />} error={registerErrors.email}>
              <input
                className="reg-input"
                type="email"
                name="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                autoComplete="email"
                aria-invalid={Boolean(registerErrors.email)}
              />
            </Field>

            <Field icon={<IconLock />} error={registerErrors.password}>
              <input
                className="reg-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Parol yarating"
                value={registerForm.password}
                onChange={handleRegisterChange}
                autoComplete="new-password"
                aria-invalid={Boolean(registerErrors.password)}
              />
              <button
                type="button"
                className="reg-eye"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </Field>

            <div className="reg-actions">
              <button type="submit" className="reg-btn" disabled={isSubmitting}>
                {isSubmitting && <span className="reg-spinner" />}
                Hisob yaratish
              </button>
              <button
                type="button"
                className="reg-link"
                onClick={() => switchMode('login')}
                disabled={isSubmitting}
              >
                Hisobga kirish
              </button>
            </div>

            <button
              type="button"
              className="reg-google"
              onClick={() => onGoogleLogin()}
              disabled={isSubmitting}
            >
              <span className="reg-google-icon">
                <GoogleLogo />
              </span>
              <span className="reg-google-label">Google orqali kirish</span>
            </button>
          </form>
        </section>

        {/* ======================= HISOBGA KIRISH ======================= */}
        <section
          className={`reg-panel reg-panel--login${isLogin ? ' is-active' : ''}`}
          aria-hidden={!isLogin}
        >
          <form className="reg-form" onSubmit={handleLoginSubmit} noValidate>
            <header className="reg-head">
              <h2 id="reg-title-login" className="reg-title">
                Hisobga kirish
              </h2>
              <p className="reg-subtitle">Qaytganingizdan xursandmiz</p>
            </header>

            <Field icon={<IconUser />} error={loginErrors.name}>
              <input
                className="reg-input"
                type="text"
                name="name"
                placeholder="Ism"
                value={loginForm.name}
                onChange={handleLoginChange}
                autoComplete="username"
                aria-invalid={Boolean(loginErrors.name)}
              />
            </Field>

            <Field icon={<IconLock />} error={loginErrors.password}>
              <input
                className="reg-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Parol"
                value={loginForm.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
                aria-invalid={Boolean(loginErrors.password)}
              />
              <button
                type="button"
                className="reg-eye"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </Field>

            <div className="reg-actions">
              <button type="submit" className="reg-btn" disabled={isSubmitting}>
                {isSubmitting && <span className="reg-spinner" />}
                Hisobga kirish
              </button>
              <button
                type="button"
                className="reg-link"
                onClick={() => switchMode('register')}
                disabled={isSubmitting}
              >
                Hisob yaratish
              </button>
            </div>
          </form>
        </section>

        {/* ============== RASM PANELI (silliq siljib o'tadi) ============== */}
        <aside className="reg-media" aria-hidden="true">
          {image ? (
            <img className="reg-media-img" src={image} alt="" draggable="false" />
          ) : (
            <>
              <span className="reg-orb reg-orb--1" />
              <span className="reg-orb reg-orb--2" />
              <span className="reg-orb reg-orb--3" />
            </>
          )}

          {showCaption && (
            <div className="reg-media-caption" key={mode}>
              <h3>{isLogin ? 'Qaytganingiz bilan!' : 'Xush kelibsiz!'}</h3>
              <p>
                {isLogin
                  ? 'Hisobingizga kiring va davom eting.'
                  : 'Yangi hisob yarating va imkoniyatlardan foydalaning.'}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>,
    document.body
  );
};

export default RegisterModal;